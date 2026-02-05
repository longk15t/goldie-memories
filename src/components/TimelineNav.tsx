"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
    id: string;
    title: string;
}

export default function TimelineNav({ items }: { items: TimelineItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px", // More sensitive to the top area
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    return (
        <nav className="fixed left-12 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
            <div className="relative">
                {/* Vertical Line - Refined */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-amber-900/10 rounded-full" />

                {/* Active Line Progress */}
                <div className="flex flex-col gap-7 relative">
                    {items.map((item) => {
                        const isActive = activeId === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="group flex items-center gap-4 focus:outline-none"
                            >
                                <div className="relative flex items-center justify-center w-4">
                                    {/* Dot - Refined */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.4 : 1,
                                            backgroundColor: isActive ? "#92400e" : "#e7e5e4",
                                            boxShadow: isActive ? "0 0 12px rgba(146, 64, 14, 0.3)" : "none"
                                        }}
                                        className="w-[10px] h-[10px] rounded-full relative z-10 transition-colors"
                                    />

                                    {/* Hover Ring */}
                                    <div className="absolute inset-0 w-5 h-5 -left-[2px] -top-0.5 rounded-full border border-amber-500/0 group-hover:border-amber-500/20 transition-all scale-0 group-hover:scale-100" />
                                </div>

                                {/* Label - Refined with max-width */}
                                <div className="relative h-5 flex items-center">
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: isActive ? 1 : 0.4,
                                                x: isActive ? 0 : -5,
                                                color: isActive ? "#78350f" : "#78716c"
                                            }}
                                            className={cn(
                                                "whitespace-nowrap font-serif text-[13px] font-bold tracking-tight transition-colors max-w-[180px] truncate",
                                                isActive ? "scale-105 origin-left" : "hover:opacity-100"
                                            )}
                                        >
                                            {item.title}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
