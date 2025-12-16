"use client";

import { useState, useEffect } from 'react';
import { ClipboardList, X, Heart, ThumbsDown, ArrowRight, User, Lock, Mail, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion'; // <--- JANGAN LUPA IMPORT INI

// --- TIPE DATA (Sama dengan Admin) ---
interface DesignStyle {
    id: string;
    name: string;
    description: string;
}

interface QuizQuestion {
    id: string;
    text: string;
    imageUrl: string;
    relatedStyleId: string;
}

export default function DesignQuizUser() {
    // --- STATE ---
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'intro' | 'quiz' | 'result' | 'auth'>('intro');
    
    // Data Kuis
    const [styles, setStyles] = useState<DesignStyle[]>([]);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    
    // Progress User
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({}); // { 'style_id': score }
    const [winnerStyle, setWinnerStyle] = useState<DesignStyle | null>(null);

    // Load Data dari LocalStorage (Simulasi Database)
    useEffect(() => {
        const savedStyles = localStorage.getItem("quizStyles");
        const savedQuestions = localStorage.getItem("quizQuestions");
        
        if (savedStyles) setStyles(JSON.parse(savedStyles));
        if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    }, []);

    // --- LOGIKA KUIS ---

    const startQuiz = () => {
        if (questions.length === 0) {
            alert("Admin belum membuat pertanyaan kuis!");
            return;
        }
        setIsOpen(true);
        setStep('quiz');
        setCurrentQIndex(0);
        setScores({});
    };

    const handleAnswer = (liked: boolean) => {
        const currentQ = questions[currentQIndex];

        if (liked) {
            // Jika user SUKA, tambahkan skor ke style terkait
            const styleId = currentQ.relatedStyleId;
            setScores(prev => ({
                ...prev,
                [styleId]: (prev[styleId] || 0) + 1
            }));
        }

        // Cek apakah ini pertanyaan terakhir
        if (currentQIndex + 1 < questions.length) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            calculateResult();
        }
    };

    const calculateResult = () => {
        // Cari skor tertinggi
        let maxScore = -1;
        let winningStyleId = "";

        // Iterasi setiap style untuk cek skornya
        styles.forEach(style => {
            const score = scores[style.id] || 0;
            if (score > maxScore) {
                maxScore = score;
                winningStyleId = style.id;
            }
        });

        // Temukan object style pemenang
        const winner = styles.find(s => s.id === winningStyleId);
        setWinnerStyle(winner || styles[0]); // Fallback ke style pertama jika draw/error
        setStep('result');
    };

    // --- RENDER COMPONENT ---

    return (
        <>
            {/* 1. CARD TRIGGER (TOMBOL MULAI DI LANDING PAGE) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={startQuiz}
                className="bg-[#BC5D60] text-white p-12 rounded-lg cursor-pointer shadow-xl text-center relative z-10"
            >
                <ClipboardCheck size={64} className="mx-auto mb-6" />
                <h2 className="text-white mb-4 text-2xl font-bold">Tidak Yakin Gaya Desain Anda?</h2>
                <p className="mb-8 opacity-90 text-lg">
                    Ikuti quiz interaktif kami untuk menemukan gaya desain yang sempurna sesuai kepribadian dan kebutuhan Anda
                </p>
                <motion.div 
                    className="inline-flex items-center gap-2 text-lg px-8 py-3 bg-white text-[#BC5D60] rounded-lg font-bold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Mulai Quiz <ArrowRight size={24} />
                </motion.div>
            </motion.div>

            {/* 2. MODAL POPUP */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
               
                    {/* Backdrop Gelap */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden relative z-10 flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                        
                        {/* Tombol Close */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* --- VIEW: QUIZ --- */}
                        {step === 'quiz' && questions[currentQIndex] && (
                            <>
                                {/* Kiri: Gambar */}
                                <div className="w-full md:w-1/2 h-64 md:h-full bg-gray-100 relative">
                                    <img 
                                        src={questions[currentQIndex].imageUrl} 
                                        alt="Quiz" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                                        Pertanyaan {currentQIndex + 1} dari {questions.length}
                                    </div>
                                </div>

                                {/* Kanan: Pertanyaan & Aksi */}
                                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-center bg-white">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {questions[currentQIndex].text}
                                    </h3>
                                    <p className="text-gray-500 mb-10 text-sm">
                                        Apakah gaya ruangan ini sesuai dengan selera Anda?
                                    </p>

                                    <div className="flex gap-6 w-full max-w-xs">
                                        <button 
                                            onClick={() => handleAnswer(false)}
                                            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 transition-all group"
                                        >
                                            <div className="bg-red-100 p-3 rounded-full group-hover:scale-110 transition-transform">
                                                <ThumbsDown size={24} />
                                            </div>
                                            <span className="font-medium text-sm">Kurang Suka</span>
                                        </button>

                                        <button 
                                            onClick={() => handleAnswer(true)}
                                            className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-green-100 text-green-500 hover:bg-green-50 hover:border-green-200 transition-all group"
                                        >
                                            <div className="bg-green-100 p-3 rounded-full group-hover:scale-110 transition-transform">
                                                <Heart size={24} fill="currentColor" />
                                            </div>
                                            <span className="font-medium text-sm">Suka Banget</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* --- VIEW: RESULT --- */}
                        {step === 'result' && winnerStyle && (
                            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-blue-50 to-white relative">
                                {/* Confetti Effect */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                                
                                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2">Hasil Analisa AI</span>
                                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                                    {winnerStyle.name}
                                </h2>
                                <p className="text-gray-600 max-w-lg mb-8 leading-relaxed">
                                    {winnerStyle.description}
                                </p>

                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md w-full mb-8">
                                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Lock size={16} className="text-yellow-500" /> 
                                        Simpan Hasil Ini?
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Simpan preferensi ini ke akun Anda agar desainer kami bisa langsung mengetahuinya.
                                    </p>
                                    <button 
                                        onClick={() => setStep('auth')}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg"
                                    >
                                        Simpan Preferensi & Daftar
                                    </button>
                                </div>
                                
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">
                                    Tutup tanpa menyimpan
                                </button>
                            </div>
                        )}

                        {/* --- VIEW: AUTH (Register/Login) --- */}
                        {step === 'auth' && (
                            <div className="w-full h-full flex">
                                {/* Kiri: Info */}
                                <div className="hidden md:flex w-1/2 bg-blue-600 text-white p-10 flex-col justify-center">
                                    <h3 className="text-3xl font-bold mb-4">Satu Langkah Lagi!</h3>
                                    <p className="opacity-90 mb-8">
                                        Buat akun untuk menyimpan hasil kuis gaya <strong>{winnerStyle?.name}</strong> Anda. Ini akan sangat membantu tim desainer kami.
                                    </p>
                                    <div className="space-y-4 text-sm opacity-80">
                                        <div className="flex items-center gap-2">✓ Simpan Referensi Desain</div>
                                        <div className="flex items-center gap-2">✓ Konsultasi Gratis</div>
                                        <div className="flex items-center gap-2">✓ Estimasi Biaya Proyek</div>
                                    </div>
                                </div>

                                {/* Kanan: Form */}
                                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Daftar Akun Baru</h3>
                                    
                                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Proses Register/Login Backend dijalankan disini!"); setIsOpen(false); }}>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input type="text" className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input type="email" className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@contoh.com" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input type="password" className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4">
                                            Daftar & Simpan Hasil
                                        </button>
                                    </form>

                                    <p className="text-center text-sm text-gray-500 mt-6">
                                        Sudah punya akun? <a href="#" className="text-blue-600 font-bold hover:underline">Login disini</a>
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}