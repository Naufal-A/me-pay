import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers"; // 1. Ambil fungsi cookies bawaan server

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Baca cookie userRole secara aman di server sebelum halaman dirender
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value || "";

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {/* 3. Oper nilai userRole ke dalam komponen Sidebar */}
      <Sidebar userRole={userRole} />

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
