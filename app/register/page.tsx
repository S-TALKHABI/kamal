'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [channelUrl, setChannelUrl] = useState('');
    const [err, setErr] = useState('');
    const router = useRouter();

    async function handle(e: React.FormEvent) {
        e.preventDefault();
        setErr('');
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, channelUrl }),
        });
        if (res.ok) {
            router.push('/dashboard');
        } else {
            const data = await res.json();
            setErr(data.error || 'error');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handle}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-2 border border-gray-300 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-gray-900 placeholder-gray-400 [color-scheme:light]"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-gray-900 placeholder-gray-400 [color-scheme:light]"
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-gray-900 placeholder-gray-400 [color-scheme:light]"
                />

                <input
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="channelUrl"
                    className="w-full px-4 py-2 border border-gray-300 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-gray-900 placeholder-gray-400 [color-scheme:light]"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Register
                </button>

                {err && <p className="text-red-500 text-center">{err}</p>}

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
}
