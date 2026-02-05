import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const { updates } = await request.json(); // Expecting array of { id: string, order: number }

        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: "Invalid updates format" }, { status: 400 });
        }

        // Use a transaction to ensure all updates succeed
        await prisma.$transaction(
            updates.map((item: { id: string; order: number }) =>
                prisma.media.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder error:", error);
        return NextResponse.json({ error: "Failed to reorder media" }, { status: 500 });
    }
}
