"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { processCheckout, validateCoupon } from "./actions";
import { ShoppingBag, ArrowRight, AlertCircle, Phone, MapPin, Mail, User, ShieldCheck, Tag, Check, Truck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(11, "Valid phone number is required"),
  address: z.string().min(10, "Full shipping address is required"),
  shippingMethodId: z.string().min(1, "Please select a shipping method"),
  paymentGateway: z.enum(["COD", "STRIPE", "BKASH", "NAGAD"]),
  trxId: z.string().optional(),
  senderNumber: z.string().optional(),
  saveAddress: z.boolean().optional(),
}).refine((data) => {
  if ((data.paymentGateway === "BKASH" || data.paymentGateway === "NAGAD") && (!data.trxId || !data.senderNumber)) {
    return false;
  }
  return true;
}, {
  message: "Transaction ID and Sender Number are required for mobile banking",
  path: ["trxId"] // attach error to trxId
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface MobileBankingAccount {
  id: string;
  provider: string;
  type: string;
  number: string;
  isActive: boolean;
}

export function CheckoutForm({ 
  shippingMethods, 
  freeShippingThreshold = 1500, 
  mobileBankingAccounts = [],
  savedAddresses = [],
  userDetails = null
}: { 
  shippingMethods: any[], 
  freeShippingThreshold?: number | null, 
  mobileBankingAccounts?: MobileBankingAccount[],
  savedAddresses?: any[],
  userDetails?: any
}) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      email: userDetails?.email || "",
      phone: userDetails?.phone || "",
      address: savedAddresses.length > 0 ? savedAddresses[0].addressLine1 : "",
      shippingMethodId: shippingMethods.length > 0 ? shippingMethods[0].id : "",
      paymentGateway: "STRIPE",
      saveAddress: false
    }
  });

  const selectedShippingId = watch("shippingMethodId");
  const selectedPaymentGateway = watch("paymentGateway");
  const selectedShipping = shippingMethods.find(s => s.id === selectedShippingId);
  
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  // Calculate Shipping (Free if threshold met)
  let shippingFee = selectedShipping?.price || 0;
  let isFreeShipping = false;
  if (freeShippingThreshold !== null && freeShippingThreshold !== undefined && freeShippingThreshold > 0) {
    if (discountedSubtotal >= freeShippingThreshold) {
      shippingFee = 0;
      isFreeShipping = true;
    }
  }

  const totalAmount = discountedSubtotal + shippingFee;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    
    const res = await validateCoupon(couponCode, subtotal);
    if (res.error) {
      setCouponError(res.error);
      setDiscountAmount(0);
      setAppliedCoupon(null);
    } else if (res.discountAmount !== undefined) {
      setCouponSuccess(res.message || "Coupon applied!");
      setDiscountAmount(res.discountAmount);
      setAppliedCoupon(couponCode);
    }
    setIsApplyingCoupon(false);
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsPending(true);
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      setIsPending(false);
      return;
    }

    const cartData = items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const customerData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address
    };

    const res = await processCheckout(
        customerData, 
        cartData, 
        data.shippingMethodId,
        appliedCoupon || undefined,
        data.paymentGateway,
        data.trxId,
        data.senderNumber,
        data.saveAddress
    );

    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else if (res.redirectUrl) {
      // Clear cart
      clearCart();
      // Redirect to WhatsApp
      window.location.href = res.redirectUrl;
    }
  };

  if (!mounted) return null;

  if (!mounted) return null;

  if (items.length === 0 && !isPending) {
    return (
      <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some amazing products to your cart before checking out.</p>
        <a href="/shop" className="bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors inline-flex items-center gap-2">
          Back to Shop <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Checkout Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-7"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl shadow-brand/5 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Details</h2>
          </div>
          
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="bg-red-50 text-red-600 p-5 rounded-2xl flex items-center gap-3 border border-red-100 shadow-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-semibold text-sm">{error}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    {...register("firstName")}
                    className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs font-bold ml-1">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs font-bold ml-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="john@example.com"
                />
              </div>
              <p className="text-xs text-gray-500 font-semibold ml-1">Order confirmation and tracking will be sent here.</p>
              {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  {...register("phone")}
                  className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="01700000000"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs font-bold ml-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Delivery Address</label>
                {savedAddresses.length > 0 && (
                  <select 
                    className="text-xs font-bold text-brand bg-brand/5 border border-brand/20 rounded-lg px-2 py-1 outline-none cursor-pointer"
                    onChange={(e) => {
                      if (e.target.value) {
                        const addr = savedAddresses.find(a => a.id === e.target.value);
                        if (addr) setValue("address", addr.addressLine1);
                      } else {
                        setValue("address", "");
                      }
                    }}
                  >
                    <option value="">+ New Address</option>
                    {savedAddresses.map((addr: any) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.addressLine1.substring(0, 25)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium resize-none"
                  placeholder="House, Road, Area, City"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs font-bold ml-1">{errors.address.message}</p>}
              
              {userDetails && (
                <label className="flex items-center gap-2 ml-1 cursor-pointer w-fit group">
                  <input type="checkbox" {...register("saveAddress")} className="w-4 h-4 text-brand rounded focus:ring-brand border-gray-300" />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Save this address for future orders</span>
                </label>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      {/* Order Summary */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-5"
      >
        <div className="bg-white rounded-[2rem] p-8 md:p-10 sticky top-32 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center justify-between">
            Order Summary
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
          </h2>
          
          <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative shrink-0 pt-1">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    {item.imageUrl ? (
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        {item.selectedColor && `${item.selectedColor}`}
                        {item.selectedColor && item.selectedSize && " • "}
                        {item.selectedSize && `${item.selectedSize}`}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        type="button"
                        onClick={() => useCartStore.getState().updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-brand transition-colors text-gray-500 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <span className="text-lg font-medium leading-none">-</span>
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-brand transition-colors text-gray-500"
                      >
                        <span className="text-lg font-medium leading-none">+</span>
                      </button>
                    </div>
                    <p className="font-black text-gray-900">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-6 mb-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    placeholder="Enter discount code"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-gray-900 bg-gray-50/50 hover:bg-white placeholder:text-gray-400 font-medium uppercase disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={appliedCoupon ? () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(""); setCouponSuccess(""); } : handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-brand transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isApplyingCoupon ? "Applying..." : appliedCoupon ? "Remove" : "Apply"}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs font-bold">{couponError}</p>}
              {couponSuccess && <p className="text-green-500 text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3" /> {couponSuccess}</p>}
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-bold text-gray-700">Delivery Method</label>
              <div className="grid gap-3">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="relative flex cursor-pointer rounded-xl border-2 bg-white p-4 focus:outline-none has-[:checked]:border-brand has-[:checked]:bg-brand/5 border-gray-100 hover:border-gray-200">
                    <input type="radio" value={method.id} {...register("shippingMethodId")} className="sr-only" />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-gray-900">{method.name}</span>
                        <span className="mt-1 flex items-center text-xs text-gray-500 font-medium gap-1"><Truck className="w-3 h-3"/> {method.estimatedDays}</span>
                      </span>
                    </span>
                    <span className="font-black text-sm text-right flex flex-col items-end">
                      {isFreeShipping ? (
                        <>
                          <span className="text-gray-400 line-through text-xs">৳{method.price}</span>
                          <span className="text-green-500 uppercase tracking-wider text-[10px] mt-0.5">Free</span>
                        </>
                      ) : (
                        <span className="text-brand">৳{method.price}</span>
                      )}
                    </span>
                    <span className="absolute -inset-px rounded-xl border-2 border-transparent pointer-events-none has-[:checked]:border-brand" aria-hidden="true"></span>
                  </label>
                ))}
              </div>
              {errors.shippingMethodId && <p className="text-red-500 text-xs font-bold">{errors.shippingMethodId.message}</p>}
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-sm font-bold text-gray-700">Payment Method</label>
              <div className="grid gap-3">
                <label className="relative flex cursor-pointer rounded-xl border-2 bg-white p-4 focus:outline-none has-[:checked]:border-brand has-[:checked]:bg-brand/5 border-gray-100 hover:border-gray-200">
                  <input type="radio" value="STRIPE" {...register("paymentGateway")} className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-gray-900">Pay with Card (Stripe)</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 font-medium gap-1">Secure online payment</span>
                    </span>
                  </span>
                  <span className="absolute -inset-px rounded-xl border-2 border-transparent pointer-events-none has-[:checked]:border-brand" aria-hidden="true"></span>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border-2 bg-white p-4 focus:outline-none has-[:checked]:border-brand has-[:checked]:bg-brand/5 border-gray-100 hover:border-gray-200">
                  <input type="radio" value="COD" {...register("paymentGateway")} className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-gray-900">Manual / Cash on Delivery</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 font-medium gap-1">Complete via WhatsApp</span>
                    </span>
                  </span>
                  <span className="absolute -inset-px rounded-xl border-2 border-transparent pointer-events-none has-[:checked]:border-brand" aria-hidden="true"></span>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border-2 bg-white p-4 focus:outline-none has-[:checked]:border-brand has-[:checked]:bg-brand/5 border-gray-100 hover:border-gray-200">
                  <input type="radio" value="BKASH" {...register("paymentGateway")} className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-gray-900">bKash</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 font-medium gap-1">Send money via bKash</span>
                    </span>
                  </span>
                  <span className="absolute -inset-px rounded-xl border-2 border-transparent pointer-events-none has-[:checked]:border-brand" aria-hidden="true"></span>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border-2 bg-white p-4 focus:outline-none has-[:checked]:border-brand has-[:checked]:bg-brand/5 border-gray-100 hover:border-gray-200">
                  <input type="radio" value="NAGAD" {...register("paymentGateway")} className="sr-only" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-gray-900">Nagad</span>
                      <span className="mt-1 flex items-center text-xs text-gray-500 font-medium gap-1">Send money via Nagad</span>
                    </span>
                  </span>
                  <span className="absolute -inset-px rounded-xl border-2 border-transparent pointer-events-none has-[:checked]:border-brand" aria-hidden="true"></span>
                </label>
              </div>

              {/* Mobile Banking Manual Instructions */}
              {(selectedPaymentGateway === "BKASH" || selectedPaymentGateway === "NAGAD") && (
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-sm text-gray-900 mb-2">
                    Send exactly <span className="text-brand">৳{totalAmount.toFixed(2)}</span> to complete your order.
                  </h4>
                  <div className="space-y-2 mb-4">
                    {mobileBankingAccounts
                      .filter(acc => acc.provider.toLowerCase() === selectedPaymentGateway.toLowerCase())
                      .map(acc => (
                        <div key={acc.id} className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-700">{acc.type}</span>
                          <span className="font-black text-brand tracking-widest">{acc.number}</span>
                        </div>
                      ))}
                    {mobileBankingAccounts.filter(acc => acc.provider.toLowerCase() === selectedPaymentGateway.toLowerCase()).length === 0 && (
                      <p className="text-xs text-red-500 font-bold">No active numbers available for this provider.</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Sender Number</label>
                      <input
                        {...register("senderNumber")}
                        placeholder="e.g. 017..."
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-sm font-medium"
                      />
                      {errors.senderNumber && <p className="text-red-500 text-xs font-bold">{errors.senderNumber.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Transaction ID (TrxID)</label>
                      <input
                        {...register("trxId")}
                        placeholder="e.g. 8N5G7..."
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-sm font-medium uppercase"
                      />
                      {errors.trxId && <p className="text-red-500 text-xs font-bold">{errors.trxId.message}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Subtotal</span>
                <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500 font-bold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Shipping</span>
                {isFreeShipping ? (
                  <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Free</span>
                ) : (
                  <span className="text-gray-900">৳{shippingFee.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>৳{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isPending}
            className={`w-full ${selectedPaymentGateway === 'STRIPE' ? 'bg-[#635BFF] hover:bg-[#4E44E7]' : 'bg-[#25D366] hover:bg-[#20bd5a]'} text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-50 text-lg shadow-xl ${selectedPaymentGateway === 'STRIPE' ? 'shadow-[#635BFF]/20 hover:shadow-2xl hover:shadow-[#635BFF]/30' : 'shadow-[#25D366]/20 hover:shadow-2xl hover:shadow-[#25D366]/30'} hover:-translate-y-1 active:translate-y-0`}
          >
            {isPending ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : selectedPaymentGateway === 'STRIPE' ? (
              <>
                <ShieldCheck className="w-6 h-6" /> Proceed to Secure Payment
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" /> Complete Order
              </>
            )}
          </button>
          <p className="text-center text-xs font-bold text-gray-400 mt-5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
