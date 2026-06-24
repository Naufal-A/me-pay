"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const COUNTDOWN = 10; // detik sebelum otomatis kembali ke home

export default function OrderSuccessPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/menu");
      return;
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  // Progress: dari 1 (penuh) ke 0 (habis)
  const progress = seconds / COUNTDOWN;
  const circumference = 2 * Math.PI * 28; // r=28
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <main className="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-7">
        {/* ── Animated checkmark ── */}
        <div className="relative w-24 h-24">
          {/* Lingkaran hijau */}
          <div className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-11 w-11 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 0,
                animation: "draw-check 0.5s ease-out 0.2s both",
              }}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Ripple */}
          <div
            className="absolute inset-0 rounded-full bg-green-400 opacity-30"
            style={{ animation: "ripple 1.2s ease-out 0.1s both" }}
          />
        </div>

        {/* ── Text ── */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Pesanan Diterima!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Pesananmu sedang diproses oleh dapur.
            <br />
            Silakan tunggu di meja, kami akan mengantarkan pesananmu.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-gray-100" />

        {/* ── Timer ── */}
        <div className="flex flex-col items-center gap-3">
          {/* SVG countdown ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              {/* Track */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="4"
              />
              {/* Progress */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#EF4444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
            {/* Number */}
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
              {seconds}
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Halaman akan tertutup otomatis dalam{" "}
            <span className="font-semibold text-gray-600">{seconds} detik</span>
          </p>
        </div>

        {/* ── CTA ── */}
        <button
          onClick={() => router.push("/menu")}
          className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98]
                     text-white font-semibold rounded-2xl py-4 text-sm
                     transition-all duration-150"
        >
          Kembali ke Beranda
        </button>

        <p className="text-[11px] text-gray-300">
          Terima kasih sudah memesan di Kantinita ☕
        </p>
      </div>

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.3; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </main>
  );
}
