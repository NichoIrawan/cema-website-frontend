'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import type { Project } from '../types';
import { BRAND, WORK_PHASE_LABELS, getStatusConfig } from '../constants';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusConfig = getStatusConfig(project.status);
    const needsReview = project.status === 'attention';

    return (
        <Link 
            href={`/dashboard/client/my-project/${project.id}`}
            className="block"
        >
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 ${statusConfig.bg} ${statusConfig.textClass} text-xs font-medium rounded-full`}>
                        {statusConfig.icon}
                        <span>{project.statusLabel}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-slate-800 truncate mb-1 group-hover:text-[#8CC540] transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-2">
                        <MapPin size={14} />
                        <span className="truncate">{project.location}</span>
                    </div>

                    {/* Work Phase Badge */}
                    <div className="mb-3">
                        <span 
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md text-white"
                            style={{ backgroundColor: WORK_PHASE_LABELS[project.workPhase].color }}
                        >
                            {WORK_PHASE_LABELS[project.workPhase].label}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-medium text-slate-700">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${project.progress}%`,
                                    backgroundColor: project.status === 'attention' ? '#ef4444' : BRAND.primary
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {project.lastUpdate}
                        </span>

                        {needsReview && (
                            <span 
                                className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg"
                                style={{ backgroundColor: BRAND.primary }}
                            >
                                Review
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
