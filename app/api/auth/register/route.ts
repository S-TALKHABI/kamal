// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
        }

        const exists = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (exists) {
            return NextResponse.json({ error: 'user_exists' }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashed, role: 'user' },
            select: { id: true, email: true, username: true, createdAt: true },
        });

        return NextResponse.json({ ok: true, user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }
}
