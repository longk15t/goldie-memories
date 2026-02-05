"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type MediaItem = {
    id: string;
    url: string;
    type: string;
    caption: string | null;
    width: number | null;
    height: number | null;
    order: number;
};

// Sortable Item Component
function SortableMediaItem({ item, onClick, index }: { item: MediaItem; onClick: () => void, index: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.3 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none break-inside-avoid relative group cursor-grab active:cursor-grabbing overflow-hidden rounded-xl bg-white shadow-sm border border-stone-100">
            <div className="relative w-full aspect-[4/3] md:aspect-auto">
                {item.type === 'video' ? (
                    <video
                        src={item.url}
                        className="w-full h-full object-cover rounded-md pointer-events-none"
                        muted
                    />
                ) : (
                    <img
                        src={item.url}
                        alt={item.caption || "Memory"}
                        className="w-full h-full min-h-[200px] object-cover pointer-events-none"
                    />
                )}
                <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    #{index + 1}
                </div>
                {/* Click handler separate from drag listeners via overlay or specific area? 
                     Actually standard dnd-kit allows click if not dragging. But we used listeners on container.
                     We'll put an overlay for clicking to view */
                }
                <div
                    className="absolute inset-0 z-20 cursor-pointer opacity-0"
                    onClick={(e) => {
                        // Stop propagation to prevent drag start if needed, but usually pointer sensor distinguishes.
                        // Actually dnd-kit pointer sensor handles this well.
                        // But we want a dedicated view button or area if dragging is on the whole item.
                        // Let's rely on standard behavior: small movement = click, large = drag.
                        // To be safe, maybe a view button?
                        // Let's try simple onClick first, but Dnd-Kit suppresses clicks on drag.
                        onClick();
                    }}
                />
            </div>
        </div>
    );
}

export default function SortableGallery({ items, albumId }: { items: MediaItem[], albumId: string }) {
    const [mediaItems, setMediaItems] = useState(items);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Update local state if props change (e.g. initial load or external update)
    useEffect(() => {
        setMediaItems(items);
    }, [items]);

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to start drag, allowing clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setMediaItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over!.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Optimistic UI updated. Now persist.
                persistOrder(newOrder);

                return newOrder;
            });
        }
    }

    async function persistOrder(orderedItems: MediaItem[]) {
        const updates = orderedItems.map((item, index) => ({
            id: item.id,
            order: index
        }));

        try {
            await fetch("/api/media/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updates })
            });
        } catch (err) {
            console.error("Failed to save order", err);
            // Optionally revert state here
        }
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    <SortableContext items={mediaItems} strategy={rectSortingStrategy}>
                        {mediaItems.map((item, index) => (
                            <SortableMediaItem
                                key={item.id}
                                item={item}
                                index={index}
                                onClick={() => setSelectedId(item.id)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {/* Lightbox Reuse - duplicated code, should ideally be shared component but keeping isolated for now */}
            {selectedId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-2">
                        {(() => {
                            const selectedItem = mediaItems.find(i => i.id === selectedId);
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
                    </div>
                </div>
            )}
        </>
    );
}
