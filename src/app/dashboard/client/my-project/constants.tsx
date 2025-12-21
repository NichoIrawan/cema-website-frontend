// ============================================
// Project Dashboard - Constants & Helpers
// ============================================

import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { ProjectStatus, WorkPhase } from './types';

// Brand Colors
export const BRAND = {
    primary: '#8CC540',
    primaryHover: '#76a536',
    primaryLight: '#f0f9e8',
    text: '#1e293b',
};

// Pagination
export const ITEMS_PER_PAGE = 9;
export const LOADING_DELAY = 800;

// Work Phase Labels & Colors
export const WORK_PHASE_LABELS: Record<WorkPhase, { label: string; color: string }> = {
    'LEAD': { label: 'Lead', color: '#6366f1' },
    'DESIGN': { label: 'Design', color: '#8b5cf6' },
    'RAB': { label: 'RAB', color: '#f59e0b' },
    'CONSTRUCTION': { label: 'Konstruksi', color: '#3b82f6' },
    'FINISHING': { label: 'Finishing', color: '#10b981' },
    'HANDOVER': { label: 'Serah Terima', color: '#6b7280' },
};

// Status Configuration
export const getStatusConfig = (status: ProjectStatus) => {
    const configs = {
        'on-track': { 
            bg: 'bg-green-50', 
            textClass: 'text-[#8CC540]',
            icon: <CheckCircle2 size={14} /> 
        },
        'attention': { 
            bg: 'bg-red-50', 
            textClass: 'text-red-600',
            icon: <AlertTriangle size={14} /> 
        },
        'new': { 
            bg: 'bg-violet-50', 
            textClass: 'text-violet-600',
            icon: <Sparkles size={14} /> 
        },
        'completed': { 
            bg: 'bg-gray-100', 
            textClass: 'text-gray-500',
            icon: <CheckCircle2 size={14} /> 
        },
    };
    return configs[status];
};
