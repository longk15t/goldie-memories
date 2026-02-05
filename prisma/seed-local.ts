import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    if (!fs.existsSync(uploadsDir)) {
        console.log('No uploads directory found in public/')
        return
    }

    // Iterate through subdirectories (Albums)
    const items = fs.readdirSync(uploadsDir, { withFileTypes: true })

    for (const item of items) {
        if (item.isDirectory()) {
            const albumTitle = item.name.charAt(0).toUpperCase() + item.name.slice(1) // Capitalize
            const albumSlug = item.name.toLowerCase()

            console.log(`Processing Album: ${albumTitle}`)

            // Create Album
            const album = await prisma.album.upsert({
                where: { slug: albumSlug },
                update: {},
                create: {
                    title: albumTitle,
                    slug: albumSlug,
                    description: `Memories from ${albumTitle}`,
                }
            })

            // Process Files in Album Folder
            const albumPath = path.join(uploadsDir, item.name)
            const files = fs.readdirSync(albumPath)

            for (const file of files) {
                if (file === '.DS_Store') continue;

                const webPath = `/uploads/${item.name}/${file}` // e.g. /uploads/newborn/img.jpg
                const fileExt = path.extname(file).toLowerCase()
                const isVideo = ['.mp4', '.mov', '.webm'].includes(fileExt)
                const type = isVideo ? 'video' : 'image'

                // Check if exists
                const exists = await prisma.media.findFirst({ where: { url: webPath } })

                if (!exists) {
                    await prisma.media.create({
                        data: {
                            url: webPath,
                            type: type,
                            caption: file,
                            albumId: album.id
                        }
                    })
                    console.log(`  Added: ${file}`)
                }
            }
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
