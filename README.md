# me-pay

Aplikasi e-commerce berbasis Next.js dengan integrasi Firebase untuk authentication, Firestore database, dan hosting.

## Quick Start

cd work/univ/124/rpl/me-pay

### Run Development Server

Di terminal baru, jalankan:

```bash
npm run dev
```

kemudian jalankan:

```bash
npm run emulator
```

### Instalasi Dependencies

```bash
npm install
```

### Setup Firebase Lokal

Pastikan Anda sudah login ke Firebase:

```bash
firebase login
```

Kemudian jalankan emulator Firebase:

```bash
firebase emulators:start
```

---

src/
├── app/
│ │ ├── layout.tsx <-- Navbar/Footer khusus pembeli
│ ├── (customer)/ <-- Halaman untuk pembeli
│ │ ├── layout.tsx <-- Navbar/Footer khusus pembeli
│ │ └── menu/
│ │ └── page.tsx <-- Nampilin list menu (fetch dari DB)
│ │
│ ├── (admin)/ <-- Halaman khusus admin
│ │ ├── layout.tsx <-- Sidebar dasbor admin
│ │ └── dashboard/
│ │ ├── page.tsx <-- Ringkasan/Statistik
│ │ └── manage-menu/
│ │ └── page.tsx <-- Tabel CRUD menu (Tambah, Edit, Delete)
│ │
│ └── layout.tsx <-- Navbar/Footer khusus pembeli
│  
├── api/ <-- Kalau butuh Route Handlers
├── components/  
│ ├── ui/ <-- Tombol, Input, dll
│ └── MenuCard.tsx <-- Komponen card menu yang dipakai berulang
│
└── lib/  
 └── db.ts <-- Konfigurasi koneksi database

---

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Firebase Configuration

Repo ini sudah terintegrasi dengan Firebase project `me-pay-ab9a1`. Berikut konfigurasi yang ada:

| Konfigurasi                 | Nilai                           |
| --------------------------- | ------------------------------- |
| **Project ID**              | `me-pay-ab9a1`                  |
| **Region**                  | `asia-southeast2`               |
| **Auth Emulator Port**      | `9099`                          |
| **Firestore Emulator Port** | `8080`                          |
| **Firestore UI**            | Enabled (http://localhost:4000) |

---

## Setup Firebase (Lengkap)

### 1. Prerequisites

- Node.js 16+ terinstall
- Akun Google untuk Firebase
- Git terinstall

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
```

Cek versi:

```bash
firebase --version
```

### 3. Login ke Firebase

```bash
firebase login
```

Jika menggunakan SSH atau tidak ada browser:

```bash
firebase login --no-localhost
```

### 4. Konfigurasi Project

Project sudah dikonfigurasi di `.firebaserc`:

```bash
firebase use me-pay-ab9a1
```

### 5. Install Firebase SDK (Frontend)

Untuk menggunakan Firebase di React/Next.js:

```bash
npm install firebase
```

### 6. Environment Variables

Buat file `.env.local` di root project dengan config Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=me-pay-ab9a1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=me-pay-ab9a1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=me-pay-ab9a1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 7. Jalankan Emulator Lokal

```bash
firebase emulators:start
```

Emulator UI akan tersedia di: http://localhost:4000

### 8. Jalankan Development Server

Di terminal baru:

```bash
npm run dev
```

---

## Firebase Services

### Firestore Database

- **Lokasi**: `asia-southeast2`
- **Rules**: Defined in `firestore.rules`
- **Indexes**: Configured in `firestore.indexes.json`
- **Emulator**: Port 8080

### Authentication

- **Emulator**: Port 9099
- **Providers**: Dapat dikonfigurasi di `firebase.json`

---

## Project Structure

```
me-pay/
├── app/                    # Next.js app directory
├── public/                 # Static files
├── .firebaserc            # Firebase project config
├── firebase.json          # Firebase emulator config
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── package.json           # Dependencies
└── README.md              # This file
```

---

## File Firebase yang Penting

| File                     | Deskripsi                                    |
| ------------------------ | -------------------------------------------- |
| `.firebaserc`            | Konfigurasi project Firebase default         |
| `firebase.json`          | Setup emulator, Firestore, dan Auth          |
| `firestore.rules`        | Security rules Firestore                     |
| `firestore.indexes.json` | Index configuration untuk query optimization |

> ⚠️ **Penting**: `firestore.rules` saat ini membuka akses baca/tulis sementara sampai `2026-07-12`. Update dengan security rules yang lebih ketat sebelum production.

---

## Deployment

### Deploy ke Firebase Hosting

```bash
npm run build
firebase deploy
```

### Deploy Hanya Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Hanya Database

```bash
firebase deploy --only firestore
```

---

## Troubleshooting

### Emulator tidak mau start

```bash
# Bersihkan dan restart
firebase emulators:start --only firestore,auth
```

### Permission denied saat login

```bash
firebase logout
firebase login --no-localhost
```

### Port already in use

Ganti port di `firebase.json` atau kill process yang menggunakan port tersebut.

---

## Useful Commands

```bash
# List emulators
firebase emulators:exec "echo 'test'"

# Clear emulator data
firebase emulators:start --import=./emulator-data --export-on-exit

# Deploy everything
firebase deploy

# Deploy specific service
firebase deploy --only firestore:rules,firestore
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
