# ME-Pay

Aplikasi web _self-service_ pemesanan dan pembayaran berbasis Next.js dengan integrasi Firebase untuk Authentication, Firestore Database, dan Hosting.

---

## 🚀 fast start

```bash
cd work/univ/124/rpl/me-pay
```

```bash
npm run dev
```

```bash
firebase emulators:start --export-on-exit=./saved-data --import=./saved-data
```

## 📁 Project Structure

Struktur folder pada proyek ini menggunakan pola App Router dari Next.js yang dipisahkan berdasarkan _role_ pengguna:

```text
src/
├── app/
│   ├── (customer)/            # Route group untuk pembeli
│   │   ├── layout.tsx         # Navbar & Footer khusus pembeli
│   │   └── menu/
│   │       └── page.tsx       # Menampilkan list menu (Fetch dari DB)
│   │
│   ├── (admin)/               # Route group khusus admin
│   │   ├── layout.tsx         # Sidebar dasbor admin
│   │   └── dashboard/
│   │       ├── page.tsx       # Ringkasan & Statistik
│   │       └── manage-menu/
│   │           └── page.tsx   # Tabel CRUD menu (Tambah, Edit, Delete)
│   │
│   └── layout.tsx             # Root layout aplikasi
│
├── api/                       # Route Handlers (Backend API internal)
├── components/
│   ├── ui/                    # Reusable components (Tombol, Input, dll)
│   └── MenuCard.tsx           # Komponen card menu
│
└── lib/
    └── db.ts                  # Konfigurasi koneksi database Firebase
```

---

## 🚀 Getting Started (Lengkap)

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal.

### 1. Prerequisites

Pastikan Anda sudah menginstal:

- Node.js versi 16 atau lebih baru
- Git
- Akun Google untuk Firebase

### 2. Instalasi Dependencies

Buka terminal, masuk ke direktori proyek, dan jalankan:

```bash
cd work/univ/124/rpl/me-pay
npm install
```

### 3. Setup Firebase CLI & Login

Install Firebase CLI secara global (jika belum ada), lalu login ke akun Firebase Anda:

```bash
npm install -g firebase-tools
firebase login
```

_(Catatan: Jika menggunakan SSH/tanpa browser, gunakan `firebase login --no-localhost`)_

### 4. Konfigurasi Environment Variables

Buat file `.env.local` di _root_ proyek dan isi dengan konfigurasi Firebase Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=me-pay-ab9a1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=me-pay-ab9a1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=me-pay-ab9a1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Set project aktif ke proyek yang sudah ada:

```bash
firebase use me-pay-ab9a1
```

### 5. Jalankan Development Server & Emulator

Anda perlu menjalankan server Next.js dan Firebase Emulator secara bersamaan (gunakan dua terminal terpisah):

**Terminal 1 (Next.js):**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

**Terminal 2 (Firebase Emulator):**

```bash
firebase emulators:start
```

Buka Emulator UI di [http://localhost:4000](http://localhost:4000) untuk memantau Firestore dan Auth lokal.

---

## ⚙️ Firebase Configuration

Repo ini sudah terintegrasi dengan Firebase project `me-pay-ab9a1`.

### Layanan & Port Lokal

| Konfigurasi                 | Nilai                           |
| --------------------------- | ------------------------------- |
| **Project ID**              | `me-pay-ab9a1`                  |
| **Region**                  | `asia-southeast2`               |
| **Auth Emulator Port**      | `9099`                          |
| **Firestore Emulator Port** | `8080`                          |
| **Firestore UI**            | Enabled (http://localhost:4000) |

### File Konfigurasi Penting

| File                     | Deskripsi                                    |
| ------------------------ | -------------------------------------------- |
| `.firebaserc`            | Konfigurasi project Firebase default         |
| `firebase.json`          | Setup emulator, Firestore, dan Auth          |
| `firestore.rules`        | Security rules Firestore                     |
| `firestore.indexes.json` | Index configuration untuk query optimization |

> ⚠️ **Penting**: `firestore.rules` saat ini membuka akses baca/tulis sementara sampai `2026-07-12`. Pastikan untuk mengupdate dengan _security rules_ yang lebih ketat sebelum rilis ke _production_.

---

## 📦 Deployment

Pastikan Anda sudah melakukan _build_ sebelum _deploy_ ke Firebase Hosting.

```bash
npm run build
firebase deploy
```

**Deploy Layanan Spesifik:**

```bash
# Deploy Hanya Firestore Rules
firebase deploy --only firestore:rules

# Deploy Hanya Database Firestore
firebase deploy --only firestore
```

---

## 🛠️ Troubleshooting

- **Emulator tidak mau start / nyangkut:**
  Bersihkan _cache_ proses dengan menjalankan:
  ```bash
  firebase emulators:start --only firestore,auth
  ```
- **Permission denied saat login Firebase:**
  ```bash
  firebase logout
  firebase login --no-localhost
  ```
- **Port already in use:**
  Ganti port yang bentrok di file `firebase.json` atau matikan (_kill_) proses yang menggunakan port tersebut.

---

## 📚 Useful Commands & Resources

**Dokumentasi:**

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
