import prisma from "@/lib/prisma";
import SortableGallery from "@/components/SortableGallery";
import AlbumEditDialog from "@/components/AlbumEditDialog";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AlbumDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    const album = await prisma.album.findUnique({
        where: { slug },
        include: {
            media: {
                orderBy: [
                    { order: 'asc' },
                    { createdAt: 'desc' }
                ]
            }
        }
    });

    if (!album) {
        notFound();
    }

    return (
        <main className="min-h-screen">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-stone-200">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Goldie Memories</span>
                </Link>
                <div className="flex gap-6 text-sm font-medium text-stone-500">
                    <Link href="/albums" className="text-amber-600">Back to Albums</Link>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto py-8">
                <header className="px-4 mb-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link href="/albums" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 text-sm transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Collections
                            </Link>
                            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">{album.title}</h1>
                            <p className="text-stone-600 max-w-3xl text-lg leading-relaxed">{album.description}</p>
                        </div>
                        <AlbumEditDialog album={album} />
                    </div>
                </header>

                <SortableGallery items={album.media} albumId={album.id} />
            </div>
        </main>
    );
}
