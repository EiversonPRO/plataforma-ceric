import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getDashboardByRole } from '@/lib/utils'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const role = token.role as string
    const forcePasswordChange = token.forcePasswordChange as boolean
    const dashboard = getDashboardByRole(role)

    // Force password change before accessing any private route
    if (forcePasswordChange && pathname !== '/cambiar-contrasena') {
      return NextResponse.redirect(new URL('/cambiar-contrasena', req.url))
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && role !== 'TEACHER_PLATFORM') {
      return NextResponse.redirect(new URL(dashboard, req.url))
    }

    if (pathname.startsWith('/dashboard/docente-colegio') && role !== 'TEACHER_SCHOOL') {
      return NextResponse.redirect(new URL(dashboard, req.url))
    }

    if (pathname.startsWith('/dashboard/acudiente') && role !== 'GUARDIAN') {
      return NextResponse.redirect(new URL(dashboard, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/cambiar-contrasena',
  ],
}
