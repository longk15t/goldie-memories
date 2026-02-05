"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, Heart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden selection:bg-amber-500/30 font-sans">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.png"
          alt="Nostalgic Room"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        {/* Soft Overlays for Depth and Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/10 to-stone-900/60" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-md"
        >
          <div className="bg-amber-500 p-1.5 rounded-lg">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <span>Goldie Memories</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-6"
        >
          <AuthButton />
        </motion.div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          {/* Decorative Sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 text-amber-300/20"
          >
            <Sparkles size={200} />
          </motion.div>

          <div className="relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs uppercase tracking-[0.2em] font-bold backdrop-blur-md"
            >
              <Heart className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Gold&apos;s Life, Through My Eyes</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]"
              >
                Every Step <br />
                <span className="text-amber-400 italic">of Gold</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl mx-auto text-lg md:text-xl text-stone-200 font-light leading-relaxed drop-shadow-sm"
              >
                Capturing the first smiles, the curious steps, and the timeless bond
                between a father and his son. A private sanctuary for our shared story.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                href="/gallery"
                className="group relative px-10 py-4 bg-white text-stone-900 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10 flex items-center gap-2"
              >
                Enter the Gallery <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {session && (
                <Link
                  href="/admin/upload"
                  className="px-10 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-amber-900/20"
                >
                  <Camera className="w-5 h-5" />
                  Preserve a Memory
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Decorative Tokens */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-5 md:left-10 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl -rotate-12 hidden lg:block"
        >
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-serif italic">Boundless Love</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-stone-300/60 text-xs font-medium tracking-widest uppercase">
        <p>Built with heart &copy; {new Date().getFullYear()} Goldie Memories</p>
      </footer>
    </main>
  );
}
