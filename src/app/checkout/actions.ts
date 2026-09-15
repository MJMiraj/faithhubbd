"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import Stripe from 'stripe';
import { sendOrderReceiptEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function processCheckout(
  customerData: { firstName: string, lastName: string, email: string, phone: string, address: string },
  cartItems: { id: string, name: string, price: number, quantity: number, selectedColor?: string, selectedSize?: string }[],
  shippingMethodId?: string,
  couponCode?: string,
  paymentGateway?: string,
  trxId?: string,
  senderNumber?: string,
  saveAddress?: boolean
) {
  try {
    if (!cartItems.length) {
      return { error: "Cart is empty." };
    }

    // Verify all products still exist in the database (handles old cart data after db reset)
    const productIds = cartItems.map(item => item.id);
    const existingProducts = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    });
    if (existingProducts.length !== productIds.length) {
      return { error: "Some items in your cart are no longer available. Please clear your cart and try again." };
    }

    // Calculate Subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Server-side validation of shipping and discount
    let shippingFee = 0;
    if (shippingMethodId) {
      const shippingMethod = await db.shippingMethod.findUnique({ where: { id: shippingMethodId } });
      if (shippingMethod) shippingFee = shippingMethod.price;
    }

    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const res = await validateCoupon(couponCode, subtotal);
      if (!res.error && res.discountAmount) {
        discountAmount = res.discountAmount;
        appliedCoupon = await db.coupon.findUnique({ where: { code: couponCode } });
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Apply Free Shipping Threshold
    const settings = await db.storeSettings.findUnique({ where: { id: "global_settings" } });
    if (settings?.freeShippingThreshold !== null && settings?.freeShippingThreshold !== undefined && settings.freeShippingThreshold > 0) {
      if (discountedSubtotal >= settings.freeShippingThreshold) {
        shippingFee = 0;
      }
    }

    const totalAmount = discountedSubtotal + shippingFee;
    const orderNumber = `FH-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

    // Use Prisma transaction to ensure atomicity
    const { order, finalUser } = await db.$transaction(async (tx) => {
      // Find User by Email
      let user = await tx.user.findUnique({ where: { email: customerData.email } });
      
      if (!user) {
        // Check if phone already exists to prevent Unique Constraint Violation
        const phoneUser = await tx.user.findUnique({ where: { phone: customerData.phone } });
        
        user = await tx.user.create({
          data: {
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            // Only save phone if it doesn't already exist for another account
            phone: phoneUser ? null : customerData.phone,
            isActive: true
          }
        });
      }

      // Create Order with Items
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          couponCode: appliedCoupon?.code,
          status: "PENDING",
          shippingMethodId,
          paymentStatus: paymentGateway === 'STRIPE' ? 'PENDING' : 'PENDING',
          items: {
            create: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              variant: [item.selectedColor, item.selectedSize].filter(Boolean).join(" / ") || null
            }))
          },
          statusHistory: {
            create: {
              status: "PENDING",
              notes: "Order created."
            }
          }
        }
      });

      // Record Coupon Usage
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } }
        });
        await tx.couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            orderId: order.id
          }
        });
      }

      // Inventory Deduction & Strict Checks
      for (const item of cartItems) {
        // Main inventory deduction
        const inv = await tx.inventory.findUnique({ where: { productId: item.id } });
        if (inv) {
          if (inv.quantity < item.quantity) {
            throw new Error(`Oops! '${item.name}' only has ${inv.quantity} in stock.`);
          }
          await tx.inventory.update({
            where: { productId: item.id },
            data: { quantity: { decrement: item.quantity } }
          });
          // Log movement
          await tx.stockMovement.create({
            data: {
              inventoryId: inv.id,
              quantity: item.quantity,
              type: "OUT",
              reason: `Order Placed - #${order.orderNumber}`
            }
          });
        }
        
        // Variant-level deduction
        if (item.selectedColor || item.selectedSize) {
          // Find the exact variant by checking its VariantValues
          const variants = await tx.productVariant.findMany({
            where: { productId: item.id },
            include: { values: true }
          });
          
          let targetVariant = null;
          for (const variant of variants) {
            let matchesColor = !item.selectedColor; // if no color selected, consider it a match
            let matchesSize = !item.selectedSize;
            
            for (const val of variant.values) {
              if (item.selectedColor && val.attributeName.toLowerCase() === 'color' && val.value === item.selectedColor) matchesColor = true;
              if (item.selectedSize && val.attributeName.toLowerCase() === 'size' && val.value === item.selectedSize) matchesSize = true;
            }
            
            if (matchesColor && matchesSize) {
              targetVariant = variant;
              break;
            }
          }
          
          if (targetVariant) {
            if (targetVariant.stock < item.quantity) {
              throw new Error(`Oops! The specific variant for '${item.name}' is out of stock.`);
            }
            await tx.productVariant.update({
              where: { id: targetVariant.id },
              data: { stock: { decrement: item.quantity } }
            });
          }
        }
      }

      // Handle Mobile Banking Payment Creation
      if (paymentGateway === 'BKASH' || paymentGateway === 'NAGAD') {
        let pm = await tx.paymentMethod.findUnique({ where: { name: paymentGateway } });
        if (!pm) {
          pm = await tx.paymentMethod.create({ data: { name: paymentGateway } });
        }
        
        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.totalAmount,
            status: 'PENDING',
            transactionId: trxId,
            senderNumber: senderNumber,
            paymentMethodId: pm.id
          }
        });
        
        // Update order status specifically for manual verification
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'UNPAID' }
        });
      }

      // Reward Loyalty Points (1 point for every 100 spent)
      const pointsEarned = Math.floor(totalAmount / 100);
      if (pointsEarned > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            loyaltyPoints: {
              increment: pointsEarned
            }
          }
        });
      }

      // Save Address if requested
      if (saveAddress) {
        // Simple deduplication check
        const existingAddress = await tx.userAddress.findFirst({
          where: { userId: user.id, addressLine1: customerData.address }
        });
        if (!existingAddress) {
          await tx.userAddress.create({
            data: {
              userId: user.id,
              addressLine1: customerData.address,
              city: "Auto-detected", // Dummy data as we only asked for full address
              state: "Auto-detected",
              postalCode: "0000",
              country: "Bangladesh"
            }
          });
        }
      }

      return { order, finalUser: user };
    });

    const user = finalUser; // needed for scope below

    if (paymentGateway === 'STRIPE') {
      const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Mock Stripe Bypass
      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock')) {
        console.warn("[Stripe Mock] Simulating Stripe Checkout for order", order.id);
        const fakeSessionId = `cs_test_${Date.now()}`;
        await db.order.update({
          where: { id: order.id },
          data: { stripeSessionId: fakeSessionId }
        });
        return { success: true, redirectUrl: `${origin}/checkout/success?session_id=${fakeSessionId}&order_id=${order.id}` };
      }

      // Create Real Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'bdt',
              product_data: {
                name: `Order #${orderNumber}`,
                description: 'FaithHub BD Order',
              },
              unit_amount: Math.round(totalAmount * 100), // Stripe takes amounts in cents/paisa
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
        client_reference_id: order.id,
        customer_email: customerData.email,
      });

      // Update Order with Stripe Session ID
      await db.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id }
      });

      return { success: true, redirectUrl: session.url };
    }

    // Default: Manual/COD Flow
    // Send Order Confirmation Email for COD
    try {
      await sendOrderReceiptEmail(
        customerData.email,
        customerData.firstName,
        orderNumber,
        totalAmount,
        cartItems
      );
    } catch (e) {
      console.error("Failed to send COD email:", e);
    }

    revalidatePath("/admin/orders");
    
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return { success: true, redirectUrl: `${origin}/checkout/success?order_id=${order.id}` };

  } catch (error) {
    console.error("Checkout processing failed:", error);
    return { error: "Failed to process checkout. Please try again." };
  }
}

export async function getShippingMethods() {
  try {
    return await db.shippingMethod.findMany({
      orderBy: { price: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch shipping methods:", error);
    return [];
  }
}

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const coupon = await db.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return { error: "Invalid or inactive coupon code." };
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      return { error: "Coupon is not valid yet." };
    }
    if (now > coupon.validUntil) {
      return { error: "Coupon has expired." };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { error: "Coupon usage limit reached." };
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return { error: `Minimum purchase of ৳${coupon.minPurchase} required.` };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return { 
      success: true, 
      discountAmount,
      message: `Coupon applied! You saved ৳${discountAmount}.`
    };

  } catch (error) {
    console.error("Coupon validation error:", error);
    return { error: "Failed to validate coupon." };
  }
}
