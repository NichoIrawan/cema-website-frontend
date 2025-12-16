"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, LayoutTemplate, HelpCircle, UploadCloud } from 'lucide-react';

// --- TIPE DATA ---

interface DesignStyle {
    id: string;
    name: string;
    description: string;
}

interface QuizQuestion {
    id: string;
    text: string;
    imageUrl: string;       // Berisi Base64 string
    relatedStyleId: string;
}

export default function DesignQuizAdmin() {
    // --- STATE ---

    const [styles, setStyles] = useState<DesignStyle[]>([
        { id: 's1', name: 'Modern Futuristik', description: 'Gaya desain dengan teknologi tinggi, garis tajam, dan material metalik.' },
        { id: 's2', name: 'Scandinavian', description: 'Gaya bersih, fungsional, banyak kayu natural dan warna putih.' },
    ]);

    const [questions, setQuestions] = useState<QuizQuestion[]>([
        { id: 'q1', text: 'Bagaimana pendapatmu tentang ruang tamu ini?', imageUrl: 'https://images.unsplash.com/photo-1518005020951-ecc859466abc', relatedStyleId: 's1' }
    ]);

    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'styles' | 'questions'>('styles');

    // Load data
    useEffect(() => {
        const savedStyles = localStorage.getItem("quizStyles");
        const savedQuestions = localStorage.getItem("quizQuestions");
        if (savedStyles) setStyles(JSON.parse(savedStyles));
        if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    }, []);

    // --- HANDLERS ---

    const handleSave = () => {
        try {
            localStorage.setItem("quizStyles", JSON.stringify(styles));
            localStorage.setItem("quizQuestions", JSON.stringify(questions));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            alert("Gagal menyimpan! Ukuran gambar mungkin terlalu besar untuk LocalStorage.");
        }
    };

    // CRUD Style
    const addStyle = () => {
        const newStyle: DesignStyle = { id: Date.now().toString(), name: '', description: '' };
        setStyles([...styles, newStyle]);
    };
    const removeStyle = (id: string) => {
        setStyles(styles.filter(s => s.id !== id));
    };
    const updateStyle = (id: string, field: keyof DesignStyle, value: string) => {
        setStyles(styles.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // CRUD Pertanyaan
    const addQuestion = () => {
        const newQ: QuizQuestion = { id: Date.now().toString(), text: 'Apakah kamu menyukai desain ini?', imageUrl: '', relatedStyleId: styles[0]?.id || '' };
        setQuestions([...questions, newQ]);
    };
    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };
    const updateQuestion = (id: string, field: keyof QuizQuestion, value: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    // --- LOGIKA UPLOAD GAMBAR (DRAG & DROP) ---
    
    const handleImageUpload = (id: string, file: File) => {
        if (!file) return;

        // Validasi ukuran (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file terlalu besar! Harap upload gambar di bawah 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            updateQuestion(id, 'imageUrl', base64String);
        };
        reader.readAsDataURL(file);
    };

    // Handler saat file dipilih via klik
    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(id, e.target.files[0]);
        }
    };

    // Handler saat file di-drop (FIXED: Menggunakan HTMLLabelElement)
    const onDropHandler = (e: React.DragEvent<HTMLLabelElement>, id: string) => {
        e.preventDefault();
        e.stopPropagation(); // Stop event bubbling
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(id, e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                        <LayoutTemplate className="text-pink-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Pengaturan Kuis Preferensi</h3>
                        <p className="text-sm text-gray-500">Buat pertanyaan untuk mengetahui selera desain klien</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Save size={18} /> Simpan Data
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-4 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('styles')}
                    className={`pb-3 px-4 text-sm font-medium transition-all ${activeTab === 'styles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    1. Atur Kategori Desain (Hasil)
                </button>
                <button 
                    onClick={() => setActiveTab('questions')}
                    className={`pb-3 px-4 text-sm font-medium transition-all ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    2. Atur Pertanyaan & Gambar
                </button>
            </div>

            {/* TAB 1: MANAGEMEN STYLE / KATEGORI */}
            {activeTab === 'styles' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-800">Daftar Rekomendasi Gaya Desain</h4>
                        <button onClick={addStyle} className="text-sm flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
                            <Plus size={16} /> Tambah Style
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {styles.map((style, index) => (
                            <div key={style.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                                <div className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nama Style</label>
                                        <input 
                                            type="text"
                                            value={style.name}
                                            onChange={(e) => updateStyle(style.id, 'name', e.target.value)}
                                            placeholder="Contoh: Modern Minimalis"
                                            className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat</label>
                                        <textarea 
                                            value={style.description}
                                            onChange={(e) => updateStyle(style.id, 'description', e.target.value)}
                                            placeholder="Deskripsi yang akan muncul jika user mendapatkan hasil ini..."
                                            className="w-full mt-1 p-2 border border-gray-300 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                        />
                                    </div>
                                </div>
                                <button onClick={() => removeStyle(style.id)} className="text-red-400 hover:text-red-600 self-start p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    {styles.length === 0 && <p className="text-center text-gray-400 py-10">Belum ada kategori style. Silahkan tambah baru.</p>}
                </div>
            )}

            {/* TAB 2: MANAGEMEN PERTANYAAN */}
            {activeTab === 'questions' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6 text-sm text-yellow-800 flex gap-2">
                        <HelpCircle size={18} className="shrink-0 mt-0.5" />
                        <div>
                            <strong>Logika Kuis:</strong> Setiap pertanyaan di bawah ini akan ditampilkan ke user dengan opsi "Suka" atau "Tidak Suka". <br/>
                            Jika user memilih <strong>"Suka"</strong>, poin akan ditambahkan ke <strong>Kategori Terkait</strong> yang kamu pilih di dropdown.
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-800">Daftar Pertanyaan Gambar</h4>
                        <button onClick={addQuestion} className="text-sm flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
                            <Plus size={16} /> Tambah Pertanyaan
                        </button>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, index) => (
                            <div key={q.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                                <div className="flex gap-4">
                                    {/* Kolom Kiri: Upload Drag & Drop */}
                                    <div className="w-1/4">
                                        <label 
                                            className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors"
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={(e) => onDropHandler(e, q.id)}
                                        >
                                            {q.imageUrl ? (
                                                <>
                                                    <img src={q.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    {/* Overlay saat hover untuk ganti gambar */}
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
                                            
                                            {/* Input File Tersembunyi */}
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
                                            <span className="font-bold text-gray-400 text-xs">PERTANYAAN #{index + 1}</span>
                                            <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1">
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teks Pertanyaan</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-gray-300 p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={q.text}
                                                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                            />
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                            <label className="block text-sm font-bold text-blue-800 mb-1">
                                                Jika User "SUKA" gambar ini, rekomendasikan style:
                                            </label>
                                            <select 
                                                className="w-full border border-gray-300 p-2 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                value={q.relatedStyleId}
                                                onChange={(e) => updateQuestion(q.id, 'relatedStyleId', e.target.value)}
                                            >
                                                <option value="">-- Pilih Kategori Style --</option>
                                                {styles.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                *Memilih "Tidak Suka" tidak akan menambah poin.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isSaved && (
                <div className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce font-medium">
                    Data Kuis Berhasil Disimpan!
                </div>
            )}
        </div>
    );
}