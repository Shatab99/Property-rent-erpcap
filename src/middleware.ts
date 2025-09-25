import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

//   // Not logged in → go to login
//   if (!token) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     url.searchParams.set("next", pathname);
//     return NextResponse.redirect(url);
//   }

  // Admin user → can only access /admin/**
  if (token === "admin@gmail.com") {
    if (!pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Normal user → block /admin/**
  if (pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Normal users can access dashboard and all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // protect all except system routes
};
