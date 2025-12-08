import { AdminTabsLayout } from '@/components/layout/admin-tabs';
import type { TabConfig } from '@/lib/types';
import type { Project } from '@/lib/types';

// Mock data for KPI cards
const mockKPIs = {
    totalProjects: 24,
    activeProjects: 8,
    completedProjects: 16,
    totalRevenue: 'Rp 450.000.000',
};

// Mock data for recent projects
const mockRecentProjects: Project[] = [
    {
        id: '1',
        name: 'Renovasi Villa Bali',
        clientName: 'John Doe',
        status: 'in-progress',
        serviceType: 'renovasi',
        createdAt: new Date('2024-12-01'),
    },
    {
        id: '2',
        name: 'Interior Design Office',
        clientName: 'Jane Smith',
        status: 'pending',
        serviceType: 'interior',
        createdAt: new Date('2024-12-05'),
    },
    {
        id: '3',
        name: 'Arsitektur Rumah Modern',
        clientName: 'Ahmad Yani',
        status: 'completed',
        serviceType: 'arsitek',
        createdAt: new Date('2024-11-20'),
    },
];

// Overview Tab Content
function OverviewTabContent() {
    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Total Projects</h3>
                    <p className="text-3xl font-bold text-gray-900">{mockKPIs.totalProjects}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Active Projects</h3>
                    <p className="text-3xl font-bold text-gray-900">{mockKPIs.activeProjects}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Completed</h3>
                    <p className="text-3xl font-bold text-gray-900">{mockKPIs.completedProjects}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">{mockKPIs.totalRevenue}</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
                    <div className="space-y-3">
                        {mockRecentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
                            >
                                <div>
                                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                                    <p className="text-sm text-gray-600">{project.clientName}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                                        project.status
                                    )}`}
                                >
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Services */}
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Active Services</h3>
                    <div className="space-y-3">
                        {['Interior Design', 'Arsitektur', 'Renovasi'].map((service) => (
                            <div
                                key={service}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded"
                            >
                                <span className="text-gray-900">{service}</span>
                                <span className="text-sm text-gray-600">Available</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const tabs: TabConfig[] = [
        {
            id: 'overview',
            label: 'Overview',
            content: <OverviewTabContent />,
        },
        {
            id: 'portfolio',
            label: 'Portfolio',
        },
        {
            id: 'layanan',
            label: 'Layanan',
        },
        {
            id: 'chat',
            label: 'Chat',
        },
        {
            id: 'proyek',
            label: 'Semua Proyek',
        },
        {
            id: 'users',
            label: 'User Management',
        },
        {
            id: 'calculator',
            label: 'Kalkulator',
        },
        {
            id: 'quiz',
            label: 'Design Quiz',
        },
    ];

    return <AdminTabsLayout tabs={tabs} defaultTab="overview" />;
}
