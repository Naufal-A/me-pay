"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu";
import { useCartStore } from "@/store/cartStore";
import MenuCard from "@/components/MenuCard";
import MenuDetailSheet from "@/components/MenuDetailSheet";

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items) || [];
  const cartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchCustomerMenu = async () => {
      try {
        const menusRef = collection(db, "menus");
        const q = query(menusRef, where("isAvailable", "==", true));
        const querySnapshot = await getDocs(q);
        const menuData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Menu[];
        setMenus(menuData);
      } catch (error) {
        console.error("Gagal mengambil menu pelanggan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerMenu();
  }, []);

  const groupedMenu = menus.reduce(
    (hasil, item) => {
      const kategoriAman = item.category || "Lainnya";
      const kategoriBersih = kategoriAman.trim().toLowerCase();
      if (!hasil[kategoriBersih]) hasil[kategoriBersih] = [];
      hasil[kategoriBersih].push(item);
      return hasil;
    },
    {} as Record<string, Menu[]>,
  );

  const prioritasKategori = ["makanan", "cemilan", "dessert", "minuman"];
  const kategoriTersusun = Object.keys(groupedMenu).sort((a, b) => {
    const posA = prioritasKategori.indexOf(a);
    const posB = prioritasKategori.indexOf(b);
    if (posA !== -1 && posB !== -1) return posA - posB;
    if (posA !== -1) return -1;
    if (posB !== -1) return 1;
    return a.localeCompare(b);
  });

  const handleAddToCart = (menu: Menu, quantity: number, note: string) => {
    addItem(menu, quantity, note);
  };

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      {/* ── HEADER: sticky, z-50, selalu paling depan ── */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-gray-900 text-xl font-bold tracking-tight">
            Kantinita
          </h1>
          <p className="text-xs text-gray-500">Self-Service</p>
        </div>

        <button
          onClick={() => router.push("/cart")}
          className="relative transition-all duration-100 active:scale-95 flex hover:bg-gray-100 p-2.5 rounded-full"
          aria-label={`Keranjang, ${isMounted ? cartCount : 0} item`}
        >
          <Image
            src="/img/shopping-cart.png"
            alt="keranjang"
            width={28}
            height={28}
          />
          {isMounted && cartCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </header>

      {/* ── WRAPPER: posisi relative, jadi parent untuk sticky banner ── */}
      <div className="relative">
        {/* ── BANNER MERAH: sticky di bawah header (top = tinggi header ≈ 61px) ── */}
        {/* z-0 → ada di BELAKANG card konten yang z-10 */}
        <div className="sticky top-19 z-0 bg-red-600 px-4 pt-4 pb-24 rounded-b-3xl">
          <h2 className="text-white text-2xl font-bold leading-tight">
            Mau makan apa hari ini?
          </h2>
          <p className="text-red-200 text-xs mt-1 font-medium">
            Pilih menu favoritmu tanpa antre
          </p>
        </div>

        {/* ── KONTEN CARD: z-10 → scroll di ATAS banner merah ── */}
        {/* -mt-14 biar card naik dan "menutupi" bagian bawah banner */}
        <div className="relative z-10 -mt-14 mx-3 rounded-2xl bg-gray-50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-3 pt-4 pb-10 min-h-screen">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Memuat daftar menu...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-2">🍽️</p>
              <p className="text-gray-500 font-medium text-sm">
                Yah, belum ada menu yang tersedia.
              </p>
            </div>
          ) : (
            kategoriTersusun.map((kategori) => {
              const items = groupedMenu[kategori];
              return (
                <section key={kategori} className="mb-6">
                  {/* Label kategori */}
                  <h3 className="text-base font-bold text-gray-800 mb-3 capitalize flex items-center gap-2">
                    <span className="w-1 h-4 bg-red-500 rounded-full inline-block" />
                    {kategori}
                  </h3>

                  {/* 3. PERUBAHAN GRID: minmax diperkecil ke 280px & gap dirapatkan agar lebih padat di HP */}
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 sm:gap-4">
                    {items.map((menu) => (
                      <div
                        key={menu.id}
                        onClick={() => {
                          if (menu.isAvailable) setSelectedMenu(menu);
                        }}
                        className={
                          menu.isAvailable
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }
                      >
                        <MenuCard menu={menu} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>

      <MenuDetailSheet
        key={selectedMenu?.id ?? "closed"}
        menu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
