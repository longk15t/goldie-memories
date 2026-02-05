import prisma from "@/lib/prisma"; // Need to create lib/prisma
import GalleryGrid from "@/components/GalleryGrid";
import { Star } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // For demo purposes, or use revalidation

export default async function GalleryPage() {
    // Fetch albums with their media
    const albums = await prisma.album.findMany({
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ],
        include: {
            media: {
                orderBy: { order: 'asc' }
            }
        }
    });

    // Also fetch media that doesn't belong to any album (if any)
    const uncategorizedMedia = await prisma.media.findMany({
        where: { albumId: null },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-stone-200">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-medium text-stone-500">
                    <Link href="/albums" className="hover:text-amber-600 transition-colors">Albums</Link>
                    <Link href="/gallery" className="text-amber-600">All Photos</Link>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto py-8 px-4">
                <header className="mb-12">
                    <h1 className="font-serif text-4xl text-stone-900 mb-2">Every moment of Gold</h1>
                </header>

                <div className="space-y-16">
                    {albums.map(album => (
                        <section key={album.id} className="space-y-6">
                            <div className="flex flex-col gap-1 border-b border-stone-200 pb-4">
                                <div className="flex items-baseline gap-4">
                                    <h2 className="font-serif text-2xl md:text-3xl text-amber-600/90">{album.title}</h2>
                                    <span className="text-stone-400 text-sm">{album.media.length} memories</span>
                                </div>
                                {album.description && (
                                    <p className="text-stone-500 text-sm max-w-2xl">{album.description}</p>
                                )}
                            </div>

                            {album.media.length > 0 ? (
                                <GalleryGrid items={album.media} />
                            ) : (
                                <p className="text-stone-400 italic text-sm py-4">No photos in this album yet.</p>
                            )}
                        </section>
                    ))}

                    {uncategorizedMedia.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-baseline gap-4 border-b border-stone-200 pb-2">
                                <h2 className="font-serif text-2xl md:text-3xl text-stone-400">Uncategorized</h2>
                                <span className="text-stone-400 text-sm">{uncategorizedMedia.length} memories</span>
                            </div>
                            <GalleryGrid items={uncategorizedMedia} />
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
