"use client";

import { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import MenuDetailSheet from "@/components/MenuDetailSheet";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu";

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

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

  const prioritasKategori = ["makanan", "dessert", "minuman"];
  const kategoriTersusun = Object.keys(groupedMenu).sort((a, b) => {
    const posA = prioritasKategori.indexOf(a);
    const posB = prioritasKategori.indexOf(b);
    if (posA !== -1 && posB !== -1) return posA - posB;
    if (posA !== -1) return -1;
    if (posB !== -1) return 1;
    return a.localeCompare(b);
  });

  const handleAddToCart = (menu: Menu, quantity: number, note: string) => {
    // TODO: integrasikan dengan cart state / Firestore kamu di sini
    console.log("Ditambahkan ke keranjang:", { menu, quantity, note });
  };

  return (
    <main className="bg-gray-50 min-h-screen font-sans flex-1">
      <header className="bg-white pl-4 pr-3 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-black text-2xl font-bold">Kantinia</h1>
          <p className="text-zinc-600 text-xs">self service</p>
        </div>
        <div
          className="transition-all duration-100 active:scale-95 flex
                     hover:bg-gray-100 p-3 rounded-full"
        >
          <Image
            src="/img/shopping-cart.png"
            alt="keranjang"
            width={35}
            height={25}
          />
        </div>
      </header>

      <div className="bg-red-600 px-4 pt-4 pb-8 mb-4 rounded-b-3xl">
        <h1 className="text-white text-3xl font-bold mb-1">
          Mau makan apa hari ini?
        </h1>
        <p className="text-gray-100">Pilih menu favorite mu tampa antri</p>
      </div>

      <div className="flex flex-col px-4 gap-3 mb-9">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Memuat daftar menu...
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Yah, belum ada menu yang tersedia.
          </div>
        ) : (
          kategoriTersusun.map((kategori) => {
            const items = groupedMenu[kategori];
            return (
              <section key={kategori} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize border-b border-gray-200 pb-2">
                  {kategori}
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 sm:gap-6">
                  {items.map((menu) => (
                    <div
                      key={menu.id}
                      onClick={() => {
                        if (menu.isAvailable) setSelectedMenu(menu);
                      }}
                      className={menu.isAvailable ? "cursor-pointer" : "cursor-not-allowed"}
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

      {/* Bottom Sheet — key={selectedMenu?.id} supaya state reset otomatis tiap menu baru */}
      <MenuDetailSheet
        key={selectedMenu?.id ?? "closed"}
        menu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}