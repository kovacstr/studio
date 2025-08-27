import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (pathname === '/admin' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
