import prisma from '../lib/prisma.js';
export const createProject = async (req, res) => {
    const { name, domain, googleServiceAccount } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }
    try {
        const project = await prisma.project.create({
            data: {
                name,
                domain,
                googleServiceAccount: googleServiceAccount ? JSON.stringify(googleServiceAccount) : null,
            },
        });
        res.status(201).json({
            message: 'Project created successfully',
            project,
        });
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};
export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                _count: {
                    select: { urls: true },
                },
            },
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
//# sourceMappingURL=projectController.js.map