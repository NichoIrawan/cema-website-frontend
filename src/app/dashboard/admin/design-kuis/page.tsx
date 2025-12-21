"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  LayoutTemplate,
  HelpCircle,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// --- KONFIGURASI API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;


// --- TIPE DATA ---

interface DesignStyle {
  id: string;
  name: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  imageUrl: string;
  relatedStyle: string;
}

// Tipe untuk Notifikasi Pop-up
interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Tipe untuk Modal Konfirmasi Delete
interface ConfirmModalState {
  show: boolean;
  type: "style" | "question" | null; // Apa yang mau dihapus
  id: string | null; // ID yang mau dihapus
}

export default function DesignQuizAdmin() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Style (Local Storage)
  const [styles, setStyles] = useState<DesignStyle[]>([
    {
      id: "Minimalist",
      name: "Minimalist",
      description: "Gaya desain sederhana dan fungsional.",
    },
    {
      id: "Industrial",
      name: "Industrial",
      description: "Gaya ekspos material mentah.",
    },
  ]);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<"styles" | "questions">("styles");

  // State untuk Notifikasi (Toast)
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });

  // State untuk Modal Konfirmasi
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    show: false,
    type: null,
    id: null,
  });

  // Helper menampilkan notifikasi
  const showToast = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- LOAD DATA (GET) ---
  useEffect(() => {
    // Tunggu sampai status authentikasi selesai loading
    if (status === "loading") return;

    // Load Styles (Local)
    const savedStyles = localStorage.getItem("quizStyles");
    if (savedStyles) setStyles(JSON.parse(savedStyles));

    // Load Questions (API)
    const fetchQuestions = async () => {
      if (!API_URL) return;

      try {
        const token = session?.accessToken;
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/quiz-questions`, {
          method: "GET",
          headers: headers,
        });

        if (res.ok) {
          const responseJson = await res.json();
          if (responseJson.data && Array.isArray(responseJson.data)) {
            setQuestions(responseJson.data);
          } else if (Array.isArray(responseJson)) {
            setQuestions(responseJson);
          } else {
            setQuestions([]);
          }
        }
      } catch (error) {
        console.error("Error connection:", error);
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, [status, session]);

  // --- HANDLERS ---

  // HANDLER SIMPAN
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = session?.accessToken;
      if (!token) {
        showToast("Sesi habis. Silahkan login ulang.", "error");
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1. Simpan Styles ke LocalStorage
      localStorage.setItem("quizStyles", JSON.stringify(styles));

      // 2. Simpan Perubahan ke API
      const currentQuestions = Array.isArray(questions) ? questions : [];

      const updatePromises = currentQuestions.map(async (q) => {
        try {
          const res = await fetch(`${API_URL}/quiz-questions/${q.id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              id: q.id,
              text: q.text,
              imageUrl: q.imageUrl,
              relatedStyle: q.relatedStyle,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            // Throw error to be caught by Promise.allSettled or handled here
            throw new Error(errData.message || `Failed to update ${q.id} (${res.status})`);
          }
          return res;
        } catch (err: any) {
          console.error(`Failed to update question ${q.id}:`, err);
          throw err;
        }
      });

      // Use Promise.allSettled to track which succeeded and which failed (optional, but Promise.all fails fast)
      // Actually standard Promise.all is fine if we just want to know if *any* failed.
      // But let's use all to catch the first error.
      await Promise.all(updatePromises);

      showToast("Data berhasil disimpan ke server!", "success");
    } catch (error: any) {
      console.error("Save error:", error);
      showToast(`Gagal menyimpan: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC DELETE DENGAN MODAL ---

  // 1. Trigger saat tombol hapus diklik (Buka Modal)
  const initiateDelete = (type: "style" | "question", id: string) => {
    setConfirmModal({ show: true, type, id });
  };

  // 2. Eksekusi Hapus (Saat user klik "Ya" di Modal)
  const executeDelete = async () => {
    const { type, id } = confirmModal;
    if (!id) return;

    if (type === "style") {
      // Hapus Style (Lokal)
      setStyles(styles.filter((s) => s.id !== id));
      showToast("Kategori style berhasil dihapus.", "success");
    } else if (type === "question") {
      // Hapus Question (API)
      const currentQuestions = Array.isArray(questions) ? questions : [];
      // Optimistic update
      setQuestions(currentQuestions.filter((q) => q.id !== id));

      try {
        const token = session?.accessToken;
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        await fetch(`${API_URL}/quiz-questions/${id}`, {
          method: "DELETE",
          headers: headers,
        });
        showToast("Pertanyaan berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal menghapus:", error);
        showToast("Gagal menghapus data di server.", "error");
        // Rollback jika perlu (opsional)
      }
    }

    // Tutup Modal
    setConfirmModal({ show: false, type: null, id: null });
  };

  // --- CRUD OPERASI LAINNYA ---

  const addStyle = () => {
    const newStyle: DesignStyle = {
      id: `style_${Date.now()}`,
      name: "",
      description: "",
    };
    setStyles([...styles, newStyle]);
  };

  const updateStyle = (id: string, field: keyof DesignStyle, value: string) => {
    setStyles(styles.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addQuestion = async () => {
    const token = session?.accessToken;
    if (!token) {
      showToast("Sesi habis. Silahkan login ulang.", "error"); // Ganti alert
      return;
    }

    const newId = Date.now().toString();
    const defaultStyle = styles.length > 0 ? styles[0].id : "";

    const newQ: QuizQuestion = {
      id: newId,
      text: "Apakah kamu menyukai desain ini?",
      imageUrl: "",
      relatedStyle: defaultStyle,
    };

    setQuestions([...(Array.isArray(questions) ? questions : []), newQ]);

    try {
      await fetch(`${API_URL}/quiz-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQ),
      });
    } catch (error) {
      console.error("Gagal membuat pertanyaan:", error);
      showToast("Gagal koneksi ke server.", "error"); // Ganti alert
    }
  };

  const updateQuestion = (
    id: string,
    field: keyof QuizQuestion,
    value: string
  ) => {
    const currentQuestions = Array.isArray(questions) ? questions : [];
    setQuestions(
      currentQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleImageUpload = (id: string, file: File) => {
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      showToast("File terlalu besar! Maksimal 1MB.", "error"); // Ganti alert
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateQuestion(id, "imageUrl", base64String);
    };
    reader.readAsDataURL(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(id, e.target.files[0]);
    }
  };

  const onDropHandler = (e: React.DragEvent<HTMLLabelElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(id, e.dataTransfer.files[0]);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin text-blue-600">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-10 text-center">Akses Ditolak. Silakan Login.</div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <LayoutTemplate className="text-pink-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              Pengaturan Kuis Preferensi
            </h3>
            <p className="text-sm text-gray-500">
              Buat pertanyaan untuk mengetahui selera desain klien
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          <Save size={18} /> {isLoading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("styles")}
          className={`pb-3 px-4 text-sm font-medium transition-all ${activeTab === "styles"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          1. Atur Kategori Desain (Hasil)
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-3 px-4 text-sm font-medium transition-all ${activeTab === "questions"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          2. Atur Pertanyaan & Gambar
        </button>
      </div>

      {/* TAB 1: MANAGEMEN STYLE / KATEGORI */}
      {activeTab === "styles" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800">
              Daftar Rekomendasi Gaya Desain
            </h4>
            <button
              onClick={addStyle}
              className="text-sm flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
            >
              <Plus size={16} /> Tambah Style
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {styles.map((style, index) => (
              <div
                key={style.id}
                className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50"
              >
                <div className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Nama Style (ID)
                    </label>
                    <input
                      type="text"
                      value={style.name}
                      onChange={(e) =>
                        updateStyle(style.id, "name", e.target.value)
                      }
                      placeholder="Contoh: Modern"
                      className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      value={style.description}
                      onChange={(e) =>
                        updateStyle(style.id, "description", e.target.value)
                      }
                      placeholder="Deskripsi..."
                      className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none h-20"
                    />
                  </div>
                </div>
                <button
                  onClick={() => initiateDelete("style", style.id)} // Ganti removeStyle langsung
                  className="text-red-400 hover:text-red-600 self-start p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          {styles.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              Belum ada kategori style. Silahkan tambah baru.
            </p>
          )}
        </div>
      )}

      {/* TAB 2: MANAGEMEN PERTANYAAN */}
      {activeTab === "questions" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6 text-sm text-yellow-800 flex gap-2">
            <HelpCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <strong>Logika Kuis:</strong> Setiap pertanyaan di bawah ini akan
              ditampilkan ke user.
              <br />
              Jika user memilih <strong>"Suka"</strong>, poin akan ditambahkan
              ke Kategori Terkait.
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800">
              Daftar Pertanyaan Gambar
            </h4>
            <button
              onClick={addQuestion}
              className="text-sm flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
            >
              <Plus size={16} /> Tambah Pertanyaan
            </button>
          </div>

          <div className="space-y-6">
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, index) => (
                <div
                  key={q.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex gap-4">
                    {/* Kolom Kiri: Upload Drag & Drop */}
                    <div className="w-1/4">
                      <label
                        className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => onDropHandler(e, q.id)}
                      >
                        {q.imageUrl ? (
                          <>
                            <img
                              src={q.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                              Ganti Gambar
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <UploadCloud className="mx-auto text-gray-400 mb-2 group-hover:text-blue-500" />
                            <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600">
                              Klik / Drag Foto
                            </span>
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onFileSelect(e, q.id)}
                        />
                      </label>
                    </div>

                    {/* Kolom Kanan: Detail Pertanyaan */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-400 text-xs">
                          PERTANYAAN #{index + 1}
                        </span>
                        <button
                          onClick={() => initiateDelete("question", q.id)} // Ganti removeQuestion
                          className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teks Pertanyaan
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={q.text}
                          onChange={(e) =>
                            updateQuestion(q.id, "text", e.target.value)
                          }
                        />
                      </div>

                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <label className="block text-sm font-bold text-blue-800 mb-1">
                          Rekomendasikan Style:
                        </label>
                        <select
                          className="w-full border border-gray-300 p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          value={q.relatedStyle}
                          onChange={(e) =>
                            updateQuestion(q.id, "relatedStyle", e.target.value)
                          }
                        >
                          <option value="">-- Pilih Kategori Style --</option>
                          {styles.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                Belum ada pertanyaan.
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- KOMPONEN UI POP-UP & MODAL --- */}

      {/* 1. TOAST NOTIFICATION (Pojok Kanan Bawah) */}
      {notification.show && (
        <div
          className={`fixed bottom-10 right-10 px-6 py-4 rounded-lg shadow-xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50 ${notification.type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={24} className="text-green-600" />
          ) : (
            <AlertCircle size={24} className="text-red-600" />
          )}
          <div>
            <h4 className="font-bold text-sm">
              {notification.type === "success" ? "Berhasil" : "Gagal"}
            </h4>
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. CONFIRMATION MODAL (Tengah Layar) */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-red-50 p-4 flex justify-between items-center border-b border-red-100">
              <h3 className="font-bold text-red-700 flex items-center gap-2">
                <AlertCircle size={20} />
                Konfirmasi Hapus
              </h3>
              <button
                onClick={() =>
                  setConfirmModal({ show: false, type: null, id: null })
                }
                className="text-gray-400 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus{" "}
                {confirmModal.type === "style"
                  ? "Kategori Style"
                  : "Pertanyaan"}{" "}
                ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() =>
                  setConfirmModal({ show: false, type: null, id: null })
                }
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
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
