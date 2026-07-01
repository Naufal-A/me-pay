"use client";

import Image from "next/image";
import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatRupiah } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  menuId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  note: string;
}

export interface KitchenOrder {
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  return `${Math.floor(diff / 3600)}j lalu`;
}

// ─── Payment Badge ─────────────────────────────────────────────────────────────

function PaymentBadge({
  method,
  status,
}: {
  method: "qris" | "kasir";
  status: "unpaid" | "paid";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
          method === "qris"
            ? "bg-blue-100 text-blue-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {method === "qris" ? "QRIS" : "Kasir"}
      </span>
      {status === "unpaid" && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-amber-100 text-amber-600">
          Belum Bayar
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onMarkedDone?: (orderId: string) => void;
}

export default function KitchenOrderCard({
  order,
  onMarkedDone,
}: KitchenOrderCardProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const createdDate = order.createdAt?.toDate();

  const needsPaymentConfirmation =
    order.paymentMethod === "kasir" && order.paymentStatus === "unpaid";

  const handleMarkDone = async () => {
    setIsMarking(true);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        orderStatus: "done",
        servedAt: serverTimestamp(),
      });
      onMarkedDone?.(order.id);
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal update. Coba lagi.");
    } finally {
      setIsMarking(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsConfirmingPayment(true);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        paymentStatus: "paid",
      });
    } catch (err) {
      console.error("Gagal konfirmasi pembayaran:", err);
      alert("Gagal konfirmasi pembayaran. Coba lagi.");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* ── Card Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 font-medium">
            {order.orderNumber}
          </span>
          <p className="text-base font-bold text-gray-900">
            {order.tableNumber === "Takeaway"
              ? "🥡 Takeaway"
              : `Meja ${order.tableNumber}`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {createdDate && (
            <span className="text-xs text-gray-400">
              {formatTime(createdDate)}
            </span>
          )}
          <PaymentBadge method={order.paymentMethod} status={order.paymentStatus} />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-gray-50 mx-4" />

      {/* ── Items ── */}
      <div className="px-4 py-3 flex flex-col gap-3 flex-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 mt-0.5">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                  🍽
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2 items-start">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-gray-500 shrink-0">
                    {item.quantity}x
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700 shrink-0">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>

              {item.note && (
                <p className="text-xs text-orange-500 italic mt-0.5">
                  Note: {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-dashed border-gray-100 px-4 pt-3 pb-4 flex flex-col gap-3">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-base font-bold text-gray-900">
            {formatRupiah(order.totalPrice)}
          </span>
        </div>

        {/* Time ago pill */}
        {createdDate && (
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[10px] text-gray-300 font-medium">
              Dipesan {timeAgo(createdDate)}
            </span>
          </div>
        )}

        {/* CTA */}
        {needsPaymentConfirmation ? (
          <button
            onClick={handleConfirmPayment}
            disabled={isConfirmingPayment}
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white text-sm font-bold rounded-xl py-3
                       transition-all duration-150 flex items-center justify-center gap-2"
          >
            {isConfirmingPayment ? (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2"
                  />
                </svg>
                Konfirmasi Sudah Bayar
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleMarkDone}
            disabled={isMarking}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white text-sm font-bold rounded-xl py-3
                       transition-all duration-150 flex items-center justify-center gap-2"
          >
            {isMarking ? (
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
                Mark as Ready / Served
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}