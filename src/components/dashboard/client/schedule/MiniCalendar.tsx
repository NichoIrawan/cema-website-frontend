'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarProps {
    activeDates: string[]; // ISO Date strings YYYY-MM-DD
}

export function MiniCalendar({ activeDates }: MiniCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

    // Generate Calendar Grid
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const isToday = (d: number) => {
        const today = new Date();
        return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const hasEvent = (d: number) => {
        // Construct ISO string YYYY-MM-DD for comparison
        // Note: activeDates are expected to be YYYY-MM-DD
        const checkDate = new Date(year, month, d);
        // Correctly offset timezone or just compare parts? 
        // Simplest: format checkDate to YYYY-MM-DD locally
        // But activeDates from DB are YYYY-MM-DD from API mapping (date part only).
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d).padStart(2, '0');
        const iso = `${y}-${m}-${dayStr}`;
        
        return activeDates.includes(iso);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 capitalize">{monthName}</h3>
                <div className="flex gap-1">
                    <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-2">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (
                    <span key={i} className="text-xs font-semibold text-gray-400">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
                {days.map((day, idx) => (
                    <div key={idx} className="relative flex flex-col items-center justify-center h-10 w-10">
                        {day ? (
                            <>
                                <span className={`
                                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                    ${isToday(day) 
                                        ? 'bg-[#8CC540] text-white shadow-md shadow-[#8CC540]/30' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                                `}>
                                    {day}
                                </span>
                                {hasEvent(day) && !isToday(day) && (
                                    <span className="w-1 h-1 rounded-full bg-[#8CC540] absolute bottom-1"></span>
                                )}
                            </>
                        ) : (
                            <span />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#8CC540]"></span>
                    <span className="text-xs text-gray-500 font-medium">Jadwal Aktif</span>
                </div>
                 <p className="text-xs text-gray-400 leading-snug">
                    Kalender ini hanya untuk referensi visual jadwal Anda.
                </p>
            </div>
        </div>
    );
}
