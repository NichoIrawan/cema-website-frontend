/**
 * Project Detail Page
 * 
 * Route: /dashboard/client/my-project/[id]
 * Shows detailed information about a specific project
 */

import { notFound } from 'next/navigation';
import { allProjects } from '../data';
import { ProjectDetailClient } from './ProjectDetailClient';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { id } = await params;
    const projectId = parseInt(id);
    const project = allProjects.find(p => p.id === projectId);

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} />;
}

// Generate static params for all projects (optional - for better performance)
export function generateStaticParams() {
    return allProjects.map(project => ({
        id: project.id.toString(),
    }));
}
