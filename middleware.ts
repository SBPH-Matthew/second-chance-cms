import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function checkAuth(token: string | undefined): Promise<boolean> {
  if (!token) return false

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API
    if (!apiUrl) return false

    const response = await fetch(`${apiUrl}/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isProtected = pathname.startsWith('/dashboard')
  const isAuthPage = pathname === '/login' || pathname === '/register'

  let isAuthenticated = false

  if (token) {
    isAuthenticated = await checkAuth(token)
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}