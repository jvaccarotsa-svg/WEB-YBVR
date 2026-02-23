import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin and its subroutes, except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // In a real production app with cookies, we would check the cookie here.
        // Since we are using localStorage for the token (client-side), 
        // the middleware can't check the token directly.

        // However, we can still use the middleware to ensure the page 
        // always hydrates with the AuthContext logic.

        // For absolute security with Middleware, we would transition to 
        // HttpOnly cookies. But for now, we'll stick to the client-side guard 
        // and ensure the user is not seeing a cached version.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
