"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Search,
  Filter,
} from "lucide-react";

interface Project {
  _id: string;
  id: string;
  name: string;
  clientName: string;
  status: string;
  progress: number;
}

export default function AdminProjectPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statusOptions = [
    "ALL",
    "LEAD",
    "DESIGN",
    "CONSTRUCTION",
    "RETENTION",
    "COMPLETED",
    "CANCELLED",
  ];

  useEffect(() => {
    if (status === "loading") return;
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        const result = await res.json();
        if (result.status === "success") setProjects(result.data);
      } catch (error) {
        showAlert("Gagal load data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [API_URL, session, status]);

  const handleUpdate = async (projectId: string, payload: any) => {
    if (!projectId) return;

    setIsUpdating(projectId);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, ...payload } : p))
        );
        showAlert("Update Berhasil!", "success");
      } else {
        console.error("DEBUG BACKEND ERROR:", {
          status: res.status,
          response: result,
          projectIdSent: projectId,
        });
        showAlert(result.error || result.message || "Gagal update", "error");
      }
    } catch (error) {
      showAlert("Koneksi Error", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const showAlert = (message: string, type: any) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      {/* Toast Alert */}
      {alert.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg border ${
            alert.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">
            Project Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola dan pantau progress setiap proyek Cema Design
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Filter Status */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari project..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Info Proyek
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50/50 transition-colors text-gray-900"
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 text-base">
                      {project.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {project.clientName}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      className="border border-gray-300 rounded-md p-1.5 text-xs font-medium bg-white text-gray-700 focus:border-blue-500 outline-none cursor-pointer min-w-[120px]"
                      value={project.status ?? "LEAD"}
                      onChange={(e) =>
                        handleUpdate(project.id, { status: e.target.value })
                      }
                      disabled={isUpdating === project.id}
                    >
                      {statusOptions
                        .filter((s) => s !== "ALL")
                        .map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5 min-w-[150px]">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Pengerjaan</span>
                        <span className="text-blue-600 font-bold">
                          {project.progress ?? 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        value={project.progress ?? 0}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((p) =>
                              p.id === project.id
                                ? { ...p, progress: Number(e.target.value) }
                                : p
                            )
                          )
                        }
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleUpdate(project.id, {
                          progress: project.progress ?? 0,
                        })
                      }
                      disabled={isUpdating === project.id}
                      className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors shadow-sm active:scale-95"
                    >
                      {isUpdating === project.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="p-16 text-center text-gray-400 text-sm">
              Tidak ada data proyek yang ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
