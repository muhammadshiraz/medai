import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("medai-token")?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) return NextResponse.next();

  if (token) {
    try {
      const isValid = await verifyToken(token);

      if (path === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (!isValid && path !== "/login") {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("medai-token");
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("medai-token");
      return response;
    }
  } else if (path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
