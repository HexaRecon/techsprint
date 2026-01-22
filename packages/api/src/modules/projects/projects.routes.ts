import { Router, type Request, type Response } from 'express';
import { prisma } from '../../index.js';
import { authenticate, type AuthRequest } from '../../middleware/auth.middleware.js';
import { DeploymentStatus } from '@prisma/client';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    const { name, gitRepository, branch } = req.body;
    const userId = req.user!.id;

    try {
        const project = await prisma.project.create({
            data: {
                name,
                gitRepository,
                branch: branch || 'main',
                userId,
            },
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const projects = await prisma.project.findMany({
        where: { userId },
        include: { deployments: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    res.json(projects);
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
        where: { id, userId },
        include: { deployments: { take: 10, orderBy: { createdAt: 'desc' } } },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json(project);
});

router.get('/:id/deployments', async (req: Request, res: Response) => {
    const { id } = req.params;
    const deployments = await prisma.deployment.findMany({
        where: { projectId: id },
        orderBy: { createdAt: 'desc' }
    });
    res.json(deployments);
});


// Mock Endpoint for "AI Generation" Demo
router.post('/ai/generate', authenticate, async (req: AuthRequest, res: Response) => {
    const { prompt } = req.body;
    const userId = req.user!.id;

    const names = ['fancy-portfolio', 'e-commerce-shop', 'saas-landing-page', 'blog-platform'];
    const name = `${names[Math.floor(Math.random() * names.length)]}-${Math.floor(Math.random() * 1000)}`;

    try {
        const project = await prisma.project.create({
            data: {
                name,
                gitRepository: 'https://github.com/demo/ai-generated',
                branch: 'main',
                userId,
                deployments: {
                    create: {
                        status: DeploymentStatus.RUNNING,
                        commitHash: 'ai-gen-123',
                        commitMessage: `AI Generated: ${prompt.substring(0, 30)}...`,
                        imageTag: 'registry:5000/demo-app:latest'
                    }
                }
            },
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate project' });
    }
});


export default router;
