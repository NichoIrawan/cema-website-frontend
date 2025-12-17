"use client";

import { useState } from 'react';
import { 
    LayoutDashboard, 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    Wallet, 
    ArrowUpRight,
    MoreHorizontal,
    X,          // Icon Close
    BookOpen,   // Icon Buku
    ArrowLeft   // [BARU] Icon Kembali
} from 'lucide-react';

// --- Mock Data (Sesuai kode awalmu) ---
const mockKPIs = {
    totalProjects: 24,
    activeProjects: 8,
    completedProjects: 16,
    totalRevenue: 450000000, 
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
    // State untuk mengontrol Pop-up
    const [isDocOpen, setIsDocOpen] = useState(false);
    
    // [BARU] State untuk menyimpan fitur mana yang sedang dilihat detailnya
    // null = List Menu, Object = Detail View
    const [selectedFeature, setSelectedFeature] = useState<any>(null); 

    // [BARU] Data Dokumentasi dengan 'steps'
    const docFeatures = [
        { 
            title: "Overview", 
            desc: "Ringkasan statistik utama dan performa bisnis.",
            steps: [
                "Halaman ini muncul pertama kali saat login.",
                "Lihat kartu KPI di atas untuk performa cepat (Revenue, Project count).",
                "Tabel 'Proyek Terbaru' menampilkan 5 update terakhir.",
                "Klik tombol 'Lihat Semua' untuk data lengkap."
            ]
        },
        { 
            title: "Portfolio", 
            desc: "Kelola showcase proyek untuk halaman depan website.",
            steps: [
                "Masuk ke menu Portfolio dari sidebar.",
                "Klik tombol 'Tambah Portfolio Baru' di pojok kanan atas.",
                "Upload foto proyek (Min. resolusi 1920x1080).",
                "Isi Deskripsi, Nama Klien, dan Tahun.",
                "Klik 'Publish' untuk menayangkan di website utama."
            ]
        },
        { 
            title: "Layanan", 
            desc: "Atur daftar jasa (Interior, Arsitektur) dan harga.",
            steps: [
                "Buka menu Layanan.",
                "Klik icon 'Edit' (pensil) pada layanan yang ingin diubah.",
                "Update harga estimasi per meter persegi.",
                "Ubah status menjadi 'Busy' jika slot penuh.",
                "Simpan perubahan."
            ]
        },
        { 
            title: "Chat Client", 
            desc: "Balas pesan dari calon klien secara real-time.",
            steps: [
                "Notifikasi pesan baru akan muncul di lonceng.",
                "Buka menu Chat Client.",
                "Pilih percakapan dari list di kiri.",
                "Ketik balasan dan tekan Enter."
            ]
        },
        { 
            title: "Semua Proyek", 
            desc: "Manajemen status proyek (Progress, Pending, Selesai).",
            steps: [
                "Lihat daftar seluruh proyek yang pernah masuk.",
                "Gunakan filter status untuk menyortir.",
                "Klik detail proyek untuk mengubah status pengerjaan."
            ]
        },
        { 
            title: "User Management", 
            desc: "Tambah atau hapus akses admin/staff lain.",
            steps: [
                "Hanya Super Admin yang bisa mengakses menu ini.",
                "Klik 'Invite User' dan masukkan email staff.",
                "Pilih role: Editor, Viewer, atau Admin.",
                "Link undangan akan dikirim ke email."
            ]
        },
        { 
            title: "Kalkulator", 
            desc: "Set gambaran harga cepat untuk klien.",
            steps: [
                "Masukkan luas ruangan (m2).",
                "masukkan perhitungan yang diinginkan",
                "Sistem akan mengkalkulasi estimasi biaya.",
                "Perhitungan akan tertambah di menu landingpage."
            ]
        },
    ];

    // Fungsi Reset saat menutup modal
    const handleCloseModal = () => {
        setIsDocOpen(false);
        setTimeout(() => setSelectedFeature(null), 300); 
    };

    return (
        <div className="space-y-6 relative"> 
            
            {/* --- DASHBOARD HEADER --- */}
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
                        {/* Tombol Trigger Modal */}
                        <button 
                            onClick={() => setIsDocOpen(true)}
                            className="px-4 py-2 bg-white text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                        >
                            Lihat Dokumentasi
                        </button>
                    </div>
                </div>
            </div>

            {/* --- POPUP MODAL --- */}
            {isDocOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>

                    {/* Konten Modal */}
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        
                        {/* HEADER MODAL */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-2 text-blue-700">
                                
                                {selectedFeature ? (
                                    <button 
                                        onClick={() => setSelectedFeature(null)}
                                        className="mr-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                ) : (
                                    <BookOpen size={20} />
                                )}
                                
                                <h2 className="text-lg font-bold">
                                    {selectedFeature ? selectedFeature.title : "Dokumentasi Fitur Admin"}
                                </h2>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* BODY MODAL (Dynamic Content) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            
                            {selectedFeature ? (
                                // --- TAMPILAN DETAIL (TUTORIAL) ---
                                <div className="p-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                                        <p className="text-blue-800 text-sm font-medium">
                                            {selectedFeature.desc}
                                        </p>
                                    </div>
                                    
                                    <h4 className="font-bold text-gray-800 mb-4">Langkah-langkah:</h4>
                                    <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                                        {selectedFeature.steps?.map((step: string, idx: number) => (
                                            <li key={idx} className="ml-6">
                                                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                                                    <span className="text-blue-600 text-xs font-bold">{idx + 1}</span>
                                                </span>
                                                <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ) : (
                                // --- TAMPILAN LIST MENU (SEPERTI SEBELUMNYA) ---
                                <div className="grid divide-y divide-gray-100">
                                    {docFeatures.map((item, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => setSelectedFeature(item)} // KLIK DISINI
                                            className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-600 text-sm ml-4">
                                                    {item.desc}
                                                </p>
                                            </div>
                                           
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                                <ArrowLeft size={16} className="rotate-180" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                       
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            {selectedFeature ? (
                                <button 
                                    onClick={() => setSelectedFeature(null)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm mr-2 transition-colors"
                                >
                                    Kembali ke Menu
                                </button>
                            ) : null}
                            <button 
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors"
                            >
                                Tutup
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}