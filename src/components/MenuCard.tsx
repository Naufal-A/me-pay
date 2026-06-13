import { MenuItem } from "../types/menu";
import Image from "next/image";

export default function MenuCard({ menu }: { menu: MenuItem }) {
  return (
    <div
      className={`relative flex flex-row transition-all duration-200 p-4 sm:p-5 rounded-3xl border shadow-sm ${
        menu.isSoldOut
          ? "bg-gray-50 grayscale opacity-60 cursor-not-allowed border-gray-200"
          : "bg-white hover:shadow-xl active:scale-95 border-gray-100"
      }`}
    >
      {/* Label Habis ditaruh di sini agar posisinya di pojok kanan atas KARTU */}
      {menu.isSoldOut && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          Habis
        </div>
      )}

      {/* Bagian Gambar */}
      {/* shrink-0 agar gambar tidak gepeng, w-28 h-28 memberi ukuran kotak yang konsisten */}
      <div className=" items-center shrink-0 mr-4 sm:mr-5 w-28 h-28 relative">
        <Image
          src={menu.image}
          alt={menu.name}
          width={50}
          height={50}
          className="object-cover w-full h-full rounded-2xl"
        />
      </div>

      {/* Bagian Informasi Teks */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* pr-14 supaya teks nama menu yang panjang tidak tertutup label 'Habis' */}
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 pr-14">
            {menu.name}
          </h3>
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
            disabled={menu.isSoldOut}
            className={`rounded-full px-4 py-1.5 font-bold transition-colors ${
              menu.isSoldOut
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-red-600 bg-red-100 hover:bg-red-200"
            }`}
          >
            {menu.isSoldOut ? "-" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
