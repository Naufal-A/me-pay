"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  or,
  and,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import KitchenOrderCard, { KitchenOrder } from "@/components/KitchenOrderCard";

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">
        🍳
      </div>
      <p className="text-gray-400 text-sm font-medium">
        Belum ada pesanan masuk
      </p>
      <p className="text-gray-300 text-xs max-w-xs">
        Pesanan QRIS yang sudah dibayar dan pesanan kasir akan muncul di sini
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*
      Tampilkan order yang perlu diproses dapur:
      - QRIS  → hanya jika paymentStatus == "paid" (otomatis dari simulator)
      - Kasir → tampil meski masih "unpaid", supaya kasir bisa konfirmasi manual
      Ditambah orderStatus masih pending/processing (belum "done").
    */
    const q = query(
      collection(db, "orders"),
      and(
        where("orderStatus", "in", ["pending", "processing"]),
        or(
          where("paymentStatus", "==", "paid"),
          where("paymentMethod", "==", "kasir")
        )
      ),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as KitchenOrder[];
        setOrders(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Snapshot error:", error);
        setIsLoading(false);
      },
    );

    return () => unsub();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Prepare these orders sequentially.
          </p>
        </div>

        {/* Live indicator + count */}
        <div className="flex items-center gap-3">
          {orders.length > 0 && (
            <span className="text-sm font-semibold text-gray-500">
              {orders.length} pesanan
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-semibold text-green-700">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memuat pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        /*
          Grid responsive:
          - mobile  : 1 kolom
          - md      : 2 kolom
          - xl      : 3 kolom
        */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <KitchenOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}