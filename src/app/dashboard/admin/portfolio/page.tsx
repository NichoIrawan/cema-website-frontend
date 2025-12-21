"use client";

import { useState, useEffect } from "react";
import type { Portfolio } from "@/lib/types";
import {
  fetchPortfoliosAction,
  createPortfolioAction,
  updatePortfolioAction,
  updatePortfolioStatusAction,
  deletePortfolioAction,
} from "@/app/actions/portfolio-actions";
import { Trash2, Plus, Eye, EyeOff, Loader2, Pencil } from "lucide-react";

// Ambil Base URL dari Env (Pastikan di .env tidak diakhiri /api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simpan File asli untuk diupload
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

  // Helper untuk menangani URL gambar (Mencegah Error 431)
  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return "https://placehold.co/600x400?text=No+Image";

    // 1. Jika Base64 (data lama), tampilkan langsung
    if (photoUrl.startsWith("data:")) return photoUrl;

    // 2. Jika URL lengkap, gunakan langsung
    if (photoUrl.startsWith("http")) return photoUrl;

    // 3. PERBAIKAN: Buang '/api' dari ujung API_URL untuk akses folder /uploads
    // Ini akan mengubah ".../api" menjadi "..."
    const baseUrl = API_URL.replace(/\/api$/, "");

    return `${baseUrl}/uploads/${photoUrl}`;
  };

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const result = await fetchPortfoliosAction();

      if (result.success && result.data) {
        setPortfolios(result.data);
        setError(null);
      } else {
        setError(result.message || "Gagal memuat data portfolio.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal memuat data portfolio. Pastikan backend sudah jalan.");
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
      alert("File terlalu besar (Max 2MB)");
      return;
    }

    setSelectedFile(file);
    // Preview menggunakan URL temporary (lebih ringan dari Base64)
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
      return alert("Mohon isi semua field yang wajib");
    }

    try {
      setIsSubmitting(true);

      const dataToSend = new FormData();
      dataToSend.append("displayName", formData.displayName);
      dataToSend.append("category", formData.category);
      dataToSend.append("description", formData.description);
      dataToSend.append("endDate", formData.endDate);
      dataToSend.append("isShown", String(formData.isShown));

      // Append file dengan key 'photo' (sesuaikan dengan backend upload.single('photo'))
      if (selectedFile) {
        dataToSend.append("photo", selectedFile);
      }

      let result;
      if (isEditing) {
        result = await updatePortfolioAction(formData.id, dataToSend);
      } else {
        result = await createPortfolioAction(dataToSend);
      }

      if (result.success) {
        await fetchPortfolios();
        setIsModalOpen(false);
        resetForm();
      } else {
        alert(result.message || "Gagal menyimpan portfolio");
      }
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus portfolio ini?")) {
      try {
        const result = await deletePortfolioAction(id);
        if (result.success) {
          setPortfolios(portfolios.filter((p) => p.id !== id));
        } else {
          alert(result.message || "Gagal menghapus portfolio");
        }
      } catch (err) {
        alert("Gagal menghapus portfolio");
      }
    }
  };

  const toggleHomepage = async (portfolio: Portfolio) => {
    try {
      const payload = {
        ...portfolio,
        isShown: !portfolio.isShown,
      };

      // Use optimistic update
      const updated = { ...portfolio, isShown: !portfolio.isShown };
      setPortfolios(
        portfolios.map((p) => (p.id === portfolio.id ? updated : p))
      );

      const result = await updatePortfolioStatusAction(portfolio.id, payload);

      if (!result.success) {
        // Revert if failed
        setPortfolios(
          portfolios.map((p) => (p.id === portfolio.id ? portfolio : p))
        );
        alert(result.message || "Gagal mengupdate status");
      }
    } catch (err) {
      // Revert if failed
      setPortfolios(
        portfolios.map((p) => (p.id === portfolio.id ? portfolio : p))
      );
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

    // Gunakan helper URL untuk preview di modal
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
    <div className="space-y-6">
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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all active:scale-95"
        >
          <Plus size={16} /> Tambah Portfolio
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 font-bold">
          {error}
        </div>
      )}

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
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400?text=No+Image";
                }}
              />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 bg-white rounded-full hover:bg-blue-50 text-blue-600 shadow-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 shadow-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-black truncate pr-2">
                  {item.displayName}
                </h4>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-700 font-bold rounded">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-black line-clamp-2 mb-4 h-10">
                {item.description}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleHomepage(item)}
                  className={`text-xs flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full transition-colors ${item.isShown
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                >
                  {item.isShown ? <Eye size={14} /> : <EyeOff size={14} />}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="Contoh: Modern House Design"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Kategori
                </label>
                <select
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-bold"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 cursor-pointer bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">
                  Foto Project
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleImageUpload}
                />
                {previewUrl && (
                  <div className="mt-3 relative inline-block w-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-lg border-2 border-dashed border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-400 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Update Project" : "Simpan Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
