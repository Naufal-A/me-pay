import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Menu } from "@/types/menu";

export interface CartItem {
  menuId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  note: string;
}

interface CartStore {
  items: CartItem[];
  tableNumber: string | null;

  setTableNumber: (table: string) => void;
  addItem: (menu: Menu, quantity: number, note: string) => void;
  removeItem: (menuId: string, note: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,

      setTableNumber: (table) => set({ tableNumber: table }),

      addItem: (menu, quantity, note) => {
        set((state) => {
          // Kalau menu sama DAN catatan sama → tambah quantity saja
          const existing = state.items.find(
            (item) => item.menuId === menu.id && item.note === note
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.menuId === menu.id && item.note === note
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Kalau beda catatan → item baru
          return {
            items: [
              ...state.items,
              {
                menuId: menu.id,
                name: menu.name,
                image: menu.image ?? "",
                description: menu.description ?? "",
                price: menu.price,
                quantity,
                note,
              },
            ],
          };
        });
      },

      removeItem: (menuId, note) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.menuId === menuId && item.note === note)
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "kantinita-cart", // key di localStorage
    }
  )
);