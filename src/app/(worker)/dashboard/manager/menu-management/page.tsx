"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu } from "@/types/menu";
import Image from "next/image";
import AddMenuModal from "@/components/AddMenu";
import EditMenuModal from "@/components/EditMenu";
import DeleteConfirmModal from "@/components/DeleteConfirmation"; // 1. Import Modal Hapus

export default function KelolaMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // 2. State untuk menampung menu mana yang mau dihapus (null berarti modal tertutup)
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const menusRef = collection(db, "menus");
        const q = query(menusRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const menuData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Menu[];

        setMenus(menuData);
      } catch (error) {
        console.error("Gagal mengambil daftar menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMenus();
  }, []);

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === id ? { ...menu, isAvailable: newStatus } : menu,
      ),
    );

    try {
      const menuRef = doc(db, "menus", id);
      await updateDoc(menuRef, { isAvailable: newStatus });
    } catch (error) {
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === id ? { ...menu, isAvailable: currentStatus } : menu,
        ),
      );
      alert("Terjadi kesalahan saat mengupdate status menu.");
    }
  };

  // 3. Fungsi yang akan dieksekusi OLEH Modal ketika tombol "Ya, Hapus" ditekan
  const confirmDeleteMenu = async () => {
    if (!menuToDelete) return;

    try {
      await deleteDoc(doc(db, "menus", menuToDelete.id));
      setMenus((prevMenus) =>
        prevMenus.filter((menu) => menu.id !== menuToDelete.id),
      );
      setMenuToDelete(null); // Tutup modal setelah sukses
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      alert("Terjadi kesalahan saat menghapus menu.");
    }
  };

  const handleMenuAdded = (newMenu: Menu) => {
    setMenus([newMenu, ...menus]);
  };

  const handleMenuUpdated = (updatedMenu: Menu) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === updatedMenu.id ? updatedMenu : menu,
      ),
    );
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Menu</h1>
          <p className="text-gray-500 mt-1">
            Daftar semua menu makanan dan minuman yang terdaftar di sistem.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors text-sm"
        >
          + Tambah Menu
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            Memuat daftar menu...
          </div>
        ) : menus.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">
            Belum ada menu yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 text-sm font-semibold">
                  <th className="p-4 pl-6 w-16">Gambar</th>
                  <th className="p-4">Nama Menu</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-center">Tersedia</th>
                  <th className="p-4 text-center pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {menus.map((menu) => (
                  <tr
                    key={menu.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="w-12 h-12 relative shrink-0">
                        <Image
                          src={menu.image || "/next.svg"}
                          alt={menu.name || "Menu"}
                          fill
                          className="object-cover rounded-lg border border-gray-100"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {menu.name}
                      {menu.description && (
                        <p className="text-xs text-gray-400 font-normal mt-0.5 line-clamp-1">
                          {menu.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 capitalize">
                      {menu.category}
                    </td>
                    <td className="p-4 font-medium">
                      Rp {(menu.price || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleAvailable(menu.id, menu.isAvailable)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          menu.isAvailable ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            menu.isAvailable ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-center pr-6 space-x-3">
                      <button
                        onClick={() => setEditingMenu(menu)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors"
                      >
                        Edit
                      </button>

                      {/* 4. Ubah onClick ini jadi cuma mengaktifkan State, buka fungsi hapus langsung */}
                      <button
                        onClick={() => setMenuToDelete(menu)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleMenuAdded}
      />

      <EditMenuModal
        key={editingMenu ? editingMenu.id : "empty-edit"}
        isOpen={!!editingMenu}
        onClose={() => setEditingMenu(null)}
        onSuccess={handleMenuUpdated}
        menuToEdit={editingMenu}
      />

      {/* 5. Panggil komponen Modal Hapus di paling bawah */}
      <DeleteConfirmModal
        isOpen={!!menuToDelete}
        onClose={() => setMenuToDelete(null)}
        onConfirm={confirmDeleteMenu}
        itemName={menuToDelete?.name}
      />
    </div>
  );
}
