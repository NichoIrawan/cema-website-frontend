"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  Check,
  Search,
  ArrowRight,
  Package,
  Star,
  TrendingUp,
  Home,
  Building2,
  Wrench,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  title?: string; // Menjaga kompatibilitas data
  description: string;
  price: string;
  features?: string[];
  imageUrl: string;
  image?: string; // Menjaga kompatibilitas data
  category?: string;
  popular?: boolean;
}

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState<Service[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const getServices = (): Service[] => {
    if (typeof window === "undefined") return []; // Safety check
    const stored = localStorage.getItem("services");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Gagal parse data", e);
      }
    }
    return [
      {
        id: 1,
        name: "Desain Arsitektur",
        description:
          "Layanan desain arsitektur lengkap untuk rumah tinggal, komersial, dan bangunan publik",
        price: "Mulai dari Rp 15.000.000",
        features: [
          "Konsep desain 3D",
          "Gambar kerja lengkap",
          "RAB (Rencana Anggaran Biaya)",
          "Revisi unlimited hingga ACC",
          "Konsultasi dengan arsitek",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1080",
        category: "Architecture",
        popular: true,
      },
      {
        id: 2,
        name: "Desain Interior",
        description:
          "Transformasi ruang interior dengan desain yang fungsional dan estetis",
        price: "Mulai dari Rp 10.000.000",
        features: [
          "Konsep interior 3D",
          "Pemilihan material & finishing",
          "Furniture custom design",
          "Mood board & color scheme",
          "Project supervision",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1080",
        category: "Interior",
        popular: true,
      },
      {
        id: 3,
        name: "Renovasi & Remodeling",
        description:
          "Renovasi total atau parsial untuk memberikan wajah baru pada bangunan Anda",
        price: "Mulai dari Rp 8.000.000",
        features: [
          "Survey & analisa kondisi",
          "Desain renovasi",
          "Koordinasi kontraktor",
          "Quality control",
          "Project management",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1080",
        category: "Renovation",
      },
      {
        id: 4,
        name: "Landscape Design",
        description:
          "Desain taman dan landscape untuk menciptakan outdoor space yang menawan",
        price: "Mulai dari Rp 5.000.000",
        features: [
          "Konsep landscape 3D",
          "Pemilihan tanaman & hardscape",
          "Sistem irigasi",
          "Outdoor lighting design",
          "Maintenance guidance",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1080",
        category: "Landscape",
      },
      {
        id: 5,
        name: "Build & Construction",
        description:
          "Layanan konstruksi lengkap dari pondasi hingga finishing dengan quality control",
        price: "Mulai dari Rp 20.000.000",
        features: [
          "Project planning",
          "Material procurement",
          "Skilled workers team",
          "Weekly progress report",
          "Quality assurance",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1080",
        category: "Construction",
        popular: true,
      },
      {
        id: 6,
        name: "Konsultasi Desain",
        description:
          "Konsultasi profesional untuk mendapatkan solusi terbaik untuk proyek Anda",
        price: "Rp 500.000 / sesi",
        features: [
          "Durasi 1-2 jam",
          "Diskusi konsep & ide",
          "Rekomendasi material",
          "Estimasi budget",
          "Follow-up support",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1080",
        category: "Consultation",
      },
    ];
  };

  useEffect(() => {
    setIsMounted(true);
    setServices(getServices());

    const handleUpdate = () => setServices(getServices());
    window.addEventListener("servicesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("servicesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(services.map((s) => s.category).filter(Boolean) as string[])
    ),
  ];

  const filteredServices = services.filter((service) => {
    if (!service) return false;
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const name = service.name || service.title || "";
    const description = service.description || "";
    const search = searchTerm || "";
    return (
      matchesCategory &&
      (name.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const popularServices = filteredServices.filter((s) => s.popular);
  const regularServices = filteredServices.filter((s) => !s.popular);

  const getServiceIcon = (name: string) => {
    const iconMap: Record<string, any> = {
      "Desain Arsitektur": Building2,
      "Desain Interior": Home,
      "Renovasi & Remodeling": Wrench,
      "Landscape Design": Sparkles,
      "Build & Construction": Building2,
      "Konsultasi Desain": ClipboardCheck,
    };
    return iconMap[name] || Package;
  };

  const getServiceColor = (name: string) => {
    const colorMap: Record<string, string> = {
      "Desain Arsitektur": "#8CC55A",
      "Desain Interior": "#8CC55A",
      "Renovasi & Remodeling": "#BC5D60",
      "Landscape Design": "#8CC55A",
      "Build & Construction": "#E2B546",
      "Konsultasi Desain": "#8CC55A",
    };
    return colorMap[name] || "#8CC55A";
  };

  const handleNavigate = (page: string, service?: string) => {
    if (page === "booking" && service) {
      router.push(`/${page}?service=${encodeURIComponent(service)}`);
    } else {
      router.push(`/${page}`);
    }
  };

  // Mencegah error Hydration (Server vs Client content mismatch)
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <section className="relative pt-50 pb-20 bg-gradient-to-br from-[#8CC55A]/10 via-white to-[#E2B546]/10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8CC55A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E2B546]/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 bg-[#8CC55A]/10 rounded-full text-[#8CC55A] border border-[#8CC55A]/20"
            >
              Layanan Kami
            </motion.div>
            <h1 className="text-[#333333] mb-6 font-bold text-4xl">
              Solusi Lengkap untuk Kebutuhan Desain & Konstruksi
            </h1>
            <p className="text-[#868686] text-xl max-w-3xl mx-auto">
              Dari konsep hingga realisasi, kami menyediakan layanan profesional
              untuk mewujudkan ruang impian Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#868686]"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Cari layanan yang Anda butuhkan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-[#8CC55A]"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[#868686]">
                  <Package size={20} />
                  <span>Kategori:</span>
                </div>
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category
                        ? "bg-[#8CC55A] text-white shadow-md"
                        : "bg-gray-100 text-[#868686] hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <div className="text-[#868686]">
                Menampilkan {filteredServices.length} dari {services.length}{" "}
                layanan
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {popularServices.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#E2B546]/10 rounded-full text-[#E2B546] border border-[#E2B546]/20">
                <Star size={20} fill="currentColor" />
                <span>Layanan Populer</span>
              </div>
              <h2 className="text-[#333333] text-3xl font-bold">
                Layanan Paling Banyak Dipilih
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onNavigate={handleNavigate}
                  isPopular
                  icon={getServiceIcon(service.name || service.title || "")}
                  color={getServiceColor(service.name || service.title || "")}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularServices.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-[#333333] text-3xl font-bold">
                  Layanan Lainnya
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularServices.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    onNavigate={handleNavigate}
                    icon={getServiceIcon(service.name || service.title || "")}
                    color={getServiceColor(service.name || service.title || "")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-[#333333] mb-4 text-3xl font-bold">
              Mengapa Memilih Cema Design
            </h2>
            <p className="text-[#868686] text-xl max-w-3xl mx-auto">
              Kami berkomitmen memberikan layanan terbaik dengan standar
              profesional tinggi
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Pengalaman Terpercaya",
                description:
                  "Lebih dari 10 tahun pengalaman dalam industri desain dan konstruksi",
              },
              {
                icon: Star,
                title: "Kualitas Terjamin",
                description:
                  "Menggunakan material premium dan dikerjakan oleh tim profesional",
              },
              {
                icon: Check,
                title: "Garansi Kepuasan",
                description:
                  "Revisi unlimited hingga hasil sesuai dengan keinginan Anda",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-[#F7F7F7] rounded-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8CC55A]/10 rounded-full mb-4">
                  <item.icon className="text-[#8CC55A]" size={32} />
                </div>
                <h3 className="text-[#333333] mb-2 font-bold">{item.title}</h3>
                <p className="text-[#868686]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#8CC55A] to-[#7AB84A] rounded-2xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-white mb-4 text-3xl font-bold">
              Mulai Konsultasi Gratis Sekarang
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Dapatkan estimasi biaya dan timeline proyek Anda dalam 24 jam
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => handleNavigate("booking")}
                className="px-8 py-4 bg-white text-[#8CC55A] rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Booking Sekarang <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => handleNavigate("/")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Coba Kalkulator Estimasi
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  service,
  index,
  onNavigate,
  isPopular,
  icon: Icon,
  color,
}: {
  service: Service;
  index: number;
  onNavigate: (page: string, service?: string) => void;
  isPopular?: boolean;
  icon: any;
  color: string;
}) {
  const displayTitle = service.name || service.title || "Layanan Tanpa Nama";
  const displayImage = service.imageUrl || service.image || "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={displayImage}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white">
          <Icon size={24} style={{ color }} />
        </div>
        {isPopular && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-[#E2B546] text-white rounded-lg shadow-lg flex items-center gap-2">
            <Star size={16} fill="currentColor" /> Popular
          </div>
        )}
        {service.category && !isPopular && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-[#8CC55A] text-white rounded-lg shadow-lg">
            {service.category}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-[#333333] mb-2 text-xl font-bold">
          {displayTitle}
        </h3>
        <p className="text-[#868686] mb-4 line-clamp-2">
          {service.description}
        </p>
        <div className="text-[#8CC55A] mb-4 font-bold">
          Rp.{service.price}/m
        </div>
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 mb-6 flex-grow">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Check
                  className="text-[#8CC55A] flex-shrink-0 mt-0.5"
                  size={16}
                />
                <span className="text-[#868686] line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
        )}
        <motion.button
          onClick={() => onNavigate("booking", displayTitle)}
          className="w-full py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium"
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Konsultasi Gratis <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
