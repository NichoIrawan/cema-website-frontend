"use client";

import { useState, useEffect } from 'react';
import { Save, Calculator } from 'lucide-react';

interface CalculatorSettings {
    basePrice: number;
    roomMultiplierPercentage: number;
    baseRoomCount: number;
}

export default function CalculatorPage() {
    // State untuk settings
    const [settings, setSettings] = useState<CalculatorSettings>({
        basePrice: 2500000,
        roomMultiplierPercentage: 10,
        baseRoomCount: 3
    });

    const [isSaved, setIsSaved] = useState(false);

    // Load data dari LocalStorage saat awal buka
    useEffect(() => {
        const stored = localStorage.getItem("calculatorSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    // Fungsi Simpan
    const handleSave = () => {
        localStorage.setItem("calculatorSettings", JSON.stringify(settings));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hilangkan pesan sukses setelah 3 detik
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Calculator className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Pengaturan Kalkulator Harga</h3>
                        <p className="text-sm text-gray-500">Atur rumus harga estimasi proyek</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Pengaturan Dasar */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Variabel Dasar</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga Dasar (Base Price)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={settings.basePrice}
                                    onChange={(e) => setSettings({...settings, basePrice: Number(e.target.value)})}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Harga acuan per meter persegi atau per proyek standar.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kenaikan per Ruangan (%)
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={settings.roomMultiplierPercentage}
                                    onChange={(e) => setSettings({...settings, roomMultiplierPercentage: Number(e.target.value)})}
                                />
                                <span className="absolute right-3 top-2 text-gray-500">%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jumlah Ruangan Dasar
                            </label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.baseRoomCount}
                                onChange={(e) => setSettings({...settings, baseRoomCount: Number(e.target.value)})}
                            />
                            <p className="text-xs text-gray-500 mt-1">Jumlah ruangan standar yang dicover harga dasar.</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button 
                            onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                        >
                            <Save size={18} />
                            Simpan Pengaturan
                        </button>
                        {isSaved && (
                            <p className="text-green-600 text-center text-sm mt-2 animate-pulse">
                                Pengaturan berhasil disimpan!
                            </p>
                        )}
                    </div>
                </div>

                {/* Card Simulasi / Preview (Opsional) */}
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col justify-center items-center text-center">
                    <Calculator className="text-gray-300 mb-4" size={48} />
                    <h4 className="font-medium text-gray-600">Simulasi Kalkulator</h4>
                    <p className="text-sm text-gray-400 mt-1">
                        Disini nanti akan muncul preview bagaimana user melihat hasil perhitungan berdasarkan angka yang kamu input di sebelah kiri.
                    </p>
                </div>
            </div>
        </div>
    );
}