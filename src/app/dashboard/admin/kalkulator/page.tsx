"use client";

import { useState, useEffect } from 'react';
import { Save, Calculator, RefreshCw, LayoutGrid, CheckCircle, X } from 'lucide-react';

interface CalculatorSettings {
    services: {
        interior: number;
        architecture: number;
        renovation: number;
    };
    materials: {
        standard: number;
        premium: number;
        luxury: number;
    };
    roomPrice: number; // ITEM BARU: Harga per ruangan
}

interface SimulationState {
    area: number;
    service: 'interior' | 'architecture' | 'renovation';
    material: 'standard' | 'premium' | 'luxury';
    rooms: number;
}

export default function CalculatorPage() {

    // Default settings
    const [settings, setSettings] = useState<CalculatorSettings>({
        services: {
            interior: 2500000,   
            architecture: 1500000,
            renovation: 3000000
        },
        materials: {
            standard: 1.0, 
            premium: 1.4,
            luxury: 1.8 
        },
        roomPrice: 2000000 // Default biaya tambahan per partisi ruangan
    });
    
    const [sim, setSim] = useState<SimulationState>({
        area: 100,
        service: 'interior',
        material: 'standard',
        rooms: 3
    });

    const [showToast, setShowToast] = useState(false);

    // Load settings dari localStorage
    useEffect(() => {
        const stored = localStorage.getItem("calculatorSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    // Simpan ke localStorage + Show Toast
    const handleSave = () => {
        localStorage.setItem("calculatorSettings", JSON.stringify(settings));
        setShowToast(true);
        // Hide toast otomatis setelah 3 detik
        setTimeout(() => setShowToast(false), 3000);
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    // RUMUS BARU: (Luas * Harga * Multiplier) + (Ruangan * Harga Ruangan)
    const calculateSimulation = () => {
        const basePrice = sim.area * settings.services[sim.service] * settings.materials[sim.material];
        const roomCost = sim.rooms * settings.roomPrice;
        
        return basePrice + roomCost;
    };

    return (
        <div className="space-y-6 relative">
            
            {/* === TOAST NOTIFICATION (POJOK KANAN BAWAH) === */}
            {showToast && (
                <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-gray-700">
                        <CheckCircle className="text-green-400" size={20} />
                        <div>
                            <h4 className="font-bold text-sm">Berhasil Disimpan!</h4>
                            <p className="text-xs text-gray-400">Pengaturan kalkulator telah diperbarui.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 text-gray-500 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Calculator className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Pengaturan Kalkulator Harga</h3>
                        <p className="text-sm text-gray-500">Sesuaikan logika perhitungan harga</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* === KOLOM KIRI: ADMIN SETTINGS === */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-8">
                    
                    {/* 1. Harga Dasar Layanan */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                            Harga Dasar Layanan (per m²)
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(settings.services).map(([key, value]) => (
                                <div key={key}>
                                    <label className="text-sm font-medium text-gray-600 capitalize">
                                        {key === 'interior' ? 'Desain Interior' : key === 'architecture' ? 'Arsitektur' : 'Renovasi'}
                                    </label>
                                    <div className="relative mt-1">
                                        <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                        <input 
                                            type="number" 
                                            className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                            value={value}
                                            onChange={(e) => setSettings({...settings, services: {...settings.services, [key]: Number(e.target.value)}})}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Biaya Per Ruangan (NEW) */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                            Biaya Tambahan Per Ruangan
                        </h4>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Harga Partisi/Ruangan</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                                    value={settings.roomPrice}
                                    onChange={(e) => setSettings({...settings, roomPrice: Number(e.target.value)})}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Biaya ini akan dikalikan dengan jumlah ruangan yang dipilih user.</p>
                        </div>
                    </div>

                    {/* 3. Multiplier Material */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                            Faktor Pengali Material
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            {Object.entries(settings.materials).map(([key, value]) => (
                                <div key={key}>
                                    <label className="text-xs font-medium text-gray-600 block mb-1 capitalize">{key}</label>
                                    <input 
                                        type="number" step="0.1"
                                        className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                        value={value}
                                        onChange={(e) => setSettings({...settings, materials: {...settings.materials, [key]: Number(e.target.value)}})}
                                    />
                                    <span className="text-xs text-gray-400 block text-center mt-1">x (kali)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="pt-4">
                        <button 
                            onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium shadow-lg shadow-blue-200"
                        >
                            <Save size={18} />
                            Simpan Perubahan Harga
                        </button>
                    </div>
                </div>

                {/* === KOLOM KANAN: PREVIEW USER === */}
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-6 text-gray-400 uppercase text-xs font-bold tracking-wider">
                            <RefreshCw size={14} /> Live Preview (Tampilan User)
                        </div>

                        {/* Input Simulasi */}
                        <div className="space-y-5 flex-1">
                            
                            {/* Input Luas */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                                        <LayoutGrid size={12}/> Luas Bangunan
                                    </label>
                                    <span className="font-bold text-gray-800 text-sm">{sim.area} m²</span>
                                </div>
                                <input 
                                    type="range" min="10" max="500" 
                                    value={sim.area} 
                                    onChange={(e) => setSim({...sim, area: Number(e.target.value)})}
                                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Input Layanan */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Jenis Layanan</label>
                                <select 
                                    className="w-full mt-1 border border-gray-200 p-2 rounded-lg text-sm bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={sim.service}
                                    onChange={(e) => setSim({...sim, service: e.target.value as any})}
                                >
                                    <option value="interior">Interior ({formatRupiah(settings.services.interior)})</option>
                                    <option value="architecture">Arsitektur ({formatRupiah(settings.services.architecture)})</option>
                                    <option value="renovation">Renovasi ({formatRupiah(settings.services.renovation)})</option>
                                </select>
                            </div>

                            {/* Input Material */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Kualitas Material</label>
                                <div className="flex gap-2 mt-2">
                                    {(['standard', 'premium', 'luxury'] as const).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setSim({...sim, material: m})}
                                            className={`flex-1 py-2 text-xs rounded-md border capitalize transition-all ${
                                                sim.material === m 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {m} <br/><span className="text-[10px] opacity-80">x{settings.materials[m]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Jumlah Ruangan */}
                            <div className="pt-2 border-t border-dashed border-gray-100">
                                <div className="flex justify-between mb-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Jumlah Ruangan</label>
                                    <span className="font-bold text-gray-800 text-sm">{sim.rooms} Ruangan</span>
                                </div>
                                <input 
                                    type="range" min="1" max="20" 
                                    value={sim.rooms} 
                                    onChange={(e) => setSim({...sim, rooms: Number(e.target.value)})}
                                    className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 text-right">
                                    + {formatRupiah(settings.roomPrice)} / ruangan
                                </p>
                            </div>

                        </div>

                        {/* Hasil Kalkulasi Realtime */}
                        <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Estimasi Total Biaya</p>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold text-green-600">
                                    {formatRupiah(calculateSimulation())}
                                </h2>
                            </div>
                            
                            {/* Rincian Rumus */}
                            <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100 space-y-1">
                                <div className="flex justify-between">
                                    <span>Biaya Konstruksi:</span>
                                    <span className="font-medium">{formatRupiah(sim.area * settings.services[sim.service] * settings.materials[sim.material])}</span>
                                </div>
                                <div className="flex justify-between text-orange-600">
                                    <span>Biaya Ruangan ({sim.rooms}x):</span>
                                    <span className="font-medium">+ {formatRupiah(sim.rooms * settings.roomPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}