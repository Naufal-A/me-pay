"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";

export default function PaymentQrisPage() {
  const [qrisContent, setQrisContent] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const router = useRouter();
  const { clearCart } = useCartStore();

useEffect(() => {
    const content = sessionStorage.getItem("qris_content");
    const savedAmount = sessionStorage.getItem("qris_amount");

    if (!content) {
      router.push("/cart");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQrisContent(content);
    setAmount(savedAmount ? parseInt(savedAmount, 10) : 0);
  }, [router]);
  
  useEffect(() => {
    if (!qrisContent) return;

    const invoiceId = sessionStorage.getItem("qris_invoiceid");
    const requestDate = sessionStorage.getItem("qris_requestdate");
    const savedAmount = sessionStorage.getItem("qris_amount");
    const docId = sessionStorage.getItem("qris_docid");

    if (!invoiceId || !requestDate || !savedAmount) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/qris-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceId,
            amount: savedAmount,
            requestDate,
          }),
        });

        const data = await res.json();

        if (data.status === "success" && data.data.qris_status === "paid") {
          clearInterval(interval);

          if (docId) {
            try {
              await updateDoc(doc(db, "orders", docId), {
                paymentStatus: "paid",
              });
            } catch (err) {
              console.error("Gagal update status order:", err);
            }
          }

          sessionStorage.removeItem("qris_content");
          sessionStorage.removeItem("qris_invoiceid");
          sessionStorage.removeItem("qris_requestdate");
          sessionStorage.removeItem("qris_amount");
          sessionStorage.removeItem("qris_docid");
          clearCart();

          document.cookie = "order_success=true; path=/; max-age=30; SameSite=Strict";
          router.push("/order-success");
        }
      } catch (err) {
        console.error("Gagal cek status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [qrisContent, router, clearCart]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bayar Pesanan</h1>
        <p className="text-gray-500 mb-1">Scan QRIS di bawah ini</p>
        <p className="text-2xl font-bold text-red-600 mb-6">
          {formatRupiah(amount)}
        </p>

        {qrisContent ? (
          <div className="flex justify-center mb-4 relative w-64 h-64 mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${qrisContent}`}
              alt="QRIS Payment"
              className="w-full h-full object-contain border-4 border-gray-100 rounded-xl"
            />
          </div>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl mb-4 mx-auto">
            <p className="text-gray-400">Memuat QR...</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-4 animate-pulse">
          Menunggu pembayaran...
        </p>

        <button
          onClick={() => router.push("/cart")}
          className="w-full text-gray-400 text-sm hover:text-gray-600 underline"
        >
          Kembali ke Keranjang
        </button>
      </div>
    </main>
  );
}