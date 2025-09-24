// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error('JWT_SECRET not set');

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // فقط مسیرهای محافظت‌شده — تغییر بدید طبق نیاز
    const protectedPaths = ['/dashboard', '/profile', '/app']; // مثال
    const needsAuth = protectedPaths.some(p => pathname.startsWith(p));

    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get('token')?.value;
    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.search = `?from=${encodeURIComponent(pathname)}`;
        return NextResponse.redirect(url);
    }

    try {
        // jose requires Uint8Array key
        await jwtVerify(token, new TextEncoder().encode(secret));
        return NextResponse.next();
    } catch (err) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // تنظیم مسیرها — فقط این‌ها چک خواهند شد
};
