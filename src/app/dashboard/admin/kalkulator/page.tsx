"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Calculator,
  RefreshCw,
  LayoutGrid,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";

interface CalculatorSettings {
  materials: {
    standard: number;
    premium: number;
    luxury: number;
  };
  roomPrice: number;
}

interface ServiceItem {
  _id: string;
  title: string;
  price: string;
  category: string;
}

interface SimulationState {
  area: number;
  serviceId: string;
  material: "standard" | "premium" | "luxury";
  rooms: number;
}

export default function CalculatorPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Mengambil session dan status dari NextAuth
  const { data: session, status } = useSession();

  const [settings, setSettings] = useState<CalculatorSettings>({
    materials: { standard: 1.0, premium: 1.4, luxury: 1.8 },
    roomPrice: 0,
  });

  const [services, setServices] = useState<ServiceItem[]>([]);

  const [sim, setSim] = useState<SimulationState>({
    area: 100,
    serviceId: "",
    material: "standard",
    rooms: 3,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // === 1. LOAD DATA DARI API ===
  useEffect(() => {
    // Tunggu sampai status authentikasi selesai loading
    if (status === "loading") return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // [SESUAI NEXT-AUTH.D.TS] Ambil token langsung dari root session
        const token = session?.accessToken;

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const [settingsRes, servicesRes] = await Promise.all([
          fetch(`${API_URL}/calculator/settings`, { headers }),
          fetch(`${API_URL}/services`, { headers }),
        ]);

        if (!settingsRes.ok) {
          console.error("Gagal load settings:", settingsRes.status);
        } else {
          const settingsData = await settingsRes.json();
          const realData = settingsData.data || settingsData;

          if (realData) {
            setSettings({
              materials: realData.materials || {
                standard: 1.0,
                premium: 1.4,
                luxury: 1.8,
              },
              roomPrice: realData.pricePerRoom ?? 0,
            });
          }
        }

        if (!servicesRes.ok) {
          console.error("Gagal load services:", servicesRes.status);
        } else {
          const servicesData = await servicesRes.json();
          if (
            servicesData.status === "ok" &&
            Array.isArray(servicesData.data)
          ) {
            setServices(servicesData.data);
            if (servicesData.data.length > 0) {
              setSim((prev) => ({
                ...prev,
                serviceId: servicesData.data[0]._id,
              }));
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_URL, session, status]);

  // === 2. SIMPAN KE API (PUT) ===
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // [SESUAI NEXT-AUTH.D.TS] Ambil token lagi untuk aksi simpan
      const token = session?.accessToken;

      if (!token) {
        alert("Sesi tidak valid atau kadaluarsa. Silakan login ulang.");
        return;
      }

      const payload = {
        pricePerRoom: settings.roomPrice,
        materials: settings.materials,
      };

      const res = await fetch(`${API_URL}/calculator/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const errData = await res.json();
        alert(`Gagal menyimpan: ${errData.message || "Unauthorized"}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getSelectedServicePrice = () => {
    const selected = services.find((s) => s._id === sim.serviceId);
    return selected ? Number(selected.price) : 0;
  };

  const calculateSimulation = () => {
    const servicePrice = getSelectedServicePrice();
    const basePrice =
      sim.area * servicePrice * settings.materials[sim.material];
    const roomCost = sim.rooms * settings.roomPrice;
    return basePrice + roomCost;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  // Jika user tidak login (dan halaman ini diproteksi)
  if (status === "unauthenticated") {
    return (
      <div className="p-10 text-center">Akses Ditolak. Silakan Login.</div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-gray-700">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <h4 className="font-bold text-sm">Berhasil Disimpan!</h4>
              <p className="text-xs text-gray-400">
                Database telah diperbarui.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-gray-500 hover:text-white"
            >
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
            <h3 className="font-bold text-lg text-gray-800">
              Pengaturan Kalkulator Harga
            </h3>
            <p className="text-sm text-gray-500">
              Sesuaikan logika perhitungan & multiplier
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Admin Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-8">
          {/* Harga Layanan */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                1
              </span>
              Harga Layanan (Live dari Database)
            </h4>
            <div className="space-y-4">
              {services.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada data layanan.</p>
              ) : (
                services.map((srv) => (
                  <div key={srv._id}>
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {srv.title}{" "}
                      <span className="text-xs text-gray-400">
                        ({srv.category})
                      </span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 pl-3 p-2 rounded text-gray-500 cursor-not-allowed"
                        value={formatRupiah(Number(srv.price))}
                      />
                    </div>
                  </div>
                ))
              )}
              <p className="text-xs text-blue-500 italic mt-2">
                * Untuk mengubah harga dasar layanan, silakan edit melalui menu
                "Daftar Layanan" (Services).
              </p>
            </div>
          </div>

          {/* Biaya Ruangan */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                2
              </span>
              Biaya Tambahan Per Ruangan
            </h4>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Harga Partisi/Ruangan
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                  value={settings.roomPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      roomPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Multiplier Material */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <span className="bg-green-100 text-green-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                3
              </span>
              Faktor Pengali Material
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(settings.materials).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 block mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full border border-gray-300 p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        materials: {
                          ...settings.materials,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <span className="text-xs text-gray-400 block text-center mt-1">
                    x (kali)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-4 rounded-lg transition-colors font-medium shadow-lg shadow-blue-200"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan Kalkulator"}
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Preview */}
        <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-gray-400 uppercase text-xs font-bold tracking-wider">
              <RefreshCw size={14} /> Live Preview (Tampilan User)
            </div>

            <div className="space-y-5 flex-1">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                    <LayoutGrid size={12} /> Luas Bangunan
                  </label>
                  <span className="font-bold text-gray-800 text-sm">
                    {sim.area} m²
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={sim.area}
                  onChange={(e) =>
                    setSim({ ...sim, area: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Jenis Layanan
                </label>
                <select
                  className="w-full mt-1 border border-gray-200 p-2 rounded-lg text-sm bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={sim.serviceId}
                  onChange={(e) =>
                    setSim({ ...sim, serviceId: e.target.value })
                  }
                >
                  {services.map((srv) => (
                    <option key={srv._id} value={srv._id}>
                      {srv.title} ({formatRupiah(Number(srv.price))})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Kualitas Material
                </label>
                <div className="flex gap-2 mt-2">
                  {(["standard", "premium", "luxury"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSim({ ...sim, material: m })}
                      className={`flex-1 py-2 text-xs rounded-md border capitalize transition-all ${
                        sim.material === m
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {m} <br />{" "}
                      <span className="text-[10px] opacity-80">
                        x{settings.materials[m]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-gray-100">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">
                    Jumlah Ruangan
                  </label>
                  <span className="font-bold text-gray-800 text-sm">
                    {sim.rooms} Ruangan
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={sim.rooms}
                  onChange={(e) =>
                    setSim({ ...sim, rooms: Number(e.target.value) })
                  }
                  className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  + {formatRupiah(settings.roomPrice)} / ruangan
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
              <p className="text-gray-500 text-sm mb-1">Estimasi Total Biaya</p>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-green-600">
                  {formatRupiah(calculateSimulation())}
                </h2>
              </div>
              <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100 space-y-1">
                <div className="flex justify-between">
                  <span>Biaya Konstruksi:</span>
                  <span className="font-medium">
                    {formatRupiah(
                      sim.area *
                        getSelectedServicePrice() *
                        settings.materials[sim.material]
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Biaya Ruangan ({sim.rooms}x):</span>
                  <span className="font-medium">
                    + {formatRupiah(sim.rooms * settings.roomPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
