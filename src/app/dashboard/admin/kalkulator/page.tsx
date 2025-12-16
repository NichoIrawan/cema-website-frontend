"use client";

import { useState, useEffect } from 'react';
import { Save, Calculator, RefreshCw } from 'lucide-react';


interface CalculatorSettings {
    services: {
        interior: number;
        architecture: number;
        renovation: number;
    };
    materials: {
        standard: number; // Multiplier, e.g., 1.0
        premium: number;  // Multiplier, e.g., 1.3
        luxury: number;   // Multiplier, e.g., 1.6
    };
}


interface SimulationState {
    area: number;
    service: 'interior' | 'architecture' | 'renovation';
    material: 'standard' | 'premium' | 'luxury';
    rooms: number;
}

export default function CalculatorPage() {

    const [settings, setSettings] = useState<CalculatorSettings>({
        services: {
            interior: 2500000,   
            architecture: 1500000,
            renovation: 3000000
        },
        materials: {
            standard: 1.0,  // Faktor x1
            premium: 1.4,   // Faktor x1.4
            luxury: 1.8     // Faktor x1.8
        }
    });

    
    const [sim, setSim] = useState<SimulationState>({
        area: 90,
        service: 'interior',
        material: 'standard',
        rooms: 3
    });

    const [isSaved, setIsSaved] = useState(false);

    
    useEffect(() => {
        const stored = localStorage.getItem("calculatorSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    
    const handleSave = () => {
        localStorage.setItem("calculatorSettings", JSON.stringify(settings));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

  
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

 
    const calculateSimulation = () => {
        const baseServicePrice = settings.services[sim.service];
        const materialMultiplier = settings.materials[sim.material];
        
        
        const total = sim.area * baseServicePrice * materialMultiplier;
        return total;
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
                        <p className="text-sm text-gray-500">Sesuaikan harga layanan dan multiplier material</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* KOLOM KIRI: INPUT ADMIN */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-8">
                    
                    {/* Section 1: Harga Layanan */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                            Harga Dasar Layanan (per m²)
                        </h4>
                        <div className="space-y-4">
                            {/* Interior */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Desain Interior</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        value={settings.services.interior}
                                        onChange={(e) => setSettings({...settings, services: {...settings.services, interior: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>
                            {/* Arsitektur */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Arsitektur</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        value={settings.services.architecture}
                                        onChange={(e) => setSettings({...settings, services: {...settings.services, architecture: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>
                            {/* Renovasi */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Renovasi</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                                        value={settings.services.renovation}
                                        onChange={(e) => setSettings({...settings, services: {...settings.services, renovation: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Multiplier Material */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                            Faktor Pengali Material (Multiplier)
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Standard</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                    value={settings.materials.standard}
                                    onChange={(e) => setSettings({...settings, materials: {...settings.materials, standard: Number(e.target.value)}})}
                                />
                                <span className="text-xs text-gray-400 block text-center mt-1">x (kali)</span>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Premium</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                    value={settings.materials.premium}
                                    onChange={(e) => setSettings({...settings, materials: {...settings.materials, premium: Number(e.target.value)}})}
                                />
                                <span className="text-xs text-gray-400 block text-center mt-1">x (kali)</span>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Luxury</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                    value={settings.materials.luxury}
                                    onChange={(e) => setSettings({...settings, materials: {...settings.materials, luxury: Number(e.target.value)}})}
                                />
                                <span className="text-xs text-gray-400 block text-center mt-1">x (kali)</span>
                            </div>
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
                        {isSaved && (
                            <p className="text-green-600 text-center text-sm mt-2 animate-bounce font-medium">
                                ✓ Pengaturan berhasil disimpan!
                            </p>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN: LIVE PREVIEW */}
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-6 text-gray-400 uppercase text-xs font-bold tracking-wider">
                            <RefreshCw size={14} /> Live Preview Kalkulator
                        </div>

                        {/* Input Simulasi */}
                        <div className="space-y-4 flex-1">
                            {/* Input Luas */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Luas Bangunan</label>
                                <div className="flex justify-between items-center mt-1">
                                    <input 
                                        type="range" min="10" max="500" 
                                        value={sim.area} 
                                        onChange={(e) => setSim({...sim, area: Number(e.target.value)})}
                                        className="w-2/3 accent-blue-600"
                                    />
                                    <span className="font-bold text-gray-800">{sim.area} m²</span>
                                </div>
                            </div>

                            {/* Input Layanan */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Jenis Layanan</label>
                                <select 
                                    className="w-full mt-1 border border-gray-200 p-2 rounded-lg text-sm bg-gray-50 text-gray-900"
                                    value={sim.service}
                                    onChange={(e) => setSim({...sim, service: e.target.value as any})}
                                >
                                    <option value="interior">Desain Interior ({formatRupiah(settings.services.interior)}/m)</option>
                                    <option value="architecture">Arsitektur ({formatRupiah(settings.services.architecture)}/m)</option>
                                    <option value="renovation">Renovasi ({formatRupiah(settings.services.renovation)}/m)</option>
                                </select>
                            </div>

                            {/* Input Material */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Kualitas Material</label>
                                <div className="flex gap-2 mt-1">
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
                                            {m} <br/> <span className="opacity-75 text-[10px]">(x{settings.materials[m]})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hasil Kalkulasi Realtime */}
                        <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Estimasi Harga (Preview)</p>
                            <div className="flex items-end gap-1">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {formatRupiah(calculateSimulation())}
                                </h2>
                            </div>
                            <div className="mt-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                                Rumus: {sim.area}m² × {formatRupiah(settings.services[sim.service])} × {settings.materials[sim.material]}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}