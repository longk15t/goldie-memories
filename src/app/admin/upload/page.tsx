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
        <div className="min-h-screen bg-stone-950 text-stone-100 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-serif text-white">Upload Memories</h1>
                    <Link href="/gallery" className="text-sm text-stone-400 hover:text-white flex items-center gap-1">
                        Go to Gallery <ArrowRight className="w-4 h-4" />
                    </Link>
                </header>

                {/* Album Selector */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs text-stone-400 uppercase tracking-widest">Select Album</label>
                        <select
                            value={selectedAlbumId}
                            onChange={(e) => setSelectedAlbumId(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                        >
                            <option value="">-- General / No Album --</option>
                            {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                    </div>

                    <div className="flex items-end pb-1">
                        <span className="text-stone-500 text-sm px-2">or</span>
                    </div>

                    <div className="w-full">
                        {!isCreatingAlbum ? (
                            <button
                                onClick={() => setIsCreatingAlbum(true)}
                                className="w-full py-2 border border-dashed border-stone-600 rounded-lg text-stone-400 hover:text-white hover:border-stone-400 transition-colors"
                            >
                                + Create New Album
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Album Name (e.g. Kindergarten)"
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    value={newAlbumName}
                                    onChange={e => setNewAlbumName(e.target.value)}
                                />
                                <button onClick={handleCreateAlbum} className="px-4 bg-amber-600 rounded-lg text-white hover:bg-amber-500">Add</button>
                                <button onClick={() => setIsCreatingAlbum(false)} className="px-2 text-stone-400 hover:text-white"><X /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? "border-amber-500 bg-amber-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mb-4 border border-white/10">
                        <Upload className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-lg font-medium text-white mb-2">
                        {isDragActive ? "Drop files here..." : "Drag & drop memories here"}
                    </p>
                    <p className="text-sm text-stone-500">or click to browse photos/videos</p>
                </div>

                {/* File List */}
                <AnimatePresence>
                    {files.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm text-stone-400 uppercase tracking-widest px-2">
                                <span>Selected Files ({files.length})</span>
                                {!uploading && (
                                    <button
                                        onClick={() => setFiles([])}
                                        className="hover:text-red-400"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {files.map((file) => (
                                <motion.div
                                    key={file.name}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded bg-stone-800 flex items-center justify-center text-xs text-stone-500 overflow-hidden">
                                            {file.type.startsWith('image') ? 'IMG' : 'VID'}
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</span>
                                            <span className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {progress[file.name] === "processing" && <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />}
                                        {progress[file.name] === "uploading" && <span className="text-xs text-amber-500 animate-pulse">Uploading...</span>}
                                        {progress[file.name] === "saving" && <span className="text-xs text-blue-400">Saving...</span>}
                                        {progress[file.name] === "done" && <Check className="w-5 h-5 text-green-500" />}
                                        {progress[file.name] === "error" && <span className="text-xs text-red-500">Failed</span>}

                                        {!uploading && !progress[file.name] && (
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}>
                                                <X className="w-4 h-4 text-stone-500 hover:text-white" />
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
                    <div className="flex justify-end">
                        <button
                            onClick={handleUpload}
                            className="px-8 py-3 bg-amber-500 text-stone-900 font-bold rounded-full hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                        >
                            Start Upload
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
