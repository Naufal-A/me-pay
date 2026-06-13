"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Keluar dari sesi Firebase Auth
      await signOut(auth);

      // 2. Hapus tiket masuk (cookie userRole) dengan memaksa tanggal kedaluwarsanya lewat
      document.cookie =
        "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      // 3. Tendang kembali ke halaman login
      router.push("/login");

      // 4. Segarkan rute agar satpam proxy.ts langsung membaca ulang status cookie yang kosong
      router.refresh();
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-left"
    >
      {/* Ikon pintu keluar/logout SVG minimalis */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
      Keluar
    </button>
  );
}
