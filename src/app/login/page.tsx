"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/albums";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            }) as any;

            if (result?.error) {
                setError("Invalid username or password");
                setIsLoading(false);
            } else {
                // Use window.location.href for a full reload to ensure
                // session cookies are correctly recognized in production.
                window.location.href = callbackUrl;
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="username" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-amber-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-800 placeholder:text-stone-400"
                    placeholder="Enter username"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-amber-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-800 placeholder:text-stone-400"
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95"
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
    );
}

export default function LoginPage() {

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Ambience - Harmonized with warm tones */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-50/40 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-bold text-stone-600 uppercase tracking-widest">
                    <Link href="/gallery" className="hover:text-amber-700 transition-colors">Gallery</Link>
                </div>
            </nav>

            {/* Login Form */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-10 border border-amber-900/10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl mb-4 border border-amber-100 shadow-inner">
                                <LogIn className="w-8 h-8 text-amber-600" />
                            </div>
                            <h1 className="font-serif text-3xl text-stone-900 mb-2 tracking-tight">Welcome Back</h1>
                            <p className="text-stone-600 font-medium">Sign in to manage your memories</p>
                        </div>

                        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>}>
                            <LoginForm />
                        </Suspense>

                        <div className="mt-8 pt-6 border-t border-amber-900/5 text-center">
                            <p className="text-sm font-medium text-stone-500">
                                Don't have access?{" "}
                                <Link href="/gallery" className="text-amber-700 hover:text-amber-800 font-bold underline underline-offset-4 decoration-amber-200 hover:decoration-amber-400 transition-all">
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
