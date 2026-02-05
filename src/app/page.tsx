"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans selection:bg-rose-100">
      {/* Tinybeans-style Vibrant Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-rose-200 rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-amber-200 rounded-full blur-3xl opacity-50"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-teal-100 rounded-full blur-3xl opacity-70"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-2xl tracking-tight text-stone-900 flex items-center gap-2"
        >
          <div className="bg-rose-500 p-1.5 rounded-xl shadow-lg shadow-rose-200">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-serif">Goldie Memories</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-1 pl-4 rounded-full border border-stone-200 shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden md:block">Admins Only</span>
          <AuthButton />
        </motion.div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-6 max-w-7xl mx-auto gap-12 lg:gap-24 py-12 md:py-20 text-left">
        {/* Left Content */}
        <div className="flex-1 space-y-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Preserving Gold&apos;s journey
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-stone-900 leading-[0.95] tracking-tighter">
              Your daily dose <br />
              <span className="text-rose-500">of joy.</span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-medium max-w-lg">
              Capture and privately share sweet snapshots and clips of Gold with our family photo-sharing sanctuary.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/gallery"
              className="w-full sm:w-auto px-10 py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-2"
            >
              Enter the Gallery <ArrowRight className="w-5 h-5" />
            </Link>

            {session && (
              <Link
                href="/admin/upload"
                className="w-full sm:w-auto px-10 py-5 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-rose-200 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Preserve a Memory
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-bold text-stone-500">100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-bold text-stone-500">Family Owned</span>
            </div>
          </motion.div>
        </div>

        {/* Right Content: Mobile Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Mobile Frame Container */}
          <div className="relative w-[320px] h-[640px] md:w-[360px] md:h-[720px] bg-stone-900 rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-stone-800">
            {/* Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-800 rounded-b-2xl z-30" />

            {/* Screen Content */}
            <div className="relative w-full h-full bg-stone-100 rounded-[2rem] overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/assets/home-video.mp4" type="video/mp4" />
              </video>

              {/* Mobile UI Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-10 left-6 text-white drop-shadow-lg">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Today&apos;s Memory</p>
                <p className="text-xl font-serif font-bold italic underline decoration-rose-500 underline-offset-4">Goldie&apos;s first crawl</p>
              </div>
            </div>
          </div>

          {/* Decorative Tag */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-12 bg-amber-400 text-stone-900 p-4 rounded-2xl shadow-xl rotate-12 font-black text-xl border-4 border-white"
          >
            JOY! 🍿
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-stone-100 pt-10">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
            Built with ❤️ for Gold &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-stone-400">
            <Link href="/gallery" className="hover:text-rose-500 transition-colors">Archive</Link>
            <Link href="/albums" className="hover:text-rose-500 transition-colors">Albums</Link>
            <span className="opacity-30">Sanctuary Alpha v1.2</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
