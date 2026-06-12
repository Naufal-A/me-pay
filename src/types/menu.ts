export interface MenuItem {
  id: string; // ID unik dokumen dari Firestore
  name: string; // Nama makanan/minuman
  description: string; // Deskripsi menu
  price: number; // Harga (gunakan format number agar mudah dihitung)
  image: string; // URL gambar (nanti disimpan di Firebase Storage)
  category: string; // Kategori, contoh: 'makanan', 'minuman', 'snack'
  isSoldOut: boolean; // Status ketersediaan menu (True = Habis, False = Tersedia)
}
