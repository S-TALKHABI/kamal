// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearCookieHeader } from '@/lib/auth';

export async function POST(req: Request) {
    const clear = clearCookieHeader();
    return NextResponse.json({ ok: true }, { status: 200, headers: { 'Set-Cookie': clear } });
}
