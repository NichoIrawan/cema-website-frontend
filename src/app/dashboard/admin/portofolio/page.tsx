"use client";

import { useState, useEffect } from 'react';
import type { Portfolio } from '@/lib/types';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react'; 

// PERUBAHAN UTAMA DI SINI: Tambahkan 'default'
export default function PortfolioPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<Portfolio>>({
        category: 'Residential',
        showOnHomepage: false,
        imageUrl: ""
    });

    // Load Data
    useEffect(() => {
        const stored = localStorage.getItem("portfolios");
        if (stored) {
            setPortfolios(JSON.parse(stored));
        } else {
            // Default Data
            setPortfolios([{
                id: 1,
                title: "Modern Minimalist House",
                category: "Residential",
                imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                description: "A beautiful modern minimalist house",
                completedDate: "2025-09-15",
                showOnHomepage: true,
                isActive: true,
            }]);
        }
    }, []);

    // Save Data
    useEffect(() => {
        if(portfolios.length > 0) {
            localStorage.setItem("portfolios", JSON.stringify(portfolios));
        }
    }, [portfolios]);

    // Handle Image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData({ ...formData, imageUrl: ev.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Submit
    const handleSubmit = () => {
        if (!formData.title) return alert("Lengkapi data!");
        
        const newPortfolio: Portfolio = {
            id: Date.now(),
            title: formData.title,
            category: formData.category || 'Residential',
            imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", // Fallback image
            description: formData.description || '',
            completedDate: formData.completedDate || new Date().toISOString().split('T')[0],
            showOnHomepage: formData.showOnHomepage || false,
            isActive: true,
        };

        setPortfolios([...portfolios, newPortfolio]);
        setIsModalOpen(false);
        setFormData({ category: 'Residential', showOnHomepage: false, imageUrl: "" }); 
    };

    const handleDelete = (id: number) => {
        if(confirm("Hapus portfolio ini?")) {
            setPortfolios(portfolios.filter(p => p.id !== id));
        }
    };

    const toggleHomepage = (id: number) => {
        setPortfolios(portfolios.map(p => 
            p.id === id ? { ...p, showOnHomepage: !p.showOnHomepage } : p
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Kelola Portfolio</h3>
                    <p className="text-sm text-gray-500">{portfolios.filter(p => p.showOnHomepage).length} Tampil di Homepage</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={16} /> Tambah Portfolio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-100">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2">
                                <button 
                                    onClick={() => handleDelete(item.id)} 
                                    className="p-1.5 bg-white/90 rounded-full hover:bg-red-50 text-red-600 shadow-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900 truncate pr-2">{item.title}</h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">
                                    {item.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{item.description}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <button 
                                    onClick={() => toggleHomepage(item.id)}
                                    className={`text-xs flex items-center gap-1.5 font-medium px-2 py-1 rounded transition-colors ${
                                        item.showOnHomepage 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.showOnHomepage ? <Eye size={14}/> : <EyeOff size={14}/>}
                                    {item.showOnHomepage ? 'Di Homepage' : 'Tersembunyi'}
                                </button>
                                <span className="text-xs text-gray-400">{item.completedDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Tambah Project Baru</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.title || ''}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Interior">Interior</option>
                                    <option value="Architecture">Architecture</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    rows={3}
                                    value={formData.description || ''}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.completedDate || ''}
                                    onChange={e => setFormData({...formData, completedDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Project</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={handleImageUpload}
                                />
                                {formData.imageUrl && (
                                    <div className="mt-2">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded border"/>
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 pt-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={formData.showOnHomepage ?? false}
                                    onChange={e => setFormData({...formData, showOnHomepage: e.target.checked})}
                                />
                                <span className="text-sm text-gray-700">Tampilkan di Homepage</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}