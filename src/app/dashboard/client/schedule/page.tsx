export default function SchedulePage() {
    const scheduleItems = [
        { date: 'Dec 15, 2024', time: '10:00 AM', event: 'Site Visit' },
        { date: 'Dec 20, 2024', time: '2:00 PM', event: 'Design Review' },
        { date: 'Dec 28, 2024', time: '11:00 AM', event: 'Progress Meeting' },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Schedule</h2>
            <div className="space-y-3">
                {scheduleItems.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{item.event}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.date} at {item.time}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                Scheduled
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
