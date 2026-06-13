"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";

export default function LoginPage() {
  // 1. Nama fungsi disesuaikan
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setErrorMessage("Data profil pengguna tidak ditemukan di database!");
        setLoading(false);
        return;
      }

      const userData = docSnap.data();
      const userRole = userData.role;

      if (userRole === "manager") {
        router.push("/dashboard/manager");
      } else if (userRole === "staff") {
        router.push("/dashboard/staff");
      } else {
        router.push("/menu");
      }
    } catch (error: unknown) {
      console.error(error);

      const firebaseErr = error as { code?: string; message?: string };

      if (firebaseErr.code === "auth/invalid-credential") {
        setErrorMessage(
          "Terjadi kesalahan sistem: " +
            (firebaseErr.message ?? "Unknown error"),
        );
      } else {
        setErrorMessage("Email atau password salah!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-black text-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-10 pb-6 flex justify-center">
          <Image src="/next.svg" width={100} height={100} alt="logo" />
        </div>
        <h1 className="text-2xl font-bold">Me-Pay Dashboard</h1>
        <p className="text-gray-500 mt-2">Login hanya untuk staf dan manajer</p>
      </div>

      <form
        onSubmit={handleLogin}
        className="text-black sm:mx-auto sm:w-full sm:max-w-md mt-8 border-gray-300 bg-white px-12 py-8 rounded-2xl shadow-sm"
      >
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="email"
            placeholder="nama@admin.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Password</label>
          <input
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {/* 3. Menampilkan pesan error di atas tombol jika ada */}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center border-transparent hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white px-6 py-2.5 bg-blue-500 font-medium transition-colors"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
}
