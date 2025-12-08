"use client";

import { useState, useEffect } from 'react';
import type { ServiceItem } from '@/lib/types'; 
import { Trash2, Plus, Check, X } from 'lucide-react';

// PERUBAHAN DI SINI: Gunakan 'export default'
export default function ServicesPage() {
    // State menggunakan tipe data ServiceItem
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<ServiceItem>>({
        price: 0,
        isActive: true,
        showOnHomepage: false,
        image: ""
    });

    // Load data dari LocalStorage saat pertama kali render
    useEffect(() => {
        const stored = localStorage.getItem("services");
        if (stored) {
            setServices(JSON.parse(stored));
        } else {
            // Default Data jika kosong
            setServices([{
                id: 1, 
                title: "Desain Interior",
                description: "Layanan desain interior lengkap",
                price: 10000000,
                duration: "4 bulan",
                image: "", 
                isActive: true,
                showOnHomepage: true
            }]);
        }
    }, []);

    // Simpan ke LocalStorage setiap kali state services berubah
    useEffect(() => {
        if(services.length > 0) {
            localStorage.setItem("services", JSON.stringify(services));
        }
    }, [services]);

    // Handle Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData({ ...formData, image: ev.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if(!formData.title) return alert("Nama layanan wajib diisi!");
        
        const newService: ServiceItem = {
            id: Date.now(), 
            title: formData.title || "",
            description: formData.description || "",
            price: formData.price || 0,
            duration: formData.duration || "",
            image: formData.image || "",
            isActive: formData.isActive ?? true,
            showOnHomepage: formData.showOnHomepage ?? false
        };

        setServices([...services, newService]);
        setIsModalOpen(false);
        setFormData({ price: 0, isActive: true, showOnHomepage: false, image: "" });
    };

    const handleDelete = (id: number) => {
        if(confirm("Yakin ingin menghapus layanan ini?")) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800">Daftar Layanan</h3>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={16} /> Tambah Layanan
                </button>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Layanan</th>
                            <th className="px-6 py-3">Harga</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Homepage</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada layanan.
                                </td>
                            </tr>
                        ) : (
                            services.map(service => (
                                <tr key={service.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {service.image && (
                                                <img src={service.image} alt={service.title} className="w-8 h-8 rounded object-cover border" />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{service.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{service.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        Rp {service.price?.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {service.showOnHomepage ? 
                                                <Check size={18} className="text-green-600"/> : 
                                                <X size={18} className="text-gray-300"/>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(service.id)} 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                                            title="Hapus Layanan"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah Layanan */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                     <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Tambah Layanan Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                         </div>
                         
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                    placeholder="Contoh: Renovasi Rumah" 
                                    value={formData.title || ''}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    type="number" 
                                    placeholder="0" 
                                    value={formData.price || ''}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi Pengerjaan</label>
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    placeholder="Contoh: 2 minggu" 
                                    value={formData.duration || ''}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Layanan</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={handleImageUpload}
                                />
                                {formData.image && (
                                    <div className="mt-2">
                                        <img src={formData.image} alt="Preview" className="h-20 w-auto rounded border" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    rows={3}
                                    placeholder="Jelaskan detail layanan..." 
                                    value={formData.description || ''}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                     <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={formData.isActive ?? true}
                                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                    /> 
                                     <span className="text-sm text-gray-700">Status Aktif</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                     <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={formData.showOnHomepage ?? false}
                                        onChange={e => setFormData({...formData, showOnHomepage: e.target.checked})}
                                    /> 
                                     <span className="text-sm text-gray-700">Tampilkan di Halaman Utama</span>
                                </label>
                            </div>
                         </div>

                         <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                             <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            >
                                Batal
                             </button>
                             <button 
                                onClick={handleSave} 
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Simpan Layanan
                             </button>
                         </div>
                     </div>
                 </div>
            )}
        </div>
    );
}