"use client"; // 1. Ubah menjadi Client Component

import Link from "next/link";
import { usePathname } from "next/navigation"; // 2. Import hook untuk deteksi URL
import LogoutButton from "./LogoutButton";

// 3. Terima props 'userRole' dari layout
export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname(); // 4. Simpan URL aktif saat ini (misal: /dashboard/manager/menu)

  const menuItems = [
    {
      title: "Beranda",
      href: `/dashboard/${userRole}`,
      roles: ["manager", "staff"],
    },
    {
      title: "Pesanan Masuk",
      href: "/dashboard/staff/orders",
      roles: ["manager", "staff"],
    },
    {
      title: "Kelola Menu",
      href: "/menu-management",
      roles: ["manager"],
    },
    {
      title: "Laporan Penjualan",
      href: "/dashboard/manager/reports",
      roles: ["manager"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole || ""),
  );

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-5 flex flex-col">
      <div className="flex flex-row">
        <h2 className="text-2xl font-bold text-black">Kantinia</h2>
        <h2 className="text-2xl font-bold text-red-500 ">Ops</h2>
      </div>
      <div>
        <hr className="border-t border-zinc-200 mt-5 mb-4" />
        <p className="text-sm text-gray-400 font-sans uppercase mb-4">
          WORKSPACE: {userRole}
        </p>
      </div>
      <nav className="flex flex-col gap-2 grow">
        {filteredMenu.map((menu, index) => {
          // 5. Cek apakah URL browser saat ini sama dengan href milik menu
          const isActive = pathname === menu.href;

          return (
            <Link
              key={index}
              href={menu.href}
              // 6. Jika isActive bernilai true, kasih background biru muda (bg-blue-50) dan teks biru.
              // Jika false, kasih warna abu-abu biasa yang elegan.
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {menu.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <LogoutButton />
      </div>
    </aside>
  );
}
