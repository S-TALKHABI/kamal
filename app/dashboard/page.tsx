// app/dashboard/page.tsx (server component)
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value ?? null;

    if (!token) redirect('/login');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, username: true },
        });

        if (!user) redirect('/login');

        return (
            <main>
                <h1>سلام، {user.username} — داشبورد</h1>
                <p>اینجا محتوای محافظت شده است.</p>
            </main>
        );
    } catch (err) {
        redirect('/login');
    }
}
