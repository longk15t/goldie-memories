import prisma from "@/lib/prisma";
import Link from "next/link";
import { Star, FolderHeart } from "lucide-react";
import CreateAlbumDialog from "@/components/CreateAlbumDialog";
import SortableAlbumsGrid from "@/components/SortableAlbumsGrid";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function AlbumsPage() {
    const session = await auth();
    const albums = await prisma.album.findMany({
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ],
        include: {
            _count: { select: { media: true } },
            media: {
                take: 10,
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
                <header className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Gold&apos;s albums</h1>
                        <p className="text-stone-500 max-w-2xl">Organized chapters of his life journey</p>
                    </div>
                    {session && <CreateAlbumDialog />}
                </header>

                <SortableAlbumsGrid
                    initialAlbums={albums}
                    isAdmin={!!session}
                />

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

