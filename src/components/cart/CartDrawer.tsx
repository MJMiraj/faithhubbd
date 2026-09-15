"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Your Cart
                <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs tracking-widest uppercase ml-2">
                  {items.length}
                </span>
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                        {item.imageUrl ? (
                          <Image 
                            src={item.imageUrl} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-gray-500 font-semibold mt-1">
                              {item.selectedColor && `Color: ${item.selectedColor}`}
                              {item.selectedColor && item.selectedSize && " | "}
                              {item.selectedSize && `Size: ${item.selectedSize}`}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-brand transition-colors text-gray-500 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-brand transition-colors text-gray-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-black text-gray-900">৳{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-bold">Subtotal</span>
                  <span className="text-2xl font-black text-gray-900">৳{totalAmount}</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold mb-6 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link 
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand/20 text-lg"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
