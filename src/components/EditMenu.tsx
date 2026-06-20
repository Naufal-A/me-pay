"use client";

import { useState } from "react"; // Hapus import useEffect
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu";

interface EditMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMenu: Menu) => void;
  menuToEdit: Menu | null;
}

export default function EditMenuModal({
  isOpen,
  onClose,
  onSuccess,
  menuToEdit,
}: EditMenuModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Langsung tembak nilai awalnya dari menuToEdit (tidak perlu useEffect lagi!)
  const [formData, setFormData] = useState({
    name: menuToEdit?.name || "",
    price: menuToEdit?.price?.toString() || "",
    category: menuToEdit?.category || "makanan",
    description: menuToEdit?.description || "",
    image: menuToEdit?.image || "",
  });

  // 👇 PASTIKAN BLOK useEffect() YANG LAMA SUDAH KAMU HAPUS DARI SINI 👇

  if (!isOpen || !menuToEdit) return null;

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const menuRef = doc(db, "menus", menuToEdit.id);

      // Data baru yang akan ditimpa ke database
      const updatedData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category.toLowerCase(),
        description: formData.description,
        image: formData.image || "/next.svg",
      };

      await updateDoc(menuRef, updatedData);

      // Gabungkan ID dan data lama dengan data yang baru diupdate untuk dilempar ke tabel
      const updatedMenu: Menu = {
        ...menuToEdit,
        ...updatedData,
      };

      onSuccess(updatedMenu);
      onClose();
    } catch (error) {
      console.error("Gagal mengupdate menu:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan menu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Edit Menu</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdateMenu} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Menu
            </label>
            <input
              required
              type="text"
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
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
