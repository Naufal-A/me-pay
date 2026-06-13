import MenuCard from "@/components/MenuCard";
import { dummyMenu } from "@/lib/dummy-data";
import Image from "next/image";

export default function Home() {
  // Mengelompokkan menu sekaligus melakukan normalisasi (anti huruf kapital/spasi berlebih)
  const groupedMenu = dummyMenu.reduce(
    (hasil, item) => {
      // Normalisasi: buang spasi berlebih dan jadikan huruf kecil semua
      const kategoriBersih = item.category.trim().toLowerCase();

      // Kalau kategorinya belum ada di objek 'hasil', bikin wadah array kosong
      if (!hasil[kategoriBersih]) {
        hasil[kategoriBersih] = [];
      }

      // Masukkan menu ke wadah kategorinya masing-masing
      hasil[kategoriBersih].push(item);

      return hasil;
    },
    {} as Record<string, typeof dummyMenu>,
  );
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
        {/* Looping dari objek yang sudah dikelompokkan */}
        {Object.entries(groupedMenu).map(([kategori, items]) => (
          <section key={kategori} className="mb-12">
            {/* Class 'capitalize' yang akan mengurus tampilan huruf besarnya di UI */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize border-b border-gray-200 pb-2">
              {kategori}
            </h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 sm:gap-6">
              {items.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
