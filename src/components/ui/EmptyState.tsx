'use client';

import { Search } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyState({ 
    title = 'Tidak ada data',
    description = 'Coba ubah filter atau kata kunci pencarian',
    icon
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {icon || <Search size={32} className="text-gray-300" />}
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}
