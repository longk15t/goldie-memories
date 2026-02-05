import prisma from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";
import { Star } from "lucide-react";
import Link from "next/link";
import { AnimatedGalleryContainer, AnimatedGallerySection } from "@/components/AnimatedGallery";
import TimelineNav from "@/components/TimelineNav";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    // Fetch albums with their media
    const albums = await prisma.album.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            media: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    const timelineItems = albums.map(album => ({
        id: album.id,
        title: album.title
    }));

    return (
        <main className="min-h-screen bg-[#fdfcfb]">
            <TimelineNav items={timelineItems} />

            <nav className="p-6 flex justify-between items-center max-w-[1600px] mx-auto w-full border-b border-amber-900/10 relative z-10">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-bold text-stone-600 uppercase tracking-widest">
                    <Link href="/albums" className="hover:text-amber-700 transition-colors">Albums</Link>
                    <Link href="/gallery" className="text-amber-700">All Photos</Link>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto py-12 px-4 xl:pl-80 transition-all duration-500">
                <AnimatedGalleryContainer>
                    {albums.map((album: any) => (
                        <AnimatedGallerySection key={album.id} id={album.id}>
                            <div className="space-y-8">
                                <div className="flex flex-col gap-2 border-b border-amber-900/10 pb-6 relative">
                                    {/* Section Accent */}
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500/20 rounded-full hidden xl:block" />

                                    <div className="flex items-baseline gap-4">
                                        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight">{album.title}</h2>
                                        <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em]">{album.media?.length || 0} memories</span>
                                    </div>
                                    {album.description && (
                                        <p className="text-stone-600 text-base max-w-3xl font-medium leading-relaxed italic">{album.description}</p>
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

                    {albums.length === 0 && (
                        <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-stone-200">
                            <h2 className="font-serif text-2xl text-stone-400">No memories shared yet</h2>
                            <p className="text-stone-400 mt-2">Check back later or explore the albums.</p>
                        </div>
                    )}
                </AnimatedGalleryContainer>
            </div>
        </main>
    );
}
