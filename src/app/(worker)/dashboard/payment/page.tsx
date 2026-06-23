"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatRupiah } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  menuId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  note: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  orderStatus: "pending" | "processing" | "done";
  paymentMethod: "qris" | "kasir";
  paymentStatus: "unpaid" | "paid";
  totalPrice: number;
  createdAt: { toDate: () => Date } | null;
  items: OrderItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  return `${Math.floor(diff / 3600)}j lalu`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Order["orderStatus"] }) {
  const map: Record<Order["orderStatus"], { label: string; cls: string }> = {
    pending: { label: "Menunggu", cls: "bg-amber-100 text-amber-700" },
    processing: { label: "Diproses", cls: "bg-blue-100 text-blue-700" },
    done: { label: "Selesai", cls: "bg-green-100 text-green-700" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-gray-400 text-sm font-medium">
        Belum ada pesanan yang perlu dibayar
      </p>
      <p className="text-gray-300 text-xs">
        Pesanan &ldquo;Bayar di Kasir&rdquo; akan muncul di sini secara
        real-time
      </p>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onConfirmPayment,
  isProcessing,
}: {
  order: Order;
  onConfirmPayment: (id: string) => void;
  isProcessing: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const createdDate = order.createdAt?.toDate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Order number + table */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">
              {order.orderNumber}
            </span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">
              {order.tableNumber === "Takeaway"
                ? "🥡 Takeaway"
                : `🪑 Meja ${order.tableNumber}`}
            </span>
            {createdDate && (
              <span className="text-[10px] text-gray-300">
                · {timeAgo(createdDate)}
              </span>
            )}
          </div>
        </div>

        {/* Total + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-gray-900">
            {formatRupiah(order.totalPrice)}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Expandable items */}
      {expanded && (
        <>
          <div className="border-t border-gray-50 px-4 py-3 flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantity}x @ {formatRupiah(item.price)}
                  </p>
                  {item.note && (
                    <p className="text-xs text-red-400 italic mt-0.5">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary line */}
          <div className="border-t border-dashed border-gray-100 px-4 py-3 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {order.items.reduce((s, i) => s + i.quantity, 0)} item
            </span>
            <span className="text-sm font-bold text-gray-900">
              Total {formatRupiah(order.totalPrice)}
            </span>
          </div>

          {/* Action */}
          {order.paymentStatus === "unpaid" ? (
            <div className="px-4 pb-4">
              <button
                onClick={() => onConfirmPayment(order.id)}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-white text-sm font-semibold rounded-xl py-3
                           transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Konfirmasi Pembayaran
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="px-4 pb-4">
              <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl py-3 text-center flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lunas
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"unpaid" | "paid">("unpaid");
  const [toast, setToast] = useState<string | null>(null);

  // ── Real-time listener: hanya order dengan paymentMethod = "kasir" ──
  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("paymentMethod", "==", "kasir"),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Order[];
      setOrders(data);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  // ── Confirm payment handler ──
  const handleConfirmPayment = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: "paid",
        orderStatus: "processing", // tandai dapur mulai proses
        paidAt: serverTimestamp(),
      });
      showToast("✅ Pembayaran dikonfirmasi!");
    } catch (err) {
      console.error("Gagal konfirmasi pembayaran:", err);
      showToast("❌ Gagal konfirmasi. Coba lagi.");
    } finally {
      setProcessingId(null);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const unpaidOrders = orders.filter((o) => o.paymentStatus === "unpaid");
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const displayedOrders = activeTab === "unpaid" ? unpaidOrders : paidOrders;

  // ── Total revenue dari yang sudah paid ──
  const totalRevenue = paidOrders.reduce((s, o) => s + o.totalPrice, 0);

  return (
    <main className="">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-24 flex flex-col gap-5">
        {/* ── Stats bar ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 text-center">
            <p className="text-2xl font-bold text-amber-500">
              {unpaidOrders.length}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">
              Belum Bayar
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 text-center">
            <p className="text-2xl font-bold text-green-500">
              {paidOrders.length}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">
              Lunas
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 text-center">
            <p className="text-lg font-bold text-gray-800 leading-tight">
              {formatRupiah(totalRevenue)}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wide">
              Pemasukan
            </p>
          </div>
        </div>

        {/* ── Tab ── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(["unpaid", "paid"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "unpaid"
                ? `Belum Bayar ${unpaidOrders.length > 0 ? `(${unpaidOrders.length})` : ""}`
                : `Sudah Bayar ${paidOrders.length > 0 ? `(${paidOrders.length})` : ""}`}
            </button>
          ))}
        </div>

        {/* ── Order list ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">
              Memuat pesanan...
            </p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {displayedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onConfirmPayment={handleConfirmPayment}
                isProcessing={processingId === order.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast}
        </div>
      )}
    </main>
  );
}
