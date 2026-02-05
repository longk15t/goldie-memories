"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, Heart, Star } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-sky-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Navigation (Simple) */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>Goldie Memories</span>
        </div>
        <div className="flex gap-6">
          <AuthButton />
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-amber-200/50 text-amber-700/80 text-xs uppercase tracking-widest backdrop-blur-sm shadow-sm">
            <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Design for the moments that matter</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight text-stone-900 drop-shadow-sm">
            Timeless <br />
            <span className="text-amber-500/90 italic font-serif">Moments</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-stone-600 font-light leading-relaxed">
            A secure, beautiful home for every smile, every step, and every
            golden memory of your journey.
          </p>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/gallery"
              className="group relative px-8 py-4 bg-amber-500 text-white font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                Open Gallery <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            {session && (
              <Link
                href="/admin/upload"
                className="px-8 py-4 bg-white border border-stone-200 text-stone-600 rounded-full hover:bg-stone-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Upload
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer / Decorative */}
      <footer className="relative z-10 py-8 text-center text-stone-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Goldie Memories. Built with Love.</p>
      </footer>
    </main>
  );
}
