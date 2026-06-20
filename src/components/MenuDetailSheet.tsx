"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu } from "@/types/menu";
import { formatRupiah } from "@/lib/format"; // ← import dari utils

interface MenuDetailSheetProps {
  menu: Menu | null;
  onClose: () => void;
  onAddToCart: (menu: Menu, quantity: number, note: string) => void;
}

export default function MenuDetailSheet({
  menu,
  onClose,
  onAddToCart,
}: MenuDetailSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBackdropClick = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (menu) {
      document.addEventListener("mousedown", handleBackdropClick);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleBackdropClick);
      document.body.style.overflow = "";
    };
  }, [menu, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!menu) return null;

  const totalHarga = menu.price * quantity;

  const handleAdd = () => {
    onAddToCart(menu, quantity, note);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${menu.name}`}
          className="
            w-full sm:max-w-lg
            bg-white
            rounded-t-3xl sm:rounded-3xl
            shadow-2xl
            max-h-[92dvh] sm:max-h-[85vh]
            overflow-y-auto
            animate-slide-up
            flex flex-col
          "
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          <div className="relative w-full h-52 sm:h-64 bg-gray-100 shrink-0 sm:rounded-t-3xl overflow-hidden">
            {menu.image ? (
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">Tidak ada foto</span>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Tutup"
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2
                         shadow-md hover:bg-white active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 
                     10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 
                     01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="px-5 pt-5 pb-8 flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {menu.name}
              </h2>
              {menu.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {menu.description}
                </p>
              )}
              <p className="text-gray-900 font-bold text-lg mt-1">
                {formatRupiah(menu.price)} {/* ← pakai utils */}
              </p>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="catatan" className="text-sm font-semibold text-gray-800">
                Catatan Khusus{" "}
                <span className="font-normal text-gray-400">(Opsional)</span>
              </label>
              <textarea
                id="catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Misal: Tanpa gula, ekstra pedas..."
                rows={3}
                className="
                  w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm text-gray-700 placeholder-gray-400 resize-none
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                  transition
                "
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Jumlah</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Kurangi jumlah"
                  className="
                    w-10 h-10 rounded-full border border-gray-300
                    flex items-center justify-center
                    text-gray-700 hover:bg-gray-100 active:scale-95 transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </button>

                <span className="text-xl font-bold text-gray-900 w-6 text-center tabular-nums">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tambah jumlah"
                  className="
                    w-10 h-10 rounded-full border border-gray-300
                    flex items-center justify-center
                    text-gray-700 hover:bg-gray-100 active:scale-95 transition-all
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="
                w-full bg-red-600 hover:bg-red-700 active:scale-[0.98]
                text-white font-semibold rounded-2xl
                py-4 px-5
                flex items-center justify-between
                transition-all duration-150
                text-sm sm:text-base
                mt-auto
              "
            >
              <span>Tambah ke Pesanan</span>
              <span className="font-bold">{formatRupiah(totalHarga)}</span> {/* ← pakai utils */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}