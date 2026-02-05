import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
    const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (databaseUrl && databaseUrl.startsWith('libsql://')) {
        console.log('Initialize Prisma with LibSQL adapter');
        const adapter = new PrismaLibSql({
            url: databaseUrl,
            authToken: authToken,
        } as any)
        return new PrismaClient({ adapter })
    }

    console.log('Initialize Prisma with default adapter');
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
