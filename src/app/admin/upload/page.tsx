"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<{ [key: string]: string }>({});

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': []
        }
    });

    // ... inside component
    const [albums, setAlbums] = useState<{ id: string; title: string }[]>([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
    const [newAlbumName, setNewAlbumName] = useState("");
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

    // Fetch albums on mount
    useEffect(() => {
        fetch("/api/albums").then(res => res.json()).then(data => {
            if (Array.isArray(data)) setAlbums(data);
        });
    }, []);

    const handleCreateAlbum = async () => {
        if (!newAlbumName) return;
        const res = await fetch("/api/albums", {
            method: "POST",
            body: JSON.stringify({ title: newAlbumName }),
            headers: { "Content-Type": "application/json" }
        });
        if (res.ok) {
            const album = await res.json();
            setAlbums([album, ...albums]);
            setSelectedAlbumId(album.id);
            setIsCreatingAlbum(false);
            setNewAlbumName("");
        }
    };

    const removeFile = (name: string) => {
        setFiles((files) => files.filter((f) => f.name !== name));
    };

    const handleUpload = async () => {
        setUploading(true);
        for (const file of files) {
            setProgress((prev) => ({ ...prev, [file.name]: "processing" }));

            try {
                // 1. Get Presigned URL
                const res = await fetch("/api/upload/url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filename: file.name, contentType: file.type }),
                });

                if (!res.ok) throw new Error("Failed to get sign url");
                const { uploadUrl, publicUrl } = await res.json();

                // 2. Upload to R2
                setProgress((prev) => ({ ...prev, [file.name]: "uploading" }));
                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type }
                });

                if (!uploadRes.ok) throw new Error("Upload failed");

                // 3. Save Metadata
                setProgress((prev) => ({ ...prev, [file.name]: "saving" }));
                await fetch("/api/media", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: publicUrl,
                        type: file.type.startsWith("video") ? "video" : "image",
                        caption: file.name, // Default caption
                        albumId: selectedAlbumId || null
                    }),
                });

                setProgress((prev) => ({ ...prev, [file.name]: "done" }));
            } catch (error) {
                console.error("Upload error for " + file.name + ":", error);
                setProgress((prev) => ({ ...prev, [file.name]: "error" }));
            }
        }
        setUploading(false);
    };

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-stone-200 pb-6">
                    <h1 className="text-3xl font-serif text-stone-900">Upload Memories</h1>
                    <Link href="/gallery" className="text-sm text-amber-700 hover:text-amber-600 flex items-center gap-1 font-medium transition-colors">
                        Go to Gallery <ArrowRight className="w-4 h-4" />
                    </Link>
                </header>

                {/* Album Selector */}
                <div className="glass p-6 rounded-2xl border border-amber-900/10 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Select Album</label>
                        <select
                            value={selectedAlbumId}
                            onChange={(e) => setSelectedAlbumId(e.target.value)}
                            className="bg-white border border-amber-900/10 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="">-- General / No Album --</option>
                            {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <span className="text-stone-300 text-xs font-bold px-2 uppercase tracking-tighter">or</span>
                    </div>

                    <div className="w-full">
                        {!isCreatingAlbum ? (
                            <button
                                onClick={() => setIsCreatingAlbum(true)}
                                className="w-full py-3 border-2 border-dashed border-amber-900/10 rounded-xl text-stone-400 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/50 transition-all font-bold text-xs uppercase tracking-widest"
                            >
                                + Create New Album
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Album Name..."
                                    className="flex-1 bg-white border border-amber-900/10 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-amber-500 font-medium"
                                    value={newAlbumName}
                                    onChange={e => setNewAlbumName(e.target.value)}
                                />
                                <button onClick={handleCreateAlbum} className="px-5 bg-amber-500 rounded-xl text-white hover:bg-amber-700 font-bold transition-all shadow-lg shadow-amber-200/50">Add</button>
                                <button onClick={() => setIsCreatingAlbum(false)} className="px-2 text-stone-400 hover:text-stone-600 transition-colors"><X /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group ${isDragActive
                        ? "border-amber-500 bg-amber-50/80 shadow-inner"
                        : "border-amber-900/10 bg-white/40 hover:border-amber-400/40 hover:bg-amber-50/30"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-6 border border-amber-900/5 shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <Upload className="w-10 h-10 text-amber-500" />
                    </div>
                    <p className="text-xl font-bold text-stone-800 mb-2">
                        {isDragActive ? "Drop them here..." : "Drag & drop memories here"}
                    </p>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">or click to browse your library</p>
                </div>

                {/* File List */}
                <AnimatePresence>
                    {files.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold px-2">
                                <span>Selected Files ({files.length})</span>
                                {!uploading && (
                                    <button
                                        onClick={() => setFiles([])}
                                        className="hover:text-amber-600 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {files.map((file) => (
                                <motion.div
                                    key={file.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-900/5 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50/50 flex items-center justify-center text-[10px] font-black text-amber-900/30 border border-amber-900/5 uppercase tracking-tighter">
                                            {file.type.startsWith('image') ? 'IMG' : 'VID'}
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-bold text-stone-800 truncate max-w-[200px] md:max-w-md">{file.name}</span>
                                            <span className="text-[10px] text-stone-400 font-bold tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {progress[file.name] === "processing" && <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />}
                                        {progress[file.name] === "uploading" && <span className="text-[10px] font-black text-amber-600 animate-pulse uppercase tracking-widest">Uploading</span>}
                                        {progress[file.name] === "saving" && <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Finishing</span>}
                                        {progress[file.name] === "done" && <Check className="w-5 h-5 text-amber-600" />}
                                        {progress[file.name] === "error" && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Failed</span>}

                                        {!uploading && !progress[file.name] && (
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(file.name); }} className="p-2 hover:bg-amber-50 rounded-lg transition-colors group">
                                                <X className="w-4 h-4 text-stone-300 group-hover:text-amber-700" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Upload Button */}
                {files.length > 0 && !uploading && (
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleUpload}
                            className="px-12 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-stone-200 flex items-center gap-2 uppercase tracking-[0.15em] text-xs"
                        >
                            Start Securing Memories
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
