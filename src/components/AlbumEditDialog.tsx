"use client";

import { useState } from "react";
import { X, Edit2, Loader2, Save, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AlbumEditDialog({ album }: { album: { id: string, title: string, description: string | null } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); // Confirm state
    const [title, setTitle] = useState(album.title);
    const [description, setDescription] = useState(album.description || "");
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/albums", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: album.id }),
            });

            if (res.ok) {
                setIsOpen(false);
                router.push("/albums"); // Redirect to list
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/albums", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: album.id, title, description }),
            });

            if (res.ok) {
                const updated = await res.json();
                setIsOpen(false);
                router.refresh();
                // If slug changed, we might need to redirect, but for simplicity we'll just refresh or let the user navigate if 404
                if (updated.slug !== album.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
                    router.push(`/albums/${updated.slug}`);
                }
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-stone-400 hover:text-white transition-colors"
                title="Edit Album"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-white">Edit Album</h3>
                    <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Album Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="e.g. Summer Vacation"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 transition-colors bg-transparent resize-none h-24"
                            placeholder="What made this special?"
                        />
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-4">
                        {!isDeleting ? (
                            <button
                                onClick={() => setIsDeleting(true)}
                                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Album
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-red-500 font-medium">Are you sure?</span>
                                <button onClick={handleDelete} disabled={isLoading} className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded hover:bg-red-500/20">Yes</button>
                                <button onClick={() => setIsDeleting(false)} className="text-xs text-stone-500 px-2 py-1 hover:text-white">Cancel</button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm text-stone-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || !title}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
