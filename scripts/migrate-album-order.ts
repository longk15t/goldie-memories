import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
}

const client = createClient({ url, authToken });

async function migrate() {
    console.log("Checking for 'order' column in Album table...");
    try {
        await client.execute('ALTER TABLE Album ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;');
        console.log("Column 'order' added to Album table successfully!");
    } catch (err: any) {
        if (err.message.includes("duplicate column name")) {
            console.log("Column 'order' already exists in Album table.");
        } else {
            console.error("Migration failed:", err);
            process.exit(1);
        }
    }
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
