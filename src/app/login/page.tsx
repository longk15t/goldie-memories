"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid username or password");
            } else {
                router.push("/albums");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-sky-200/40 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-medium text-stone-500">
                    <Link href="/gallery" className="hover:text-amber-600 transition-colors">Gallery</Link>
                </div>
            </nav>

            {/* Login Form */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-sky-100">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                                <LogIn className="w-8 h-8 text-amber-600" />
                            </div>
                            <h1 className="font-serif text-3xl text-stone-900 mb-2">Welcome Back</h1>
                            <p className="text-stone-600">Sign in to manage your memories</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-stone-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800"
                                    placeholder="Enter username"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800"
                                    placeholder="Enter password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-stone-200 text-center">
                            <p className="text-sm text-stone-500">
                                Don't have access?{" "}
                                <Link href="/gallery" className="text-amber-600 hover:text-amber-700 font-medium">
                                    Browse as guest
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
