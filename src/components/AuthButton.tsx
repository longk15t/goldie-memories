"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="text-sm text-stone-400">
                Loading...
            </div>
        );
    }

    if (session) {
        return (
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-800 transition-colors uppercase tracking-widest"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </button>
        );
    }

    return (
        <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-800 transition-colors uppercase tracking-widest"
        >
            <LogIn className="w-4 h-4" />
            Login
        </Link>
    );
}
