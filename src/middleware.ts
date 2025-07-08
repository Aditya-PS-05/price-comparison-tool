import { NextResponse } from 'next/server'

export async function middleware() {
  // Temporarily disable middleware to allow authentication to work
  // The dashboard pages will handle authentication checks directly
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}