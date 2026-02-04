// proxy.ts
import { NextResponse, NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/parent') || pathname.startsWith('/student') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // CONVERT TO LOWERCASE FOR COMPARISON
    const userType = (token.type as string)?.toLowerCase();

    if (pathname.startsWith('/parent') && userType !== 'parent') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (pathname.startsWith('/student') && userType !== 'student') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (pathname.startsWith('/admin') && userType !== 'admin') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/parent/:path*',
    '/student/:path*',
    '/admin/:path*',
  ]
};