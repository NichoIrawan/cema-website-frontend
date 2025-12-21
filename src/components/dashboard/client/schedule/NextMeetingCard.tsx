import { Schedule } from '@/lib/types';
import { Calendar, Clock, MapPin, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NextMeetingCardProps {
    schedule: Schedule;
}

export function NextMeetingCard({ schedule }: NextMeetingCardProps) {
    const dateObj = new Date(schedule.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('id-ID', { month: 'short' });
    const fullDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-white rounded-xl shadow-sm border-l-8 border-[#8CC540] overflow-hidden flex flex-col md:flex-row relative">
            {/* Background Pattern Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CC540]/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

            {/* Date Box */}
            <div className="p-6 md:pr-0 flex md:flex-col items-center justify-center md:items-start md:justify-start gap-4 md:gap-1 min-w-[100px]">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-[70px]">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{month}</span>
                    <span className="text-3xl font-extrabold text-gray-800">{day}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 pt-0 md:pt-6 flex-1 flex flex-col justify-center">
                <div className="mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#8CC540]/10 text-[#7ab32f]">
                        <Calendar size={12} />
                        Pertemuan Berikutnya
                    </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {schedule.event}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                        <Clock className="text-[#8CC540]" size={18} />
                        <span className="font-medium text-lg text-gray-900">{schedule.time} WIB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{fullDate}</span>
                    </div>
                </div>

                {/* Context & Action - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    {schedule.isOnline ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                           <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium flex-1 w-full sm:w-auto">
                                <Video size={18} />
                                Online Meeting
                           </div>
                           {schedule.link && (
                               <a 
                                   href={schedule.link}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center justify-center gap-2 bg-[#8CC540] hover:bg-[#7ab32f] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors w-full sm:w-auto shadow-sm hover:shadow-md"
                               >
                                   <Video size={18} />
                                   Join Google Meet
                               </a>
                           )}
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium flex-1 w-full sm:w-auto border border-gray-200">
                                <MapPin size={18} />
                                {schedule.location?.address || 'Lokasi belum ditentukan'}
                            </div>
                             <button className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#8CC540] text-[#8CC540] hover:bg-[#8CC540]/5 px-6 py-2.5 rounded-lg font-semibold transition-colors w-full sm:w-auto">
                                <MapPin size={18} />
                                Lihat Peta Lokasi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
