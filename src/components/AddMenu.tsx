"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu";

interface AddMenuModalProps {
  isOpen: boolean; // Mengontrol modal tampil atau tidak
  onClose: () => void; // Fungsi untuk menutup modal
  onSuccess: (newMenu: Menu) => void; // Fungsi untuk melempar data menu baru ke tabel
}

export default function AddMenuModal({
  isOpen,
  onClose,
  onSuccess,
}: AddMenuModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "makanan",
    description: "",
    image: "",
  });

  // Jika isOpen bernilai false, jangan render apa-apa (sembunyikan modal)
  if (!isOpen) return null;

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, "menus"), {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category.toLowerCase(),
        description: formData.description,
        image: formData.image || "/next.svg",
        isAvailable: true,
        createdAt: serverTimestamp(),
      });

      const newMenu: Menu = {
        id: docRef.id,
        name: formData.name,
        price: Number(formData.price),
        category: formData.category.toLowerCase(),
        description: formData.description,
        image: formData.image || "/next.svg",
        isAvailable: true,
        createdAt: new Date(),
      };

      // Lempar data ke halaman utama agar tabel otomatis terupdate
      onSuccess(newMenu);

      // Bersihkan form lalu tutup modal
      setFormData({
        name: "",
        price: "",
        category: "makanan",
        description: "",
        image: "",
      });
      onClose();
    } catch (error) {
      console.error("Gagal menambah menu:", error);
      alert("Terjadi kesalahan saat menyimpan menu baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Tambah Menu Baru</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddMenu} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Menu
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Nasi Goreng Spesial"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp)
              </label>
              <input
                required
                type="number"
                min="0"
                placeholder="25000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              placeholder="Penjelasan menu untuk pelanggan..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Gambar
            </label>
            <input
              type="text"
              placeholder="https://... atau biarkan kosong"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
