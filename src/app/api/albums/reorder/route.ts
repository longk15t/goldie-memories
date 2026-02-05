import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { orders } = await request.json(); // Array of { id: string, order: number }

        if (!Array.isArray(orders)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Batch update orders
        await Promise.all(
            orders.map(({ id, order }) =>
                prisma.album.update({
                    where: { id },
                    data: { order }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder albums error:", error);
        return NextResponse.json({ error: "Failed to reorder albums" }, { status: 500 });
    }
}
