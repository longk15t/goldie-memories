import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || "https://example.r2.cloudflarestorage.com", // User needs to set this
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "demo_key",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "demo_secret",
    },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "goldie-memories";
export const R2_PUBLIC_URL_PREFIX = process.env.R2_PUBLIC_URL || "https://pub-demo.r2.dev";
