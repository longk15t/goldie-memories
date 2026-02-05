"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

type MediaItem = {
    id: string;
    url: string;
    type: string;
    caption: string | null;
    width: number | null;
    height: number | null;
};

export default function GalleryGrid({ items }: { items: MediaItem[] }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ESC key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedId) {
                setSelectedId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 p-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                        onClick={() => setSelectedId(item.id)}
                    >
                        <div className="relative w-full">
                            {/* Aspect Ratio preservation logic if width/height known, else auto */}
                            {item.type === 'video' ? (
                                <video
                                    src={item.url}
                                    className="w-full h-auto object-cover rounded-md"
                                    muted
                                    playsInline
                                    onMouseOver={e => e.currentTarget.play()}
                                    onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                />
                            ) : (
                                <Image
                                    src={item.url}
                                    alt={item.caption || "Memory"}
                                    width={item.width || 800}
                                    height={item.height || 600}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}

                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 text-white text-sm font-medium">
                                    {item.caption}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox / Detail View */}
            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-2"
                    >
                        {(() => {
                            const selectedItem = items.find(i => i.id === selectedId);
                            if (!selectedItem) return null;

                            return selectedItem.type === 'video' ? (
                                <video
                                    src={selectedItem.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={selectedItem.url}
                                    alt="Full view"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            );
                        })()}
                    </motion.div>
                </div>
            )}
        </>
    );
}
