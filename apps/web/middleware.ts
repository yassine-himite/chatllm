import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
    '/sign-in',
    '/sign-up',
    '/terms',
    '/privacy',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/auth/me',
];

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

    if (isPublic) {
        return NextResponse.next();
    }

    const sessionToken = request.cookies.get('twelo_session')?.value;

    if (!sessionToken) {
        const signInUrl = new URL('/sign-in', request.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};
