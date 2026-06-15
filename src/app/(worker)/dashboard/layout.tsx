import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value || "";

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-black overflow-hidden">
      {/* 1. Sidebar: otomatis diam di tempat karena induknya h-screen & overflow-hidden */}
      <Sidebar userRole={userRole} />

      {/* 2. Sisi Kanan: Kontainer penuh untuk menampung Header & Area Konten */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 3. Header: Menetap di atas, tidak akan ikut ter-scroll */}
        <header className="bg-white pl-8 p-5.5 shadow-sm border-b border-gray-200 shrink-0 flex items-center">
          <h2 className="text-xl font-bold text-black capitalize">
            {userRole} Dashboard
          </h2>
        </header>

        {/* 4. Area Konten: Hanya bagian ini yang diberi izin untuk scrolling */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
