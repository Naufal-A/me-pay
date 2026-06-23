"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatRupiah } from "@/lib/format";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type PaymentMethod = "qris" | "kasir";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, totalPrice, tableNumber } =
    useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Tambahkan state isMounted untuk mengatasi Hydration Error
  const [isMounted, setIsMounted] = useState(false);

  // 2. Set isMounted ke true hanya setelah komponen dirender di browser
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleConfirm = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "orders"), {
        tableNumber: tableNumber ?? "unknown",
        status: "pending",
        paymentMethod,
        totalPrice: totalPrice(),
        createdAt: serverTimestamp(),
        items: items.map((item) => ({
          menuId: item.menuId,
          name: item.name,
          image: item.image,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          note: item.note,
        })),
      });

      clearCart();
      router.push("/order-success");
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      alert("Gagal mengirim pesanan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-4.5 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            Kantinita
          </h1>
          <p className="text-xs text-gray-500">
            {tableNumber ? `Meja ${tableNumber}` : "Self-Service"}
          </p>
        </div>
      </header>

      <div className="px-4 pt-6 pb-40 flex flex-col gap-6 max-w-lg mx-auto">
        {/* Ringkasan Pesanan */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ringkasan Pesanan
          </h2>

          {/* 3. Gunakan isMounted untuk mencegah mismatch UI */}
          {!isMounted ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-400 text-sm">Memuat keranjang...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-400 text-sm">Keranjang kamu kosong.</p>
              <button
                onClick={() => router.back()}
                className="mt-3 text-red-600 font-semibold text-sm hover:underline"
              >
                Tambah Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={`${item.menuId}-${item.note}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start"
                >
                  {/* Foto */}
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-900 text-sm leading-snug">
                        {item.name}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Deskripsi */}
                    {item.description && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    <p className="text-gray-400 text-xs mt-0.5">
                      {item.quantity}x @ {formatRupiah(item.price)}
                    </p>

                    {/* Catatan khusus */}
                    {item.note && (
                      <p className="text-red-500 text-xs mt-1 italic">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    )}

                    {/* Tombol Hapus */}
                    <button
                      onClick={() => removeItem(item.menuId, item.note)}
                      aria-label={`Hapus ${item.name}`}
                      className="mt-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Metode Pembayaran */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Metode Pembayaran
          </h2>
          <div className="flex flex-col gap-3">
            {/* QRIS */}
            <button
              onClick={() => setPaymentMethod("qris")}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === "qris"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  paymentMethod === "qris" ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${paymentMethod === "qris" ? "text-red-600" : "text-gray-500"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${paymentMethod === "qris" ? "text-red-700" : "text-gray-800"}`}
                >
                  QRIS / E-Wallet
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bayar otomatis via aplikasi
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === "qris"
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "qris" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </div>
            </button>

            {/* Bayar di Kasir */}
            <button
              onClick={() => setPaymentMethod("kasir")}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMethod === "kasir"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  paymentMethod === "kasir" ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${paymentMethod === "kasir" ? "text-red-600" : "text-gray-500"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${paymentMethod === "kasir" ? "text-red-700" : "text-gray-800"}`}
                >
                  Bayar di Kasir
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tunai atau kartu debit
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  paymentMethod === "kasir"
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "kasir" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Footer sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 pt-4 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Total Pembayaran</span>
            <span className="text-xl font-bold text-gray-900">
              {/* 4. Render harga hanya saat sudah isMounted */}
              {isMounted ? formatRupiah(totalPrice()) : formatRupiah(0)}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            // 5. Mencegah user klik tombol sebelum data keranjang beres dirender
            disabled={!isMounted || items.length === 0 || isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold rounded-2xl py-4
                       transition-all duration-150 text-base"
          >
            {isSubmitting ? "Mengirim Pesanan..." : "Konfirmasi Pesanan"}
          </button>
        </div>
      </div>
    </main>
  );
}
