import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, User as UserIcon } from "lucide-react";
import { OrderStatusForm } from "./OrderStatusForm";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      },
      payment: {
        include: { paymentMethod: true }
      }
    }
  });

  if (!order) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/admin/orders" className="text-brand font-bold flex items-center gap-2 hover:underline w-fit mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-black text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-500 mt-2 font-medium">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items and Customer Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 mb-6">Purchased Items</h3>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {item.product.images[0]?.url ? (
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ৳ {item.price}</p>
                  </div>
                  <div className="font-black text-gray-900 text-lg">
                    ৳ {item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Total Amount</span>
              <span className="text-3xl font-black text-brand">৳ {order.totalAmount}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><UserIcon className="w-5 h-5 text-brand" /> Customer Info</h3>
              <div className="space-y-2 text-gray-600 font-medium">
                <p className="text-gray-900 font-bold">{order.user.firstName} {order.user.lastName}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4"/> {order.user.email}</p>
                {order.user.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4"/> {order.user.phone}</p>}
              </div>
            </div>
            
            {order.payment && (order.payment.transactionId || order.payment.senderNumber) ? (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">💳 Payment Info ({order.payment.paymentMethod.name})</h3>
                <div className="space-y-2 text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {order.payment.senderNumber && <p><span className="font-bold text-gray-800">Sender:</span> {order.payment.senderNumber}</p>}
                  {order.payment.transactionId && <p><span className="font-bold text-gray-800">TrxID:</span> <span className="uppercase tracking-wider">{order.payment.transactionId}</span></p>}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand" /> Shipping Address</h3>
                <div className="space-y-1 text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p>No address mapped in DB yet.</p>
                  <p>Pending Checkout Pipeline.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Status Update Form */}
        <div>
          <div className="sticky top-8">
            <OrderStatusForm 
              orderId={order.id} 
              currentStatus={order.status} 
              currentPaymentStatus={order.paymentStatus} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
