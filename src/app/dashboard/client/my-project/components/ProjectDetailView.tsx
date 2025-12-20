'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    MapPin, 
    ArrowLeft, 
    FileText, 
    Calendar, 
    MessageCircle, 
    LayoutGrid 
} from 'lucide-react';
import type { Project } from '../types';
import { BRAND, WORK_PHASE_LABELS, getStatusConfig } from '../constants';

interface ProjectDetailViewProps {
    project: Project;
    onBack: () => void;
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'files'>('overview');
    const statusConfig = getStatusConfig(project.status);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutGrid size={16} /> },
        { id: 'files', label: 'Files', icon: <FileText size={16} /> },
    ] as const;

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Halo ${project.pm.name}, saya ingin bertanya tentang proyek "${project.title}".`);
        window.open(`https://wa.me/${project.pm.phone}?text=${message}`, '_blank');
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Breadcrumb Back Link */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-[#8CC540] transition-colors mb-6 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Kembali ke Daftar Proyek</span>
            </button>

            {/* Header - Title + Badge inline */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{project.title}</h1>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.textClass} text-sm font-medium rounded-full`}>
                    {statusConfig.icon}
                    <span>{project.statusLabel}</span>
                </div>
            </div>
            
            {/* Location + Work Phase */}
            <div className="flex items-center gap-3 text-slate-500 mb-6">
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span 
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white"
                    style={{ backgroundColor: WORK_PHASE_LABELS[project.workPhase].color }}
                >
                    Tahap: {WORK_PHASE_LABELS[project.workPhase].label}
                </span>
            </div>

            {/* Hero Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-green-50 text-[#8CC540]'
                                : 'text-slate-600 hover:bg-gray-100'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            {/* Description Card */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-semibold text-slate-800 mb-3">Deskripsi Proyek</h3>
                                <p className="text-slate-600 leading-relaxed">{project.description}</p>
                            </div>

                            {/* Progress Card */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-semibold text-slate-800 mb-4">Progress Pekerjaan</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Keseluruhan</span>
                                        <span className="font-semibold text-slate-800">{project.progress}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%`, backgroundColor: BRAND.primary }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'files' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Dokumen Proyek</h3>
                            <div className="space-y-3">
                                {['RAB_Final.pdf', 'Gambar_Kerja.dwg', 'Kontrak.pdf', 'Timeline.xlsx'].map((file, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                        <FileText size={18} style={{ color: BRAND.primary }} />
                                        <span className="text-slate-700">{file}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Timeline Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar size={16} style={{ color: BRAND.primary }} />
                            Timeline
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Mulai</span>
                                <span className="font-medium text-slate-800">{project.startDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Target Selesai</span>
                                <span className="font-medium text-slate-800">{project.targetDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Project Manager Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-semibold text-slate-800 mb-4">Project Manager</h3>
                        
                        {/* PM Profile */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
                                <Image
                                    src={project.pm.avatar}
                                    alt={project.pm.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{project.pm.name}</p>
                                <p className="text-sm text-slate-500">{project.pm.role}</p>
                            </div>
                        </div>

                        {/* WhatsApp Button */}
                        <button 
                            onClick={handleWhatsApp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-xl transition-all hover:shadow-md"
                            style={{ backgroundColor: BRAND.primary }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND.primaryHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND.primary}
                        >
                            <MessageCircle size={18} />
                            Chat via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
