"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManagerDashboard() {
  // 1. State untuk menyimpan angka hasil hitungan dari database
  const [totalMenuAktif, setTotalMenuAktif] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fungsi untuk mengambil data dari Firestore saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Tentukan "laci" mana yang mau dibuka
        const menusRef = collection(db, "menus");

        // Buat aturan pencarian: Cari menu yang isAvailable-nya bernilai true
        const q = query(menusRef, where("isAvailable", "==", true));

        // Tarik datanya dari database
        const querySnapshot = await getDocs(q);

        // Hitung ada berapa jumlah dokumen yang cocok dengan aturan tadi
        setTotalMenuAktif(querySnapshot.size);
      } catch (error) {
        console.error("Gagal mengambil data dari Firestore:", error);
      } finally {
        // Matikan loading ketika proses selesai (berhasil maupun gagal)
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 3. Masukkan state totalMenuAktif ke dalam data statistik
  const stats = [
    { title: "Total Pendapatan", value: "Rp 1.250.000", subtitle: "Hari ini" },
    { title: "Pesanan Masuk", value: "42", subtitle: "Hari ini" },
    {
      title: "Menu Aktif",
      // Tampilkan "..." jika data masih dimuat, tampilkan angkanya jika sudah selesai
      value: isLoading ? "..." : totalMenuAktif.toString(),
      subtitle: "Tersedia untuk dijual",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Beranda Manager</h1>
        <p className="text-gray-500 mt-1">
          Selamat datang kembali! Berikut ringkasan performa operasional hari
          ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 justify-between rounded-2xl border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium">
                {stat.title}
              </span>
              <span className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                {stat.value}
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-md">
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Aktivitas Terbaru
        </h2>

        <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <svg
            className="w-10 h-10 text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-gray-400 font-medium">
            Belum ada aktivitas transaksi terekam
          </span>
        </div>
      </div>
    </div>
  );
}
