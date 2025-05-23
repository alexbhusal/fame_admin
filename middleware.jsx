import { NextResponse,NextRequest } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('token')?.value;

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};