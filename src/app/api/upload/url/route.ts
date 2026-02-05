import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL_PREFIX } from "@/lib/storage";

export async function POST(request: Request) {
    try {
        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
        }

        // Generate unique key
        const uniqueId = crypto.randomUUID();
        const ext = filename.split('.').pop();
        const key = `uploads/${uniqueId}.${ext}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const publicUrl = `${R2_PUBLIC_URL_PREFIX}/${key}`;

        return NextResponse.json({ uploadUrl, publicUrl, key });
    } catch (error) {
        console.error("Presign error:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
