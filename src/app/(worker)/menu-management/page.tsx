"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu"; // Pastikan interface Menu kemarin sudah di-export

export default function KelolaMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk menarik semua data menu dari Firestore
  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const menusRef = collection(db, "menus");

        // Urutkan menu berdasarkan waktu dibuat (terbaru di atas)
        const q = query(menusRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        // Map data dokumen Firestore ke dalam array objek tipe Menu
        const menuData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Konversi timestamp Firestore ke objek Date bawaan JavaScript
          createdAt: doc.data().createdAt?.toDate(),
        })) as Menu[];

        setMenus(menuData);
      } catch (error) {
        console.error("Gagal mengambil daftar menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMenus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Bagian Atas: Judul dan Tombol Tambah */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Menu</h1>
          <p className="text-gray-500 mt-1">
            Daftar semua menu makanan dan minuman yang terdaftar di sistem.
          </p>
        </div>

        {/* Tombol pancingan, nanti kita pasang fungsi modal/form tambah di sini */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors text-sm">
          + Tambah Menu
        </button>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          // Efek Loading Sederhana
          <div className="p-8 text-center text-gray-500 font-medium">
            Memuat daftar menu...
          </div>
        ) : menus.length === 0 ? (
          // Tampilan jika database kosong
          <div className="p-12 text-center text-gray-400 font-medium">
            Belum ada menu yang terdaftar. Klik tombol di atas untuk menambah.
          </div>
        ) : (
          // Tabel Data Minimalis
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 text-sm font-semibold">
                  <th className="p-4 pl-6">Nama Menu</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {menus.map((menu) => (
                  <tr
                    key={menu.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-gray-900">
                      {menu.name}
                    </td>
                    <td className="p-4 text-gray-500">{menu.category}</td>
                    <td className="p-4 font-medium">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4">
                      {menu.isAvailable ? (
                        <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          Tersedia
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          Habis
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center pr-6 space-x-2">
                      {/* Tombol aksi sementara */}
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium text-xs">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
