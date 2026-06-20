import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Ambil tiket (cookie) yang tadi kita buat pas login
  const roleCookie = request.cookies.get("userRole");
  const userRole = roleCookie?.value;

  // 2. Cek URL mana yang sedang mau dibuka oleh pengguna
  const url = request.nextUrl.pathname;

  // Cek jika belum login tapi mau buka area dashboard
  if (!userRole && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kalau role-nya STAFF, tapi maksa buka URL manager
  if (userRole === "staff" && url.startsWith("/dashboard/manager")) {
    return NextResponse.redirect(new URL("/dashboard/payment", request.url));
  }

  // Kalau role-nya MANAGER, tapi nyasar ke URL staff
  if (
    userRole === "manager" &&
    (url.startsWith("/dashboard/payment") ||
      url.startsWith("/dashboard/orders"))
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/manager/statistic", request.url),
    );
  }

  // Kalau sudah login, iseng buka halaman /login lagi
  if (userRole && url === "/login") {
    return NextResponse.redirect(
      new URL(
        userRole === "manager"
          ? "/dashboard/manager/statistic"
          : "/dashboard/payment",
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Matcher-nya diubah jadi /dashboard/...
  matcher: ["/dashboard/:path*", "/login"],
};
