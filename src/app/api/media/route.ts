import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, type, caption, albumId, width, height } = body;

        const media = await prisma.media.create({
            data: {
                url,
                type,
                caption,
                albumId: albumId || undefined, // Allow null
                width,
                height,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("Save media error:", error);
        return NextResponse.json({ error: "Failed to save media" }, { status: 500 });
    }
}
