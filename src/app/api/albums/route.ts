import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: List all albums
export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(albums);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
    }
}

// POST: Create a new album
export async function POST(request: Request) {
    try {
        const { title, description } = await request.json();
        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const album = await prisma.album.create({
            data: {
                title,
                description,
                slug,
                // coverUrl could be passed or set later
            },
        });

        return NextResponse.json(album);
    } catch (error) {
        // Handle uniqueness constraint on slug
        return NextResponse.json({ error: "Failed to create album (name might exist)" }, { status: 500 });
    }
}

// PUT: Update an album
export async function PUT(request: Request) {
    try {
        const { id, title, description } = await request.json();
        if (!id || !title) return NextResponse.json({ error: "ID and Title required" }, { status: 400 });

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const album = await prisma.album.update({
            where: { id },
            data: {
                title,
                description,
                slug
            },
        });

        return NextResponse.json(album);
        return NextResponse.json(album);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
    }
}

// DELETE: Delete an album
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        // Unlink media first (keep photos, just remove from album)
        await prisma.media.updateMany({
            where: { albumId: id },
            data: { albumId: null }
        });

        // Delete album
        await prisma.album.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
    }
}
