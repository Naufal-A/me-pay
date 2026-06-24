import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // ── 1. Proteksi order-success: hanya bisa diakses setelah checkout ──
  if (url === "/order-success") {
    const hasOrderSuccess =
      request.cookies.get("order_success")?.value === "true";

    if (!hasOrderSuccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Cookie ada → boleh masuk, langsung hapus supaya tidak bisa refresh
    const response = NextResponse.next();
    response.cookies.delete("order_success");
    return response;
  }

  // ── 2. Role-based dashboard protection ────────────────────────────────
  const roleCookie = request.cookies.get("userRole");
  const userRole = roleCookie?.value;

  // Belum login tapi mau buka area dashboard
  if (!userRole && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role STAFF tapi maksa buka URL manager
  if (userRole === "staff" && url.startsWith("/dashboard/manager")) {
    return NextResponse.redirect(new URL("/dashboard/payment", request.url));
  }

  // Role MANAGER tapi nyasar ke URL staff
  if (
    userRole === "manager" &&
    (url.startsWith("/dashboard/payment") ||
      url.startsWith("/dashboard/orders"))
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/manager/statistic", request.url),
    );
  }

  // Sudah login tapi iseng buka /login lagi
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
  matcher: ["/dashboard/:path*", "/login", "/order-success"],
};
