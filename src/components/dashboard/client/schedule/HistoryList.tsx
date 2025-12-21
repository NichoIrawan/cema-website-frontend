'use client';

import { useState } from 'react';
import { Schedule } from '@/lib/types';
import { ChevronDown, ChevronUp, History, Video, MapPin, FileText } from 'lucide-react';

interface HistoryListProps {
    schedules: Schedule[];
}

export function HistoryList({ schedules }: HistoryListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    if (schedules.length === 0) return null;

    // Sort descending for history (newest past item first)
    const sortedHistory = [...schedules].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Pagination Logic: Show first 5, or all if showAll is true
    const VISIBLE_COUNT = 5;
    const displayedHistory = showAll ? sortedHistory : sortedHistory.slice(0, VISIBLE_COUNT);
    const hasMore = sortedHistory.length > VISIBLE_COUNT;

    return (
        <div className="mt-12 border-t-2 border-dashed border-gray-200 pt-8">
             <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
                >
                    <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-gray-200 transition-colors">
                        <History size={16} />
                    </div>
                    <span>Riwayat Pertemuan ({schedules.length})</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {isOpen && (
                <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {displayedHistory.map(item => (
                        <HistoryItem key={item.id} schedule={item} />
                    ))}

                    {hasMore && (
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline mt-2 flex items-center gap-1 ml-1"
                        >
                            {showAll ? "Tampilkan Lebih Sedikit" : `Tampilkan Semua Riwayat (${schedules.length - VISIBLE_COUNT} lagi)`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function HistoryItem({ schedule }: { schedule: Schedule }) {
    const dateObj = new Date(schedule.date);
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Icon Selection - Grayscale
    let Icon = FileText;
    
    if (schedule.isOnline) {
        Icon = Video;
    } else if (schedule.location) {
        Icon = MapPin;
    }

    const isCancelled = schedule.status === 'cancelled';

    return (
        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center gap-4 opacity-75 hover:opacity-100 transition-opacity">
            {/* Grayscale Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-400 grayscale">
                <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h5 className={`font-semibold text-gray-700 truncate ${isCancelled ? 'line-through decoration-red-300 text-gray-400' : ''}`}>
                        {schedule.event}
                    </h5>
                    
                    {/* Status Badges */}
                    {isCancelled && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded">
                            Dibatalkan
                        </span>
                    )}
                    {schedule.status === 'done' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                            Selesai
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span>{schedule.time} WIB</span>
                </div>
            </div>
        </div>
    );
}
