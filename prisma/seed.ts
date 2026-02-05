import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
    // Create "Early Days" Album
    const earlyDays = await prisma.album.upsert({
        where: { slug: 'early-days' },
        update: {},
        create: {
            title: 'Early Days',
            slug: 'early-days',
            description: 'The first few months of wonder.',
            coverUrl: 'https://images.unsplash.com/photo-1544126566-47a32d90c0a6?q=80&w=2670&auto=format&fit=crop', // Placeholder
            media: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop',
                        type: 'image',
                        caption: 'Sleeping peacefully',
                        width: 800,
                        height: 600,
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2670&auto=format&fit=crop',
                        type: 'image',
                        caption: 'First sunshine',
                        width: 800,
                        height: 600,
                    }
                ]
            }
        },
    })

    // Create "First Steps" Album
    await prisma.album.upsert({
        where: { slug: 'first-steps' },
        update: {},
        create: {
            title: 'First Steps',
            slug: 'first-steps',
            description: 'Wobbly but determined!',
            coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6963638b47?q=80&w=2670&auto=format&fit=crop',
        },
    })

    console.log({ earlyDays })
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
