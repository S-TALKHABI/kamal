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

        // Message stats by source
        const messageStats = await prisma.message.groupBy({
            by: ['source'],
            _count: { _all: true },
        });

        // Order stats by status
        const orderStats = await prisma.order.groupBy({
            by: ['status'],
            _count: { _all: true },
        });

        return (
            <main className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-blue-700 text-white shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-6">Dashboard</h2>
                    <nav className="flex flex-col gap-4">
                        <a href="/dashboard/messages" className="hover:text-yellow-300">📩 Messages</a>
                        <a href="/dashboard/orders" className="hover:text-yellow-300">🛒 Orders</a>
                        <a href="/dashboard/profile" className="hover:text-yellow-300">👤 Profile</a>
                    </nav>
                </aside>

                {/* Content */}
                <section className="flex-1 p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">
                        Welcome, {user.username}
                    </h1>

                    {/* Messages */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">📩 Messages Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {messageStats.map((stat) => (
                                <div
                                    key={stat.source}
                                    className="bg-white p-6 shadow-md rounded-xl border border-gray-200"
                                >
                                    <p className="text-gray-700 font-medium">{stat.source}</p>
                                    <p className="text-3xl font-bold text-blue-600">{stat._count._all}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">🛒 Orders Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {orderStats.map((stat) => (
                                <div
                                    key={stat.status}
                                    className="bg-white p-6 shadow-md rounded-xl border border-gray-200"
                                >
                                    <p className="text-gray-700 font-medium">{stat.status}</p>
                                    <p className="text-3xl font-bold text-green-600">{stat._count._all}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        );
    } catch (err) {
        redirect('/login');
    }
}
