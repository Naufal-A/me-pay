import { Menu } from "@/types/menu"; // Pastikan path import-nya sesuai
import Image from "next/image";

export default function MenuCard({ menu }: { menu: Menu }) {
  // Kita buat variabel bantuan agar tidak perlu menulis !menu.isAvailable berulang kali
  const isSoldOut = !menu.isAvailable;

  return (
    <div
      className={`relative flex flex-row transition-all duration-200 p-4 sm:p-5 rounded-3xl border shadow-sm ${
        isSoldOut
          ? "bg-gray-50 grayscale opacity-60 cursor-not-allowed border-gray-200"
          : "bg-white hover:shadow-xl active:scale-95 border-gray-100"
      }`}
    >
      {/* Label Habis ditaruh di sini agar posisinya di pojok kanan atas KARTU */}
      {isSoldOut && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          Habis
        </div>
      )}

      {/* Bagian Gambar */}
      <div className=" items-center shrink-0 mr-4 sm:mr-5 w-28 h-28 relative">
        <Image
          src={menu.image}
          alt={menu.name}
          width={112} // Mengikuti ukuran w-28 dari Tailwind (112px) agar render gambarnya optimal
          height={112}
          className="object-cover w-full h-full rounded-2xl"
        />
      </div>

      {/* Bagian Informasi Teks */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 pr-14">
            {menu.name}
          </h3>
          {/* Menampilkan kategori sebagai ganti deskripsi yang sudah dihapus dari database */}
          <p className="text-gray-500 text-sm  line-clamp-2">
            {menu.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <p className="font-bold text-red-600 whitespace-nowrap">
            Rp {menu.price.toLocaleString("id-ID")}
          </p>

          {/* Tombol Tambah (+) */}
          <button
            disabled={isSoldOut}
            className={`rounded-full px-4 py-1.5 font-bold transition-colors ${
              isSoldOut
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-red-600 bg-red-100 hover:bg-red-200"
            }`}
          >
            {isSoldOut ? "-" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
