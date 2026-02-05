import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Star, FolderHeart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AlbumsPage() {
    const albums = await prisma.album.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { media: true } },
            media: {
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: { url: true, type: true }
            }
        }
    });

    return (
        <main className="min-h-screen">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-stone-200">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-medium text-stone-500">
                    <Link href="/albums" className="text-amber-600">Albums</Link>
                    <Link href="/gallery" className="hover:text-amber-600 transition-colors">All Photos</Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-12 px-4">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Memory Collections</h1>
                    <p className="text-stone-500 max-w-2xl">Organized chapters of the journey.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map(album => (
                        <Link key={album.id} href={`/albums/${album.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                                {/* Collage Logic */}
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
                                                    <video
                                                        src={item.url}
                                                        className="object-cover w-full h-full"
                                                        muted
                                                        playsInline
                                                    // No autoplay to save resources, browser might start loading
                                                    />
                                                ) : (
                                                    <Image
                                                        src={item.url}
                                                        alt="Thumbnail"
                                                        fill
                                                        className="object-cover"
                                                    />
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

                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-serif text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">{album.title}</h2>
                                <p className="text-stone-500 text-sm line-clamp-2 mb-4">{album.description || "No description"}</p>
                                <div className="flex items-center text-xs text-stone-400 font-medium uppercase tracking-wider">
                                    <span>{album._count.media} Memories</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {albums.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 border-dashed shadow-sm">
                        <FolderHeart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-stone-700 mb-2">No Albums Yet</h3>
                        <p className="text-stone-500 mb-6">Create your first album to start organizing memories.</p>
                        <Link href="/admin/upload" className="px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors font-medium">
                            Create Album
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
