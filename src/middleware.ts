import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/api/auth"];
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    if (session && pathname === "/login") {
      const role = (session.user as { role: string }).role;
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin/dashboard" : "/guru/dashboard", request.url)
      );
    }
    return NextResponse.next();
  }

  // Not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = (session.user as { role: string }).role;

  // Role-based route protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/guru/dashboard", request.url));
  }

  if (pathname.startsWith("/guru") && role !== "guru_wali") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect root based on role
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/guru/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images).*)"],
};
