import { db } from '@/lib/db';

export interface CourierService {
  createConsignment(orderData: any): Promise<{ success: boolean; trackingNumber?: string; message?: string }>;
  trackConsignment(trackingNumber: string): Promise<{ success: boolean; status?: string; message?: string }>;
}

export class MockCourierDriver implements CourierService {
  async createConsignment(orderData: any) {
    console.log(`[Courier] Creating mock consignment for Order ${orderData.orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, trackingNumber: `FH-BD-${Math.floor(100000 + Math.random() * 900000)}` };
  }
  async trackConsignment(trackingNumber: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, status: 'IN_TRANSIT' };
  }
}

export class SteadfastCourierDriver implements CourierService {
  private apiKey = process.env.STEADFAST_API_KEY;
  private secretKey = process.env.STEADFAST_SECRET_KEY;
  private baseUrl = "https://portal.steadfast.com.bd/api/v1";

  async createConsignment(orderData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create_order`, {
        method: "POST",
        headers: {
          "Api-Key": this.apiKey!,
          "Secret-Key": this.secretKey!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoice: orderData.orderId,
          recipient_name: orderData.recipientName,
          recipient_phone: orderData.recipientPhone,
          recipient_address: orderData.recipientAddress || "Address not provided",
          cod_amount: orderData.amountToCollect,
          note: "Order from FaithHub BD"
        })
      });

      const data = await response.json();
      if (response.ok && data.status === 200) {
        return { success: true, trackingNumber: data.consignment.tracking_code };
      }
      return { success: false, message: data.message || "Failed to create consignment" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async trackConsignment(trackingNumber: string) {
    try {
      const response = await fetch(`${this.baseUrl}/status_by_trackingcode/${trackingNumber}`, {
        headers: {
          "Api-Key": this.apiKey!,
          "Secret-Key": this.secretKey!,
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 200) {
        return { success: true, status: data.delivery_status };
      }
      return { success: false, message: "Could not track consignment." };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

// Auto-switch: Use real Steadfast API if keys exist, otherwise fallback to Mock
export const courierService: CourierService = 
  (process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY && process.env.STEADFAST_API_KEY !== 'mock') 
  ? new SteadfastCourierDriver() 
  : new MockCourierDriver();

export async function dispatchOrderToCourier(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true }
    });

    if (!order) return { error: "Order not found" };
    if (order.status !== "PROCESSING" && order.status !== "PENDING") {
      return { error: `Order cannot be dispatched from status: ${order.status}` };
    }

    // Call the Courier API
    const response = await courierService.createConsignment({
      orderId: order.orderNumber,
      recipientName: order.user.firstName + ' ' + (order.user.lastName || ''),
      recipientPhone: order.user.phone,
      amountToCollect: order.paymentStatus === 'PAID' ? 0 : order.totalAmount,
      items: order.items
    });

    if (!response.success || !response.trackingNumber) {
      return { error: response.message || "Failed to create consignment with Courier." };
    }

    // Default Shipping Method (e.g., standard) if none selected
    let shippingMethodId = order.shippingMethodId;
    if (!shippingMethodId) {
      const defaultMethod = await db.shippingMethod.findFirst();
      if (defaultMethod) {
        shippingMethodId = defaultMethod.id;
      }
    }

    if (!shippingMethodId) {
      return { error: "No shipping method available in the system." };
    }

    // Update DB to reflect Shipment Creation
    await db.shipment.create({
      data: {
        orderId: order.id,
        shippingMethodId,
        trackingNumber: response.trackingNumber,
        status: "PENDING"
      }
    });

    // Update Order Status
    await db.order.update({
      where: { id: order.id },
      data: { status: 'SHIPPED' }
    });

    await db.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'SHIPPED',
        notes: `Order dispatched to Courier. Tracking ID: ${response.trackingNumber}`
      }
    });

    return { success: true, trackingNumber: response.trackingNumber };

  } catch (error) {
    console.error("Courier dispatch failed:", error);
    return { error: "An unexpected error occurred during dispatch." };
  }
}
