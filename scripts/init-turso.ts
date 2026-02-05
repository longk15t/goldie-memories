import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
}

const client = createClient({ url, authToken });

async function init() {
    console.log("Initializing Turso database...");
    const sqlPath = join(process.cwd(), "prisma", "init_turso.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    // Split SQL by semicolons, but be careful with comments or strings
    // For simple Prisma output, we can split by semicolon.
    const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await client.execute(statement);
    }

    console.log("Turso database initialized successfully!");
}

init().catch((err) => {
    console.error("Initialization failed:", err);
    process.exit(1);
});
