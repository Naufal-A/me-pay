"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatRupiah } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";

interface OrderData {
  paymentStatus: "unpaid" | "paid";
  totalPrice: number;
  orderNumber: string;
  tableNumber: string;
}

export default function PaymentCashPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const docId = sessionStorage.getItem("order_docid");

    if (!docId) {
      router.push("/cart");
      return;
    }

    // Dengarkan perubahan status order secara real-time
    const unsub = onSnapshot(
      doc(db, "orders", docId),
      (snapshot) => {
        if (!snapshot.exists()) {
          router.push("/cart");
          return;
        }

        const data = snapshot.data() as OrderData;
        setOrder(data);

        if (data.paymentStatus === "paid") {
          // Bersihkan session & cart, lalu ke halaman sukses
          sessionStorage.removeItem("order_docid");
          clearCart();
          document.cookie = "order_success=true; path=/; max-age=30; SameSite=Strict";
          router.push("/order-success");
        }
      },
      (error) => {
        console.error("Gagal memantau status order:", error);
      }
    );

    return () => unsub();
  }, [router, clearCart]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-gray-100">
        {/* Icon kasir */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-amber-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-amber-500"
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Silakan Bayar di Kasir
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Tunjukkan nomor pesanan berikut ke kasir untuk melakukan pembayaran
        </p>

        {order ? (
          <>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-400 mb-1">Nomor Pesanan</p>
              <p className="text-xl font-bold text-gray-900 mb-3">
                {order.orderNumber}
              </p>
              <div className="h-px bg-gray-200 mb-3" />
              <p className="text-xs text-gray-400 mb-1">Total Pembayaran</p>
              <p className="text-2xl font-bold text-red-600">
                {formatRupiah(order.totalPrice)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-600">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">
                Menunggu konfirmasi kasir...
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <button
          onClick={() => router.push("/cart")}
          className="mt-6 w-full text-gray-400 text-sm hover:text-gray-600 underline"
        >
          Kembali ke Keranjang
        </button>
      </div>
    </main>
  );
}