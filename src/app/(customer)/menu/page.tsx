export default function Home() {
  return (
    <>
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
          <img
            className=""
            src="/img/shopping-cart.png"
            alt="logos"
            width={35}
          />
        </div>
      </header>

      {/* batas main item */}
      <main className="bg-gray-50 min-h-screen font-sans flex-1">
        <div className="bg-red-600 px-4 pt-4 pb-8 mb-4 rounded-b-3xl ">
          <h1 className="text-white text-3xl font-bold mb-1">
            Mau makan apa hari ini?
          </h1>
          <p className="text-gray-100 ">Pilih menu favorite mu tampa antri</p>
        </div>

        {/* batas makanan */}
        <div className="flex flex-col px-4 gap-3 mb-9">
          <h1 className="text-black text-2xl font-bold">Makanan</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="transition-all duration-100
                       active:scale-95 bg-white p-6 rounded-3xl 
                       shadow-sm hover:shadow-xl border"
            >
              <div className="flex">
                <img
                  className="mr-6 items-center rounded-2xl"
                  src="/globe.svg"
                  alt="plce holder"
                  width={100}
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-black text-xl font-semibold">
                      Menu Makanan A
                    </h2>
                    <p className="text-zinc-500 text-sm">deskripsi makanan 1</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-red-600"> Rp 45.000</p>
                    <p className="rounded-2xl px-3 p-1 text-red-500 bg-red-200">
                      +
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="transition-all duration-100
                       active:scale-95 bg-white p-6 
                       rounded-3xl shadow-sm hover:shadow-xl border"
            >
              <div className="flex">
                <img
                  className="mr-6 items-center rounded-2xl"
                  src="/img/gravisco.jpg"
                  alt="plce holder"
                  width={100}
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-black text-xl font-semibold">
                      Menu Makanan A
                    </h2>
                    <p className="text-zinc-500 text-sm">deskripsi makanan 1</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-red-600"> Rp 45.000</p>
                    <p className="rounded-2xl px-3 p-1 text-red-500 bg-red-200">
                      +
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* batas minuman */}
        <div className="flex flex-col px-4 gap-3 mb-9">
          <h1 className="text-black text-2xl font-bold">Minuman</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="transition-all duration-100
                       active:scale-95 bg-white p-6 
                       rounded-3xl shadow-sm hover:shadow-xl border"
            >
              <div className="flex">
                <img
                  className="mr-6 items-center rounded-2xl"
                  src="/img/gravisco.jpg"
                  alt="plce holder"
                  width={100}
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-black text-xl font-semibold">
                      Menu Minuman A
                    </h2>
                    <p className="text-zinc-500 text-sm">deskripsi Mnuman 1</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-red-600"> Rp 45.000</p>
                    <p className="rounded-2xl px-3 p-1 text-red-500 bg-red-200">
                      +
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* batas snack */}
        <div className="flex flex-col px-4 gap-3 mb-9">
          <h1 className="text-black text-2xl font-bold">Snack</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="transition-all duration-100
                       active:scale-95 bg-white p-6 
                       rounded-3xl shadow-sm hover:shadow-xl border"
            >
              <div className="flex">
                <img
                  className="mr-6 items-center rounded-2xl"
                  src="/img/gravisco.jpg"
                  alt="plce holder"
                  width={100}
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-black text-xl font-semibold">
                      Menu Snack A
                    </h2>
                    <p className="text-zinc-500 text-sm">deskripsi Snack 1</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-red-600"> Rp 45.000</p>
                    <p className="rounded-2xl px-3 p-1 text-red-500 bg-red-200">
                      +
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
