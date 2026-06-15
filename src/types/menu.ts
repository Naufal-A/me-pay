// export interface MenuItem {
//   id: string; // ID unik dokumen dari Firestore
//   name: string; // Nama makanan/minuman
//   description: string; // Deskripsi menu
//   price: number; // Harga (gunakan format number agar mudah dihitung)
//   image: string; // URL gambar (nanti disimpan di Firebase Storage)
//   category: string; // Kategori, contoh: 'makanan', 'minuman', 'snack'
//   isSoldOut: boolean; // Status ketersediaan menu (True = Habis, False = Tersedia)
// }

export interface Menu {
  id: string; // ID otomatis dari Firestore
  name: string; // Nama makanan/minuman (misal: "Nasi Goreng Spesial")
  description: string;
  price: number; // Harga dalam bentuk angka agar mudah dihitung (misal: 25000)
  category: string; // Kategori (misal: "Makanan", "Minuman", "Snack")
  image: string; // URL gambar menu
  isAvailable: boolean; // Status stok (true = Tersedia, false = Habis)
  createdAt: Date; // Waktu menu ditambahkan ke sistem
}
