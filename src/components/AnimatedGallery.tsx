"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export function AnimatedGalleryContainer({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-16"
        >
            {children}
        </motion.div>
    );
}

export function AnimatedGallerySection({ children, id }: { children: ReactNode; id?: string }) {
    return (
        <motion.section variants={item} id={id}>
            {children}
        </motion.section>
    );
}
