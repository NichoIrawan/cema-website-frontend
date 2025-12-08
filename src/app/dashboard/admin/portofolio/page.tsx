"use client";
import { useState, useEffect } from 'react';
import type { Portfolio } from '@/lib/types';
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react'; 

export function PortfolioTab() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    
    const [formData, setFormData] = useState<Partial<Portfolio>>({
        category: 'Residential',
        showOnHomepage: false,
    });

   
    useEffect(() => {
        const stored = localStorage.getItem("portfolios");
        if (stored) {
            setPortfolios(JSON.parse(stored));
        } else {
            
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

    
    useEffect(() => {
        if(portfolios.length > 0) {
            localStorage.setItem("portfolios", JSON.stringify(portfolios));
        }
    }, [portfolios]);

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

    const handleSubmit = () => {
        if (!formData.title || !formData.imageUrl) return alert("Lengkapi data!");
        
        const newPortfolio: Portfolio = {
            id: Date.now(),
            title: formData.title,
            category: formData.category || 'Residential',
            imageUrl: formData.imageUrl,
            description: formData.description || '',
            completedDate: formData.completedDate || new Date().toISOString(),
            showOnHomepage: formData.showOnHomepage || false,
            isActive: true,
        };

        setPortfolios([...portfolios, newPortfolio]);
        setIsModalOpen(false);
        setFormData({ category: 'Residential', showOnHomepage: false }); // Reset form
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
                    <h3 className="font-bold text-lg">Kelola Portfolio</h3>
                    <p className="text-sm text-gray-500">{portfolios.filter(p => p.showOnHomepage).length} Tampil di Homepage</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                    <Plus size={16} /> Tambah Portfolio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg overflow-hidden group">
                        <div className="relative h-48">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"/>
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleDelete(item.id)} className="p-1bg-white/80 rounded-full hover:bg-red-100 text-red-600 bg-white">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{item.title}</h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded">{item.category}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <button 
                                    onClick={() => toggleHomepage(item.id)}
                                    className={`text-xs flex items-center gap-1 ${item.showOnHomepage ? 'text-green-600' : 'text-gray-400'}`}
                                >
                                    {item.showOnHomepage ? <Eye size={14}/> : <EyeOff size={14}/>}
                                    {item.showOnHomepage ? 'Tampil di Home' : 'Sembunyi'}
                                </button>
                                <span className="text-xs text-gray-400">{item.completedDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Tambah Project</h3>
                        <div className="space-y-4">
                            <input 
                                type="text" placeholder="Judul Project" className="w-full p-2 border rounded"
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                            <select 
                                className="w-full p-2 border rounded"
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Interior">Interior</option>
                            </select>
                            <textarea 
                                placeholder="Deskripsi" className="w-full p-2 border rounded" rows={3}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                            <input 
                                type="date" className="w-full p-2 border rounded"
                                onChange={e => setFormData({...formData, completedDate: e.target.value})}
                            />
                            <div>
                                <label className="block text-sm mb-1">Foto Project</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm"/>
                            </div>
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded"/>
                            )}
                            <label className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={formData.showOnHomepage}
                                    onChange={e => setFormData({...formData, showOnHomepage: e.target.checked})}
                                />
                                <span className="text-sm">Tampilkan di Homepage</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}