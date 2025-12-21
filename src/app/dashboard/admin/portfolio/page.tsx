"use client";

import { useState, useEffect } from 'react';
import type { Portfolio } from '@/lib/types';
import { portfolioService } from '@/services/portfolioService';
import { Trash2, Plus, Eye, EyeOff, Loader2 } from 'lucide-react'; 

export default function PortfolioPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [formData, setFormData] = useState({
        id: '',
        displayName: '',
        category: 'Residential',
        description: '',
        endDate: new Date().toISOString().split('T')[0],
        isShown: false,
        photoUrl: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    // Load Data
    const fetchPortfolios = async () => {
        try {
            setIsLoading(true);
            const data = await portfolioService.getAllPortfolios();
            setPortfolios(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Gagal memuat data portfolio');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    // Handle Image Selection and convert to base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            alert("File terlalu besar (Max 1MB)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, photoUrl: base64String }));
            setPreviewUrl(base64String);
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData({
            id: '',
            displayName: '',
            category: 'Residential',
            description: '',
            endDate: new Date().toISOString().split('T')[0],
            isShown: false,
            photoUrl: '',
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setIsEditing(false);
    };

    // Handle Submit
    const handleSubmit = async () => {
        if (!formData.displayName || !formData.description || !formData.category) {
            return alert("Display Name, Category, End Date, and Description are required");
        }

        try {
            setIsSubmitting(true);
            
            const payload = {
                id: isEditing ? formData.id : Date.now().toString(),
                displayName: formData.displayName,
                category: formData.category,
                description: formData.description,
                endDate: formData.endDate,
                isShown: formData.isShown,
                photoUrl: formData.photoUrl || '',
            };

            if (isEditing) {
                await portfolioService.updatePortfolio(formData.id, payload);
            } else {
                await portfolioService.createPortfolio(payload);
            }

            await fetchPortfolios();
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan portfolio");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(confirm("Hapus portfolio ini?")) {
            try {
                await portfolioService.deletePortfolio(id);
                setPortfolios(portfolios.filter(p => p.id !== id));
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
            
            const updated = await portfolioService.updatePortfolio(portfolio.id, payload);
            
            setPortfolios(portfolios.map(p => 
                p.id === portfolio.id ? updated : p
            ));
        } catch (err) {
            console.error(err);
            alert("Gagal mengupdate status");
        }
    };

    const openEditModal = (portfolio: Portfolio) => {
        setFormData({
            id: portfolio.id,
            displayName: portfolio.displayName,
            category: portfolio.category,
            description: portfolio.description,
            endDate: new Date(portfolio.endDate).toISOString().split('T')[0],
            isShown: portfolio.isShown,
            photoUrl: portfolio.photoUrl,
        });
        setPreviewUrl(portfolio.photoUrl);
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
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Kelola Portfolio</h3>
                    <p className="text-sm text-gray-500">{portfolios.filter(p => p.isShown).length} Tampil di Homepage</p>
                </div>
                <button 
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={16} /> Tambah Portfolio
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-100">
                            {item.photoUrl ? (
                                <img src={item.photoUrl} alt={item.displayName} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="p-1.5 bg-white/90 rounded-full hover:bg-blue-50 text-blue-600 shadow-sm transition-colors"
                                >
                                    <div className="h-4 w-4" /> {/* Edit Icon replacement or verify Lucide import */}
                                    <span className="text-xs font-bold">Edit</span>
                                </button>
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
                                <h4 className="font-semibold text-gray-900 truncate pr-2">{item.displayName}</h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">
                                    {item.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{item.description}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <button 
                                    onClick={() => toggleHomepage(item)}
                                    className={`text-xs flex items-center gap-1.5 font-medium px-2 py-1 rounded transition-colors ${
                                        item.isShown 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.isShown ? <Eye size={14}/> : <EyeOff size={14}/>}
                                    {item.isShown ? 'Di Homepage' : 'Tersembunyi'}
                                </button>
                                <span className="text-xs text-gray-400">{item.endDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">{isEditing ? 'Edit Project' : 'Tambah Project Baru'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.displayName}
                                    onChange={e => setFormData({...formData, displayName: e.target.value})}
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
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})}
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
                                {previewUrl && (
                                    <div className="mt-2 text-center">
                                        <div className="relative inline-block">
                                            <img src={previewUrl} alt="Preview" className="h-32 object-cover rounded border"/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 pt-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={formData.isShown}
                                    onChange={e => setFormData({...formData, isShown: e.target.checked})}
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
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}