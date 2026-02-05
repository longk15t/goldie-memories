import prisma from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";
import { Star } from "lucide-react";
import Link from "next/link";
import { AnimatedGalleryContainer, AnimatedGallerySection } from "@/components/AnimatedGallery";

export const dynamic = 'force-dynamic';

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

    return (
        <main className="min-h-screen">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-amber-900/10">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-bold text-stone-600 uppercase tracking-widest">
                    <Link href="/albums" className="hover:text-amber-700 transition-colors">Albums</Link>
                    <Link href="/gallery" className="text-amber-700">All Photos</Link>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto py-8 px-4">
                <AnimatedGalleryContainer>
                    {albums.map((album: any) => (
                        <AnimatedGallerySection key={album.id}>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1 border-b border-amber-900/10 pb-4">
                                    <div className="flex items-baseline gap-4">
                                        <h2 className="font-serif text-2xl md:text-3xl text-amber-900/80">{album.title}</h2>
                                        <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{album.media?.length || 0} memories</span>
                                    </div>
                                    {album.description && (
                                        <p className="text-stone-600 text-sm max-w-2xl font-medium">{album.description}</p>
                                    )}
                                </div>

                                {album.media && album.media.length > 0 ? (
                                    <GalleryGrid items={album.media} />
                                ) : (
                                    <p className="text-stone-400 italic text-sm py-4">No photos in this album yet.</p>
                                )}
                            </div>
                        </AnimatedGallerySection>
                    ))}
                </AnimatedGalleryContainer>
            </div>
        </main>
    );
}
