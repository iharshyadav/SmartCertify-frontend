import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/certificates',
  '/settings'
]

const authRoutes = [
  '/signin',
  '/signup'
]

const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/features'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('certify_token')?.value
  
  const isAuthenticated = !!token;

  if (publicRoutes.some(route => pathname === route)) {
    return NextResponse.next()
  }
  
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const signinUrl = new URL('/signin', request.url)
    signinUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signinUrl)
  }
  
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
