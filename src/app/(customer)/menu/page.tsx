"use client";

import { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import Image from "next/image";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu"; // Pastikan path ini sesuai dengan file type kamu

export default function Home() {
  // 1. Siapkan state untuk menampung data dari Firestore
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Tarik data dari Firestore saat halaman dimuat
  useEffect(() => {
    const fetchCustomerMenu = async () => {
      try {
        const menusRef = collection(db, "menus");

        // Cuma ambil yang isAvailable-nya true
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

  // 3. Logika grouping-mu tetap sama persis, cuma sekarang mengolah state 'menus'
  const groupedMenu = menus.reduce(
    (hasil, item) => {
      // PERBAIKAN: Kasih fallback "Lainnya" kalau item.category ternyata kosong/undefined dari database
      const kategoriAman = item.category || "Lainnya";
      const kategoriBersih = kategoriAman.trim().toLowerCase();

      if (!hasil[kategoriBersih]) {
        hasil[kategoriBersih] = [];
      }

      hasil[kategoriBersih].push(item);

      return hasil;
    },
    {} as Record<string, Menu[]>,
  );
  //1. Tentukan urutan kategori yang diprioritaskan (gunakan huruf kecil semua sesuai format groupedMenu)
  const prioritasKategori = ["makanan", "dessert", "minuman"];

  // 2. Ambil semua nama kategori dari groupedMenu dan urutkan
  const kategoriTersusun = Object.keys(groupedMenu).sort((a, b) => {
    const posA = prioritasKategori.indexOf(a);
    const posB = prioritasKategori.indexOf(b);

    // Jika dua-duanya ada di daftar prioritas, urutkan sesuai posisi di array
    if (posA !== -1 && posB !== -1) return posA - posB;
    // Jika cuma 'a' yang ada di prioritas, taruh 'a' di atas
    if (posA !== -1) return -1;
    // Jika cuma 'b' yang ada di prioritas, taruh 'b' di atas
    if (posB !== -1) return 1;

    // Jika muncul kategori baru di luar daftar prioritas (misal: "camilan"),
    // taruh di bawah dan urutkan sesuai abjad
    return a.localeCompare(b);
  });
  return (
    <main className="bg-gray-50 min-h-screen font-sans flex-1">
      <header className="bg-white pl-4 pr-3 py-4 flex items-center justify-between">
        <div className="flex flex-col ">
          <h1 className="text-black text-2xl font-bold ">Kantinia</h1>
          <p className="text-zinc-600 text-xs ">self service </p>
        </div>
        <div
          className="transition-all duration-100
                      active:scale-95 flex hover:bg-gray-100 
                      p-3 rounded-full "
        >
          <Image
            className=""
            src="/img/shopping-cart.png"
            alt="logos"
            width={35}
            height={25}
          />
        </div>
      </header>

      {/* batas main item */}

      <div className="bg-red-600 px-4 pt-4 pb-8 mb-4 rounded-b-3xl ">
        <h1 className="text-white text-3xl font-bold mb-1">
          Mau makan apa hari ini?
        </h1>
        <p className="text-gray-100 ">Pilih menu favorite mu tampa antri</p>
      </div>

      {/* batas makanan */}
      <div className="flex flex-col px-4 gap-3 mb-9">
        {/* Tambahan sedikit UX: Munculkan pesan loading kalau data masih ditarik */}
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Memuat daftar menu...
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Yah, belum ada menu yang tersedia.
          </div>
        ) : (
          /* Looping dari objek yang sudah dikelompokkan (KODEMU TETAP SAMA) */
          kategoriTersusun.map((kategori) => {
            const items = groupedMenu[kategori]; // Ambil isi menu berdasarkan kategori saat ini

            return (
              <section key={kategori} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize border-b border-gray-200 pb-2">
                  {kategori}
                </h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 sm:gap-6">
                  {items.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
