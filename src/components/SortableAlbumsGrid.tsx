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
import Link from "next/link";
import Image from "next/image";
import { FolderHeart, GripVertical } from "lucide-react";

type AlbumWithMedia = {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    coverUrl: string | null;
    order?: number;
    _count: { media: number };
    media: { url: string; type: string }[];
};

function SortableAlbumCard({ album, isSortable }: { album: AlbumWithMedia; isSortable: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: album.id, disabled: !isSortable });

    const [displayMedia, setDisplayMedia] = useState<typeof album.media>([]);

    useEffect(() => {
        // Truly random shuffle on every mount/visit
        const shuffled = [...album.media]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        setDisplayMedia(shuffled);
    }, [album.media]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.3 : 1
    };

    // Deterministic randomization for rotations/offsets so they stay visually pleasing
    const getRotation = (index: number) => {
        const hash = album.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 137;
        return (hash % 24) - 12; // -12 to 12 degrees
    };

    const getOffset = (index: number) => {
        const hash = album.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index * 59;
        const x = (hash % 20) - 10;
        const y = ((hash * 7) % 20) - 10;
        return { x, y };
    };

    const cardContent = (
        <div className="group block h-full">
            {/* Wooden Frame Container */}
            <div className="relative p-3 bg-[#3d2b1f] rounded-lg shadow-2xl border-t-2 border-l-2 border-[#5c4033] border-b-4 border-r-4 border-[#1a120b] transition-transform duration-300 group-hover:-translate-y-1">
                {/* Inner Bevel */}
                <div className="bg-[#2a1d15] p-1 rounded shadow-inner">
                    <div className="aspect-[4/3] bg-stone-900/40 relative overflow-hidden flex items-center justify-center rounded-sm">
                        {isSortable && (
                            <div className="absolute top-4 left-4 z-40 bg-black/60 p-2 rounded-full backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" {...listeners} {...attributes}>
                                <GripVertical className="w-4 h-4" />
                            </div>
                        )}

                        <div className="relative w-full h-full p-4">
                            {displayMedia.length > 0 ? (
                                displayMedia.slice().reverse().map((item, i) => {
                                    const rot = getRotation(i);
                                    const offset = getOffset(i);
                                    const actualIndex = displayMedia.length - 1 - i;

                                    return (
                                        <div
                                            key={item.url}
                                            className="absolute top-1/2 left-1/2 w-[85%] h-[85%] bg-white p-2 pb-8 shadow-xl border border-stone-200"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rot}deg)`,
                                                zIndex: actualIndex
                                            }}
                                        >
                                            <div className="relative w-full h-full bg-stone-100 overflow-hidden">
                                                {item.type === 'video' ? (
                                                    <video src={item.url} className="object-cover w-full h-full" muted playsInline />
                                                ) : (
                                                    <Image src={item.url} alt="Thumbnail" fill className="object-cover" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center text-amber-900/40 p-8">
                                    <FolderHeart className="w-12 h-12 mb-2" />
                                    <span className="text-xs font-serif font-medium uppercase tracking-widest">Empty Album</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Title & Info */}
            <div className="mt-4 px-2">
                <h2 className="text-xl font-serif text-stone-800 mb-1 group-hover:text-amber-700 transition-colors leading-tight">{album.title}</h2>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-serif uppercase tracking-[0.2em]">
                        {album._count.media} Memories
                    </span>
                    <div className="h-[1px] flex-1 mx-3 bg-stone-200" />
                </div>
            </div>
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            {isSortable ? (
                // When sortable, we might want to wrap in a div that allows dragging but has a link inside
                // But dnd-kit works best if the whole item is sortable. 
                // We'll make the Grip handle the drag and the card handle the click.
                <div className="relative h-full">
                    <Link href={`/albums/${album.slug}`} className="block h-full">
                        {cardContent}
                    </Link>
                </div>
            ) : (
                <Link href={`/albums/${album.slug}`} className="block h-full">
                    {cardContent}
                </Link>
            )}
        </div>
    );
}

export default function SortableAlbumsGrid({
    initialAlbums,
    isAdmin
}: {
    initialAlbums: AlbumWithMedia[];
    isAdmin: boolean;
}) {
    const [albums, setAlbums] = useState(initialAlbums);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setAlbums(initialAlbums);
    }, [initialAlbums]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => (
                    <div key={album.id} className="h-[400px] bg-stone-100/50 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = albums.findIndex((a) => a.id === active.id);
            const newIndex = albums.findIndex((a) => a.id === over!.id);
            const newOrder = arrayMove(albums, oldIndex, newIndex);

            setAlbums(newOrder);

            // Persist to server
            try {
                const orders = newOrder.map((album, index) => ({
                    id: album.id,
                    order: index
                }));

                await fetch("/api/albums/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orders })
                });
            } catch (err) {
                console.error("Failed to save album order", err);
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SortableContext items={albums} strategy={rectSortingStrategy}>
                    {albums.map((album) => (
                        <SortableAlbumCard
                            key={album.id}
                            album={album}
                            isSortable={isAdmin}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
}
