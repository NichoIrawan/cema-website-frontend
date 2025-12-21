// ============================================
// Project Dashboard - Shared Types
// ============================================

export type ViewState = 'LIST' | 'LOADING' | 'DETAIL';
export type ProjectStatus = 'on-track' | 'attention' | 'new' | 'completed';
export type WorkPhase = 'LEAD' | 'DESIGN' | 'RAB' | 'CONSTRUCTION' | 'FINISHING' | 'HANDOVER';

export interface ProjectManager {
    name: string;
    role: string;
    avatar: string;
    phone: string;
}

export interface Project {
    id: number;
    title: string;
    location: string;
    status: ProjectStatus;
    workPhase: WorkPhase;
    progress: number;
    lastUpdate: string;
    image: string;
    statusLabel: string;
    description?: string;
    startDate: string;
    targetDate: string;
    pm: ProjectManager;
}
