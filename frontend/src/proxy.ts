import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/collection"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthenticated = request.cookies.has("access_token");
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
