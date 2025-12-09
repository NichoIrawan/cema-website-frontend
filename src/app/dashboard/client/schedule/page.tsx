import type { Schedule } from '@/lib/types';

export default function SchedulePage() {
    // TODO: Fetch from API
    const scheduleItems: Schedule[] = [
        { id: '1', userId: '1', date: '2024-12-15', time: '10:00 AM', event: 'Site Visit', status: 'scheduled' },
        { id: '2', userId: '1', date: '2024-12-20', time: '2:00 PM', event: 'Design Review', status: 'scheduled' },
        { id: '3', userId: '1', date: '2024-12-28', time: '11:00 AM', event: 'Progress Meeting', status: 'scheduled' },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Schedule</h2>
            <div className="space-y-3">
                {scheduleItems.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{item.event}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.date} at {item.time}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium capitalize">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
