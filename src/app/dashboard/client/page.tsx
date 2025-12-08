import { ClientTabsLayout } from '@/components/layout/client-tabs';
import type { TabConfig } from '@/lib/types';

// My Project Tab Content
function MyProjectTabContent() {
    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Project</h2>
            <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Renovasi Villa Bali</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                In Progress
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Service Type:</span>
                            <span className="text-gray-900">Renovasi</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="text-gray-900">Dec 1, 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Progress:</span>
                            <span className="text-gray-900">45%</span>
                        </div>
                    </div>
                </div>
                <div className="p-10 border-2 border-dashed border-gray-300 rounded text-center text-gray-500">
                    Additional project details will appear here
                </div>
            </div>
        </div>
    );
}

// Schedule Tab Content
function ScheduleTabContent() {
    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Schedule</h2>
            <div className="space-y-3">
                {[
                    { date: 'Dec 15, 2024', time: '10:00 AM', event: 'Site Visit' },
                    { date: 'Dec 20, 2024', time: '2:00 PM', event: 'Design Review' },
                    { date: 'Dec 28, 2024', time: '11:00 AM', event: 'Progress Meeting' },
                ].map((item, idx) => (
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

// Chat Tab Content (placeholder)
function ChatTabContent() {
    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Chat with Team</h2>
            <div className="p-10 border-2 border-dashed border-gray-300 rounded text-center text-gray-500">
                Chat interface will appear here
            </div>
        </div>
    );
}

export default function ClientDashboardPage() {
    const tabs: TabConfig[] = [
        {
            id: 'my-project',
            label: 'My Project',
            content: <MyProjectTabContent />,
        },
        {
            id: 'schedule',
            label: 'Schedule',
            content: <ScheduleTabContent />,
        },
        {
            id: 'chat',
            label: 'Chat',
            content: <ChatTabContent />,
        },
    ];

    return <ClientTabsLayout tabs={tabs} defaultTab="my-project" userName="John Doe" />;
}
