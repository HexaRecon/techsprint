import { PrismaClient, Role, DeploymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding demo data...');

    // 1. Ensure User
    let user = await prisma.user.findFirst({ where: { username: 'demo' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                username: 'demo',
                githubId: 'demo_123',
                avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
                role: Role.OWNER
            }
        });
    }

    // 2. Clear existing demo data (optional, but good for reset)
    // await prisma.deployment.deleteMany({ where: { project: { userId: user.id } } });
    // await prisma.project.deleteMany({ where: { userId: user.id } });

    // 3. Create "E-commerce Platform" Project
    const ecommerce = await prisma.project.create({
        data: {
            name: 'ecommerce-platform',
            gitRepository: 'https://github.com/demo/ecommerce',
            branch: 'main',
            userId: user.id,
            deployments: {
                create: [
                    {
                        status: DeploymentStatus.RUNNING,
                        commitHash: 'a1b2c3d',
                        commitMessage: 'feat: add cart functionality',
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                    },
                    {
                        status: DeploymentStatus.FAILED,
                        commitHash: 'e5f6g7h',
                        commitMessage: 'fix: payment gateway bug',
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
                    },
                    {
                        status: DeploymentStatus.STOPPED,
                        commitHash: 'i9j0k1l',
                        commitMessage: 'init: project setup',
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                    }
                ]
            }
        }
    });

    // 4. Create "Personal Blog" Project (Currently Building)
    const blog = await prisma.project.create({
        data: {
            name: 'personal-blog-nextjs',
            gitRepository: 'https://github.com/demo/blog',
            branch: 'master',
            userId: user.id,
            deployments: {
                create: [
                    {
                        status: DeploymentStatus.BUILDING,
                        commitHash: 'm2n3o4p',
                        commitMessage: 'content: add new post',
                        createdAt: new Date(), // Just now
                    },
                    {
                        status: DeploymentStatus.RUNNING,
                        commitHash: 'q5r6s7t',
                        commitMessage: 'style: update dark mode',
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
                    }
                ]
            }
        }
    });

    console.log('✅ Demo data seeded!');
    console.log(`User ID: ${user.id}`);
    console.log(`Projects created: ${ecommerce.name}, ${blog.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
