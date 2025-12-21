'use client';

import { Search, Plus, Filter } from 'lucide-react';
import { BRAND } from '../constants';

interface ToolbarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    statusFilter: 'all' | 'active' | 'completed';
    setStatusFilter: (filter: 'all' | 'active' | 'completed') => void;
    projectCount: number;
}

export function Toolbar({ 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    projectCount
}: ToolbarProps) {
    return (
        <div className="flex-none bg-white border-b border-gray-100 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari proyek..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8CC540]/50 focus:border-[#8CC540] transition-all"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            {(['all', 'active', 'completed'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                        statusFilter === filter 
                                            ? 'bg-white text-slate-800 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {filter === 'all' ? 'Semua' : filter === 'active' ? 'Aktif' : 'Selesai'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:ml-auto">
                        <span className="text-sm text-gray-500">{projectCount} proyek</span>
                        <button 
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
                            style={{ backgroundColor: BRAND.primary }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND.primaryHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND.primary}
                        >
                            <Plus size={18} />
                            <span>New Project</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
