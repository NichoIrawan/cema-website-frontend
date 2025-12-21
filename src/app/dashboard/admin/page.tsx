"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowUpRight,
  MoreHorizontal,
  X,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";
// Import action BFF kamu
import { fetchDashboardOverviewAction } from "@/app/actions/overview";

// --- Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Selesai";
    case "in-progress":
      return "Berjalan";
    case "pending":
      return "Menunggu";
    default:
      return status;
  }
};

export default function AdminOverviewPage() {
  const router = useRouter(); // Inisialisasi router

  // --- State Management ---
  const [data, setData] = useState<{ projects: any[]; services: any[] }>({
    projects: [],
    services: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // --- BFF Fetching Logic ---
  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      const response = await fetchDashboardOverviewAction();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Gagal memuat data");
      }
      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  // --- Dynamic KPI Calculations ---
  const totalRevenue = data.projects.reduce(
    (acc, p) => acc + (p.budget || 0),
    0
  );
  const activeProjects = data.projects.filter(
    (p) => p.status === "in-progress"
  ).length;
  const completedProjects = data.projects.filter(
    (p) => p.status === "completed"
  ).length;

  // --- Hardcoded Dokumentasi ---
  const docFeatures = [
    {
      title: "Overview",
      desc: "Ringkasan statistik utama dan performa bisnis.",
      steps: ["..."],
    },
    { title: "Portfolio", desc: "Kelola showcase proyek.", steps: ["..."] },
    { title: "Layanan", desc: "Atur daftar jasa dan harga.", steps: ["..."] },
    { title: "Chat Client", desc: "Balas pesan real-time.", steps: ["..."] },
    { title: "Semua Proyek", desc: "Manajemen status proyek.", steps: ["..."] },
    {
      title: "User Management",
      desc: "Kelola akses admin/staff.",
      steps: ["..."],
    },
    { title: "Kalkulator", desc: "Set gambaran harga cepat.", steps: ["..."] },
  ];

  const handleCloseModal = () => {
    setIsDocOpen(false);
    setTimeout(() => setSelectedFeature(null), 300);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="animate-pulse">Sinkronisasi data dengan server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
        <span className="text-sm text-gray-500">
          Update terakhir: {new Date().toLocaleDateString("id-ID")}
        </span>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Proyek
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.projects.length}
            </h3>
          </div>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Briefcase className="text-indigo-600" size={24} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Proyek Aktif
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {activeProjects}
            </h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Selesai</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {completedProjects}
            </h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Revenue</p>
            <h3 className="text-xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </h3>
          </div>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Wallet className="text-emerald-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- TABLE PROYEK (DIUBAH KE PERSENTASE) --- */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Proyek Terbaru</h3>
            <button
              onClick={() => router.push("/dashboard/admin/projects")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Nama Proyek</th>
                  <th className="px-6 py-3 font-medium">Progres</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.projects.slice(0, 5).map((project) => {
                  // Fallback progres jika API belum mengirimkan field progress
                  const progressValue =
                    project.progress ||
                    (project.status === "completed"
                      ? 100
                      : project.status === "in-progress"
                      ? 45
                      : 0);

                  return (
                    <tr
                      key={project._id || project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.serviceType || "Layanan"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${progressValue}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600">
                            {progressValue}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- LAYANAN AKTIF --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Layanan Aktif</h3>
            <div className="space-y-3">
              {data.services.map((service, index) => (
                <div
                  key={service._id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    {service.name || service.title}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
            {/* Navigasi ke halaman layanan */}
            <button
              onClick={() => router.push("/dashboard/admin/service")}
              className="w-full mt-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Kelola Layanan
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Cek dokumentasi admin atau hubungi developer.
            </p>
            <button
              onClick={() => setIsDocOpen(true)}
              className="px-4 py-2 bg-white text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              Lihat Dokumentasi
            </button>
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL (Tetap Hardcode sesuai permintaan) --- */}
      {isDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
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
                  {selectedFeature
                    ? selectedFeature.title
                    : "Dokumentasi Fitur Admin"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              {selectedFeature ? (
                <div className="p-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                    <p className="text-blue-800 text-sm font-medium">
                      {selectedFeature.desc}
                    </p>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4">
                    Langkah-langkah:
                  </h4>
                  <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                    {selectedFeature.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="ml-6">
                        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-4 ring-white">
                          <span className="text-blue-600 text-xs font-bold">
                            {idx + 1}
                          </span>
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="grid divide-y divide-gray-100">
                  {docFeatures.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedFeature(item)}
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
              {selectedFeature && (
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm mr-2 transition-colors"
                >
                  Kembali ke Menu
                </button>
              )}
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
