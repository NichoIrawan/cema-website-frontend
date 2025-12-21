"use client";

import { useState, useEffect } from "react";
import type { Portfolio } from "@/lib/types";
import { portfolioService } from "@/services/portfolioService";
import {
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE KUSTOM UNTUK POP-UP & TOAST ---
  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    id: "",
    displayName: "",
    category: "Residential",
    description: "",
    endDate: new Date().toISOString().split("T")[0],
    isShown: false,
    photoUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Helper Toast
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(null), 3000); // Hilang dalam 3 detik
  };

  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return "https://placehold.co/600x400?text=No+Image";
    if (photoUrl.startsWith("data:")) return photoUrl;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${API_URL}/uploads/${photoUrl}`;
  };

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioService.getAllPortfolios();
      setPortfolios(data);
    } catch (err: any) {
      setError("Gagal memuat data portfolio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar (Max 2MB)"); // Bisa diganti toast error jika mau
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      displayName: "",
      category: "Residential",
      description: "",
      endDate: new Date().toISOString().split("T")[0],
      isShown: false,
      photoUrl: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!formData.displayName || !formData.description || !formData.category) {
      return alert("Mohon isi semua field wajib");
    }

    try {
      setIsSubmitting(true);
      const dataToSend = new FormData();
      dataToSend.append("displayName", formData.displayName);
      dataToSend.append("category", formData.category);
      dataToSend.append("description", formData.description);
      dataToSend.append("endDate", formData.endDate);
      dataToSend.append("isShown", String(formData.isShown));

      if (selectedFile) dataToSend.append("photo", selectedFile);

      if (isEditing) {
        await portfolioService.updatePortfolio(formData.id, dataToSend);
        showToast("Portfolio berhasil diperbarui! ✨");
      } else {
        await portfolioService.createPortfolio(dataToSend);
        showToast("Portfolio baru berhasil ditambahkan! 🚀");
      }

      await fetchPortfolios();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Portfolio",
      message:
        "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: async () => {
        try {
          await portfolioService.deletePortfolio(id);
          setPortfolios(portfolios.filter((p) => p.id !== id));
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          showToast("Portfolio berhasil dihapus 🗑️");
        } catch (err) {
          alert("Gagal menghapus");
        }
      },
    });
  };

  const toggleHomepage = async (portfolio: Portfolio) => {
    try {
      const updated = await portfolioService.updatePortfolio(portfolio.id, {
        ...portfolio,
        isShown: !portfolio.isShown,
      });
      setPortfolios(
        portfolios.map((p) => (p.id === portfolio.id ? updated : p))
      );
      showToast(
        `Status berhasil diubah ke ${
          !portfolio.isShown ? "Tampil" : "Tersembunyi"
        }`
      );
    } catch (err) {
      alert("Gagal mengupdate status");
    }
  };

  const openEditModal = (portfolio: Portfolio) => {
    setFormData({
      id: portfolio.id,
      displayName: portfolio.displayName,
      category: portfolio.category,
      description: portfolio.description,
      endDate: new Date(portfolio.endDate).toISOString().split("T")[0],
      isShown: portfolio.isShown,
      photoUrl: portfolio.photoUrl,
    });
    setPreviewUrl(getImageUrl(portfolio.photoUrl));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* --- TOAST NOTIFICATION --- */}
      {toast?.visible && (
        <div className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce-short">
          <CheckCircle className="text-green-400" size={20} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h3 className="font-bold text-lg text-black">Kelola Portfolio</h3>
          <p className="text-sm text-black opacity-70">
            {portfolios.filter((p) => p.isShown).length} Tampil di Homepage
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all active:scale-95 font-bold"
        >
          <Plus size={16} /> Tambah Portfolio
        </button>
      </div>

      {/* Grid Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="relative h-52 bg-gray-100">
              <img
                src={getImageUrl(item.photoUrl)}
                alt={item.displayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 bg-white rounded-full text-blue-600 shadow-lg"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white rounded-full text-red-600 shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-black truncate mb-2">
                {item.displayName}
              </h4>
              <p className="text-sm text-black opacity-80 line-clamp-2 h-10 mb-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  onClick={() => toggleHomepage(item)}
                  className={`text-xs flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full ${
                    item.isShown
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {item.isShown ? <Eye size={14} /> : <EyeOff size={14} />}{" "}
                  {item.isShown ? "Visible" : "Hidden"}
                </button>
                <span className="text-xs text-black font-bold">
                  {item.endDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FORM (EXISTING) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-5 text-black border-b pb-2">
              {isEditing ? "Update Portfolio" : "Create New Project"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Judul Project
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Kategori
                </label>
                <select
                  className="w-full p-2.5 border rounded-lg text-black font-medium outline-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Interior">Interior</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full p-2.5 border rounded-lg text-black outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="p-2.5 border rounded-lg text-black font-bold outline-none"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
                <label className="flex items-center gap-2 p-2.5 cursor-pointer bg-gray-50 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isShown}
                    onChange={(e) =>
                      setFormData({ ...formData, isShown: e.target.checked })
                    }
                  />
                  <span className="text-xs font-bold text-black">
                    Show on Home
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Foto Project
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-xs text-black"
                  onChange={handleImageUpload}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    className="mt-3 h-32 w-full object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-red-500"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg disabled:bg-blue-400 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Update Project" : "Simpan Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CONFIRMATION POP-UP --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-black font-bold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-4 py-3 bg-red-600 rounded-xl text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
