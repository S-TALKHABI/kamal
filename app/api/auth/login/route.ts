// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createJwtToken, createSetCookieHeader } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return NextResponse.json({ error: 'missing' }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: 'user not found.' }, { status: 401 });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return NextResponse.json({ error: 'invalid' }, { status: 401 });

        const token = createJwtToken({ userId: user.id, email: user.email });
        const setCookie = createSetCookieHeader(token);

        return NextResponse.json(
            { ok: true, user: { id: user.id, email: user.email, username: user.username } },
            { status: 200, headers: { 'Set-Cookie': setCookie } }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }
}
