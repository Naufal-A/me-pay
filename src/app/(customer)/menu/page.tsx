"use client";

import { useState } from "react";

const menuData = [
  {
    category: "Makanan",
    items: [
      {
        id: 1,
        name: "Classic Cheese Burger",
        desc: "Patty sapi juicy dengan keju leleh, selada, tomat, dan saus spesial.",
        price: 45000,
        image: "/img/cheese-burger.jpg",
      },
      {
        id: 2,
        name: "Fresh Chicken Salad",
        desc: "Salad segar dengan potongan dada ayam panggang dan saus vinaigrette.",
        price: 35000,
        image: "/img/chicken-salad.jpg",
      },
    ],
  },
  {
    category: "Cemilan",
    items: [
      {
        id: 3,
        name: "Crispy French Fries",
        desc: "Kentang goreng renyah dengan taburan garam laut dan peterseli.",
        price: 25000,
        image: "/img/french-fries.jpg",
      },
      {
        id: 4,
        name: "Onion Rings",
        desc: "Cincin bawang renyah berlapis tepung bumbu dengan saus sambal manis.",
        price: 20000,
        image: "/img/onion-rings.jpg",
      },
    ],
  },
  {
    category: "Minuman",
    items: [
      {
        id: 5,
        name: "Iced Caramel Latte",
        desc: "Espresso dingin dengan susu segar dan sirup karamel manis.",
        price: 30000,
        image: "/img/caramel-latte.jpg",
      },
      {
        id: 6,
        name: "Es Teh Manis",
        desc: "Teh hitam segar diseduh hangat lalu didinginkan dengan es batu.",
        price: 10000,
        image: "/img/es-teh.jpg",
      },
    ],
  },
  {
    category: "Dessert",
    items: [
      {
        id: 7,
        name: "Dark Chocolate Cake",
        desc: "Potongan kue cokelat pekat dengan tekstur lembut dan kaya rasa.",
        price: 38000,
        image: "/img/chocolate-cake.jpg",
      },
      {
        id: 8,
        name: "Mango Pudding",
        desc: "Puding mangga segar dengan saus mangga asli dan potongan buah.",
        price: 22000,
        image: "/img/mango-pudding.jpg",
      },
    ],
  },
];

function formatRp(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Item Detail Modal (muncul saat klik +) ──────────────────────────────────
function ItemModal({ item, onClose, onConfirm }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto item */}
        <div className="relative w-full h-56 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover bg-gray-200"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 text-lg font-bold transition-all active:scale-90"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-5 pt-5 pb-4">
          <h2 className="text-black text-xl font-bold">{item.name}</h2>
          <p className="text-zinc-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
          <p className="text-black font-bold text-base mt-3">{formatRp(item.price)}</p>

          {/* Catatan */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-black block mb-2">
              Catatan Khusus <span className="text-zinc-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: Tanpa gula, ekstra pedas..."
              rows={3}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-black placeholder-zinc-400 resize-none focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-200"
            />
          </div>

          {/* Jumlah */}
          <div className="flex items-center justify-between mt-5">
            <span className="text-sm font-semibold text-black">Jumlah</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-lg font-bold transition-all active:scale-90 hover:bg-gray-200"
                aria-label="Kurang"
              >
                −
              </button>
              <span className="text-base font-bold text-black min-w-[24px] text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-lg font-bold transition-all active:scale-90 hover:bg-red-200"
                aria-label="Tambah"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tombol tambah */}
        <div className="px-5 pb-6 pt-3 flex-shrink-0">
          <button
            onClick={() => onConfirm(item.id, qty, note)}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl text-base flex justify-between items-center px-5 transition-all active:scale-95 hover:bg-red-700"
          >
            <span>Tambah ke Pesanan</span>
            <span>{formatRp(item.price * qty)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Menu Card ───────────────────────────────────────────────────────────────
function MenuCard({ item, qty, onOpenModal, onAdd, onRemove }) {
  return (
    <div className="transition-all duration-100 active:scale-[0.98] bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex gap-4 items-center">
      <img
        src={item.image}
        alt={item.name}
        width={86}
        height={86}
        className="rounded-2xl object-cover flex-shrink-0 bg-gray-100 cursor-pointer"
        style={{ width: 86, height: 86 }}
        onClick={onOpenModal}
      />
      <div className="flex flex-col flex-1 min-w-0 justify-between gap-2">
        <div className="cursor-pointer" onClick={onOpenModal}>
          <h3 className="text-black text-base font-semibold leading-tight">{item.name}</h3>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-red-600">{formatRp(item.price)}</span>

          {qty === 0 ? (
            <button
              onClick={onOpenModal}
              className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-xl font-bold transition-all active:scale-90 hover:bg-red-200"
              aria-label={`Tambah ${item.name}`}
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-lg font-bold transition-all active:scale-90 hover:bg-gray-200"
                aria-label="Kurang"
              >
                −
              </button>
              <span className="text-sm font-bold text-black min-w-[18px] text-center">{qty}</span>
              <button
                onClick={onOpenModal}
                className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-lg font-bold transition-all active:scale-90 hover:bg-red-200"
                aria-label="Tambah"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cart Modal ──────────────────────────────────────────────────────────────
function CartModal({ cartItems, totalPrice, onClose, onAdd, onRemove }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <h2 className="text-black text-xl font-bold mb-4">Pesanan Kamu</h2>

        <div className="flex flex-col gap-3 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  style={{ width: 48, height: 48 }}
                />
                <div>
                  <p className="text-sm font-semibold text-black">{item.name}</p>
                  {item.note && (
                    <p className="text-xs text-zinc-400 italic mt-0.5">"{item.note}"</p>
                  )}
                  <p className="text-xs text-zinc-500">{formatRp(item.price)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold transition-all active:scale-90"
                >
                  −
                </button>
                <span className="text-sm font-bold min-w-[18px] text-center">{item.qty}</span>
                <button
                  onClick={() => onAdd(item.id)}
                  className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-500 font-bold transition-all active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-5 flex justify-between">
          <span className="text-sm text-zinc-500">Total</span>
          <span className="text-base font-bold text-red-600">{formatRp(totalPrice)}</span>
        </div>

        <button className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 hover:bg-red-700">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  // cart: { [id]: { qty: number, note: string } }
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // item yang sedang dibuka modal-nya

  const confirmAdd = (id, qty, note) => {
    setCart((prev) => ({
      ...prev,
      [id]: {
        qty: (prev[id]?.qty || 0) + qty,
        note: note || prev[id]?.note || "",
      },
    }));
    setActiveItem(null);
  };

  const addOne = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: { qty: (prev[id]?.qty || 0) + 1, note: prev[id]?.note || "" },
    }));
  };

  const removeOne = (id) => {
    setCart((prev) => {
      const qty = (prev[id]?.qty || 0) - 1;
      if (qty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], qty } };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, { qty }]) => {
    const item = menuData.flatMap((c) => c.items).find((i) => i.id === +id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartItems = Object.entries(cart)
    .map(([id, { qty, note }]) => {
      const item = menuData.flatMap((c) => c.items).find((i) => i.id === +id);
      return item ? { ...item, qty, note } : null;
    })
    .filter(Boolean);

  return (
    <>
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100">
        <div>
          <h1 className="text-black text-xl font-bold">Kantinia</h1>
          <p className="text-zinc-500 text-xs">Self Service</p>
        </div>
        <button
          onClick={() => totalItems > 0 && setShowCart(true)}
          className="relative transition-all duration-100 active:scale-95 flex hover:bg-gray-100 p-3 rounded-full"
          aria-label="Lihat keranjang"
        >
          <img src="/img/shopping-cart.png" alt="Keranjang" width={28} />
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Main */}
      <main className="bg-gray-50 min-h-screen pb-32">
        {/* Hero */}
        <div className="bg-red-600 px-4 pt-5 pb-10 rounded-b-3xl">
          <h2 className="text-white text-3xl font-bold mb-1">Mau makan apa hari ini?</h2>
          <p className="text-red-100 text-sm">Pilih menu favoritmu tanpa antri.</p>
        </div>

        {/* Menu Sections */}
        <div className="px-4 -mt-3">
          {menuData.map((section) => (
            <div key={section.category} className="mb-8">
              <h2 className="text-black text-xl font-bold mb-3 pt-4">{section.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={cart[item.id]?.qty || 0}
                    onOpenModal={() => setActiveItem(item)}
                    onAdd={() => addOne(item.id)}
                    onRemove={() => removeOne(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-red-600 rounded-2xl px-5 py-4 flex justify-between items-center cursor-pointer shadow-lg shadow-red-300 z-20 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          onClick={() => setShowCart(true)}
        >
          <div className="flex items-center gap-3">
            <span className="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">
              {totalItems} item
            </span>
            <span className="text-white text-sm font-semibold">Lihat Pesanan</span>
          </div>
          <span className="text-white text-sm font-bold">{formatRp(totalPrice)}</span>
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItem && (
        <ItemModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onConfirm={confirmAdd}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          cartItems={cartItems}
          totalPrice={totalPrice}
          onClose={() => setShowCart(false)}
          onAdd={addOne}
          onRemove={removeOne}
        />
      )}
    </>
  );
}