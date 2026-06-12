import { MenuItem } from "@/types/menu";

export const dummyMenu: MenuItem[] = [
  {
    id: "menu-1",
    name: "Nasi Goreng Spesial",
    description:
      "Nasi goreng gurih dengan telur ceplok, sosis ayam, dan kerupuk udang.",
    price: 25000,
    image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Nasi+Goreng",
    category: "makanan",
    isSoldOut: false,
  },
  {
    id: "menu-2",
    name: "Es Lemon Tea",
    description: "Teh segar dengan perasan lemon asli dan es batu.",
    price: 12000,
    image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Lemon+Tea",
    category: "minuman",
    isSoldOut: false,
  },
  {
    id: "menu-3",
    name: "Ayam Penyet Sambal Ijo",
    description:
      "Ayam goreng penyet dengan sambal ijo pedas mantap dan lalapan.",
    price: 28000,
    image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Ayam+Penyet",
    category: "makanan",
    isSoldOut: true, // Ini contoh data menu yang lagi habis
  },
  {
    id: "menu-4",
    name: "Kentang Goreng",
    description: "Kentang goreng renyah dengan taburan garam laut.",
    price: 15000,
    image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Kentang+Goreng",
    category: "snack",
    isSoldOut: false,
  },
];
