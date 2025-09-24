import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;
    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && token !== "admin@gmail.com") {
        const url = request.nextUrl.clone();
        url.pathname = "/"; 
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
}