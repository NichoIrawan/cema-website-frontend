"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Trash2,
  UserCog,
  Loader2,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";

type Role = "client" | "admin" | "project_manager" | "staff";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  profilePicture?: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --- STATE UNTUK NOTIFIKASI & MODAL ---
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({
    isOpen: false,
    userId: null,
  });

  // Fungsi memicu Toast
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    };
  }, [session?.accessToken]);

  const fetchUsers = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server Error: Bukan JSON");
      }
      const data = await res.json();
      if (res.ok) setUsers(data.data || data);
    } catch (error) {
      showToast("Gagal memuat data user", "error");
    } finally {
      setLoading(false);
    }
  }, [API_URL, getHeaders, status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async (id: string, newRole: Role) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        showToast("Role berhasil diperbarui!");
      } else {
        showToast("Gagal memperbarui role", "error");
      }
    } catch (error) {
      showToast("Kesalahan koneksi", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const executeDelete = async () => {
    const id = confirmModal.userId;
    if (!id) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        showToast("User berhasil dihapus");
      } else {
        showToast("Gagal menghapus user", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setConfirmModal({ isOpen: false, userId: null });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || (loading && users.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    // Menambahkan text-slate-900 untuk menimpa global abu-abu
    <div className="p-8 bg-gray-50 min-h-screen text-slate-900 antialiased font-sans">
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in slide-in-from-right fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border ${
              toast.type === "success"
                ? "bg-white border-green-200"
                : "bg-white border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
            <p className="text-sm font-bold text-slate-800">{toast.msg}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- CUSTOM CONFIRM MODAL --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Hapus Pengguna?
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Data user akan dihapus
                permanen dari sistem.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal({ isOpen: false, userId: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <UserCog className="text-blue-600" size={32} /> User Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola hak akses dan informasi tim Cema Design.
            </p>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-80 bg-white shadow-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-200">
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">
                    User Profile
                  </th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">
                    Role Access
                  </th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest">
                    Registration
                  </th>
                  <th className="p-5 font-bold text-slate-500 text-xs uppercase tracking-widest text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-inner overflow-hidden border-2 border-white ring-1 ring-gray-100">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              (user.name?.[0] || user.email[0]).toUpperCase()
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) =>
                          handleUpdateRole(user._id, e.target.value as Role)
                        }
                        className={`text-sm font-bold rounded-lg px-3 py-2 border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm ${
                          updatingId === user._id
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer hover:border-blue-300"
                        }`}
                      >
                        <option value="admin">ADMIN</option>
                        <option value="project_manager">PM</option>
                        <option value="staff">STAFF</option>
                        <option value="client">CLIENT</option>
                      </select>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-semibold text-slate-600 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() =>
                          setConfirmModal({ isOpen: true, userId: user._id })
                        }
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-20 text-center bg-gray-50/50">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <Search className="text-gray-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">
                Tidak ada user yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
