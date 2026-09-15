import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (i) => i.productId === item.productId && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
        );
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.productId === item.productId && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
                ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            isOpen: true,
          });
        } else {
          set({ 
            items: [...currentItems, { ...item, id: Math.random().toString(36).substr(2, 9) }],
            isOpen: true
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "cart-storage",
      // Exclude isOpen from persistence so the cart is closed by default on reload
      partialize: (state) => ({ items: state.items }),
    }
  )
);
