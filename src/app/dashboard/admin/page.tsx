"use client";

import { 
    LayoutDashboard, 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    Wallet, 
    ArrowUpRight,
    MoreHorizontal
} from 'lucide-react';

// --- Mock Data (Sesuai kode awalmu) ---
const mockKPIs = {
    totalProjects: 24,
    activeProjects: 8,
    completedProjects: 16,
    totalRevenue: 450000000, // Disimpan dalam number biar gampang di-format
};

const mockRecentProjects = [
    {
        id: '1',
        name: 'Renovasi Villa Bali',
        clientName: 'John Doe',
        status: 'in-progress',
        serviceType: 'Renovasi',
        date: '01 Des 2024',
        budget: 150000000,
    },
    {
        id: '2',
        name: 'Interior Design Office',
        clientName: 'Jane Smith',
        status: 'pending',
        serviceType: 'Interior',
        date: '05 Des 2024',
        budget: 75000000,
    },
    {
        id: '3',
        name: 'Arsitektur Rumah Modern',
        clientName: 'Ahmad Yani',
        status: 'completed',
        serviceType: 'Arsitektur',
        date: '20 Nov 2024',
        budget: 225000000,
    },
    {
        id: '4',
        name: 'Kitchen Set Minimalis',
        clientName: 'Sarah W.',
        status: 'completed',
        serviceType: 'Interior',
        date: '15 Nov 2024',
        budget: 45000000,
    },
];

const mockActiveServices = [
    { name: 'Interior Design', status: 'Available' },
    { name: 'Arsitektur', status: 'Available' },
    { name: 'Renovasi', status: 'Available' },
    { name: 'Konsultasi', status: 'Busy' },
];

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-700 border-green-200';
        case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'completed': return 'Selesai';
        case 'in-progress': return 'Berjalan';
        case 'pending': return 'Menunggu';
        default: return status;
    }
};

// --- Main Component ---
export default function AdminOverviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
                <span className="text-sm text-gray-500">Update terakhir: {new Date().toLocaleDateString('id-ID')}</span>
            </div>

            {/* --- 1. KPI Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Projects */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Proyek</p>
                        <h3 className="text-2xl font-bold text-gray-900">{mockKPIs.totalProjects}</h3>
                        <p className="text-xs text-green-600 flex items-center mt-2">
                            <ArrowUpRight size={12} className="mr-1" /> +2 bulan ini
                        </p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Briefcase className="text-indigo-600" size={24} />
                    </div>
                </div>

                {/* Active Projects */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Proyek Aktif</p>
                        <h3 className="text-2xl font-bold text-gray-900">{mockKPIs.activeProjects}</h3>
                        <p className="text-xs text-blue-600 mt-2">Sedang dikerjakan</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Clock className="text-blue-600" size={24} />
                    </div>
                </div>

                {/* Completed Projects */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Selesai</p>
                        <h3 className="text-2xl font-bold text-gray-900">{mockKPIs.completedProjects}</h3>
                        <p className="text-xs text-green-600 mt-2">Semua waktu</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="text-green-600" size={24} />
                    </div>
                </div>

                {/* Revenue */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-xl font-bold text-gray-900 truncate" title={formatCurrency(mockKPIs.totalRevenue)}>
                            {formatCurrency(mockKPIs.totalRevenue)}
                        </h3>
                        <p className="text-xs text-green-600 flex items-center mt-2">
                            <ArrowUpRight size={12} className="mr-1" /> +12% dari target
                        </p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <Wallet className="text-emerald-600" size={24} />
                    </div>
                </div>
            </div>

            {/* --- 2. Main Content Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Recent Projects Table (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Proyek Terbaru</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Lihat Semua</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Nama Proyek</th>
                                    <th className="px-6 py-3 font-medium">Klien</th>
                                    <th className="px-6 py-3 font-medium">Nilai</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mockRecentProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{project.name}</div>
                                            <div className="text-xs text-gray-500">{project.serviceType}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{project.clientName}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {formatCurrency(project.budget)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Active Services / Quick Stats (1/3 width) */}
                <div className="space-y-6">
                    {/* Active Services Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Layanan Aktif</h3>
                        <div className="space-y-3">
                            {mockActiveServices.map((service, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="font-medium text-gray-700">{service.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        service.status === 'Available' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {service.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                            Kelola Layanan
                        </button>
                    </div>

                    {/* Mini Quick Action / Tips */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                        <p className="text-blue-100 text-sm mb-4">
                            Cek dokumentasi admin atau hubungi developer jika ada error pada sistem.
                        </p>
                        <button className="px-4 py-2 bg-white text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">
                            Lihat Dokumentasi
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}