/**
 * Ambil nomor meja dari URL query param ?meja=3
 * dan simpan ke cartStore + localStorage
 *
 * Cara pakai: panggil initSession() di page.tsx menu
 */

export function getTableFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get("meja"); // contoh URL: /menu?meja=3
} 