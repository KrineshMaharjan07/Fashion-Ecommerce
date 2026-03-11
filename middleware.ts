// ============================================================
// middleware.ts — Protect /admin routes, redirect to login
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { isRequestAuthenticated } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (except the login page itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const authenticated = await isRequestAuthenticated(req);

    if (!authenticated) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
