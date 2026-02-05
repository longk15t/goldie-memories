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
    order: number;
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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.3 : 1
    };

    const cardContent = (
        <div className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                {isSortable && (
                    <div className="absolute top-4 left-4 z-30 bg-black/40 p-2 rounded-full backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" {...listeners} {...attributes}>
                        <GripVertical className="w-5 h-5" />
                    </div>
                )}

                {album.coverUrl ? (
                    <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : album.media.length > 0 ? (
                    <div className="relative w-full h-full p-8 group-hover:scale-105 transition-transform duration-700">
                        {album.media.slice(0, 3).map((item, i) => (
                            <div
                                key={item.url}
                                className="absolute top-1/2 left-1/2 w-64 h-48 bg-stone-100 rounded-lg shadow-md border border-white overflow-hidden"
                                style={{
                                    transform: `translate(-50%, -50%) rotate(${(i - 1) * 8}deg) translateY(${i * -4}px) scale(${1 - i * 0.05})`,
                                    zIndex: 3 - i
                                }}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.url} className="object-cover w-full h-full" muted playsInline />
                                ) : (
                                    <Image src={item.url} alt="Thumbnail" fill className="object-cover" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-stone-400">
                        <FolderHeart className="w-12 h-12 mb-2" />
                        <span className="text-xs font-medium">Empty</span>
                    </div>
                )}
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">{album.title}</h2>
                <p className="text-stone-500 text-sm line-clamp-2 mb-4">{album.description || "No description"}</p>
                <div className="flex items-center text-xs text-stone-400 font-medium uppercase tracking-wider">
                    <span>{album._count.media} Memories</span>
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

    useEffect(() => {
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
