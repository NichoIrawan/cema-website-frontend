import { Schedule } from '@/lib/types';
import { Video, MapPin, FileText, Calendar, ChevronRight } from 'lucide-react';

interface UpcomingListProps {
    schedules: Schedule[];
}

export function UpcomingList({ schedules }: UpcomingListProps) {
    // 1. Sort by date ascending
    const sorted = [...schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Grouping Logic
    const groups: { [key: string]: Schedule[] } = {
        'Minggu Ini': [],
        'Bulan Ini': [],
        'Mendatang': []
    };

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); 
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    // Reset now for comparisson
    const today = new Date();

    sorted.forEach(item => {
        const d = new Date(item.date);
        
        // Skip past events? typically "Upcoming" list implies future. 
        // But for safe measure let's include all pending/scheduled ones or today onwards.
        // Assuming the parent component passes appropriate list, or we filter here.
        if (d < new Date(new Date().setHours(0,0,0,0))) return; 

        const isThisWeek = d >= today && d <= endOfWeek;
        const isThisMonth = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

        if (isThisWeek) {
            groups['Minggu Ini'].push(item);
        } else if (isThisMonth) {
            groups['Bulan Ini'].push(item);
        } else {
            groups['Mendatang'].push(item);
        }
    });

    // Remove empty groups
    const activeGroups = Object.entries(groups).filter(([_, items]) => items.length > 0);

    return (
        <div className="space-y-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Jadwal Lainnya
            </h3>

            {activeGroups.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Tidak ada jadwal mendatang lainnya.</p>
                </div>
            ) : (
                activeGroups.map(([label, items]) => (
                    <div key={label}>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{label}</h4>
                        <div className="space-y-3">
                            {items.map(item => (
                                <UpcomingItem key={item.id} schedule={item} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function UpcomingItem({ schedule }: { schedule: Schedule }) {
    const dateObj = new Date(schedule.date);
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
    const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });

    // Icon Selection
    let Icon = FileText;
    let iconBg = "bg-gray-100 text-gray-600";
    
    if (schedule.isOnline) {
        Icon = Video;
        iconBg = "bg-blue-50 text-blue-600";
    } else if (schedule.location) {
        Icon = MapPin;
        iconBg = "bg-orange-50 text-orange-600";
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#8CC540]/30 transition-all duration-200 group flex items-center gap-4 cursor-default">
            {/* Date Badge */}
            <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-gray-100 pr-4">
                <span className="text-xs font-medium text-gray-400">{dayName.split(',')[0]}</span>
                <span className="text-lg font-bold text-gray-800">{dateObj.getDate()}</span>
            </div>

            {/* Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-gray-900 truncate group-hover:text-[#8CC540] transition-colors">{schedule.event}</h5>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{schedule.time} WIB</span>
                    <span>•</span>
                    <span className="truncate">
                        {schedule.isOnline ? 'Online Meeting' : (schedule.location?.address || 'Tatap Muka')}
                    </span>
                </div>
            </div>

            <div className="text-gray-300">
                <ChevronRight size={20} />
            </div>
        </div>
    );
}
