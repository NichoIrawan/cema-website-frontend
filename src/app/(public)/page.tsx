'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  Home,
  Building2,
  Wrench,
  ArrowRight,
  Calculator,
  ClipboardCheck,
  Sparkles,
  DollarSign,
  Check,
} from 'lucide-react';
import { Slider } from '../../components/ui/slider';
import DesignQuizUser from '@/components/ui/DesignQuizUser';

// --- 1. Tambahkan Interface Settings agar Typescript paham struktur data Admin ---
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
  roomPrice: number;
}

interface ServiceItem {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  price?: string;
  color: string;
  image: string;
  features: string[];
}

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface ServiceOption {
  value: 'interior' | 'architecture' | 'renovation'; // Diperketat tipenya
  label: string;
}

interface MaterialOption {
  value: 'standard' | 'premium' | 'luxury'; // Diperketat tipenya
  label: string;
}

interface Stat {
  number: string;
  label: string;
}

export default function HomePage() {
  const onNavigate = (page: string) => {
    window.location.href = `/${page}`;
  };

  // Calculator state
  const [area, setArea] = useState([100]);
  const [serviceType, setServiceType] = useState<'interior' | 'architecture' | 'renovation'>('interior');
  const [materialType, setMaterialType] = useState<'standard' | 'premium' | 'luxury'>('standard');
  const [roomCount, setRoomCount] = useState([3]);
  const [showResult, setShowResult] = useState(false);

  // --- 2. State untuk menyimpan Settingan dari Admin ---
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
    roomPrice: 2000000
  });

  // --- 3. Load Settings dari LocalStorage (Bagian yang sebelumnya hilang) ---
  useEffect(() => {
    // Load Portfolios & Services (Existing code)
    setPortfolioItems(getPortfolios());
    setServices(getServices());

    // Load Calculator Settings (NEW CODE)
    const storedCalc = localStorage.getItem("calculatorSettings");
    if (storedCalc) {
      try {
        const parsedData = JSON.parse(storedCalc);
        setSettings(prev => ({
          ...prev,
          ...parsedData,
          services: { ...prev.services, ...parsedData.services },
          materials: { ...prev.materials, ...parsedData.materials },
          roomPrice: parsedData.roomPrice ?? prev.roomPrice
        }));
      } catch (e) {
        console.error("Gagal load setting kalkulator", e);
      }
    }
  }, []);

  const serviceOptions: ServiceOption[] = [
    { value: 'interior', label: 'Desain Interior' },
    { value: 'architecture', label: 'Arsitektur' },
    { value: 'renovation', label: 'Renovasi' },
  ];

  const materialOptions: MaterialOption[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'luxury', label: 'Luxury' },
  ];

  // --- 4. Update Rumus agar sesuai dengan Admin Panel ---
  const calculateEstimate = () => {
    // Ambil harga dari state 'settings' yang sudah di-load dari localStorage
    const hargaDasarPerMeter = settings.services[serviceType];
    const multiplierMaterial = settings.materials[materialType];
    const biayaRuangan = settings.roomPrice * roomCount[0];

    // Rumus: (Luas * HargaLayanan * Multiplier) + (Biaya Ruangan)
    const total = (area[0] * hargaDasarPerMeter * multiplierMaterial) + biayaRuangan;
    
    return total;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  // Get portfolios from localStorage
  const getPortfolios = (): PortfolioItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('portfolios');
    if (stored) {
      const portfolios = JSON.parse(stored);
      const featuredPortfolios = portfolios.filter((p: any) => p.showOnHomepage && p.isActive !== false);
      const activePortfolios = portfolios.filter((p: any) => p.isActive !== false);
      const itemsToShow = featuredPortfolios.length > 0 ? featuredPortfolios : activePortfolios;
      return itemsToShow.slice(0, 4).map((p: any): PortfolioItem => ({
        id: p.id,
        title: p.title,
        category: p.category,
        image: p.imageUrl,
      }));
    }
    return [
      {
        id: 1,
        title: 'Luxury Villa Design',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjE4ODEzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 2,
        title: 'Modern Living Space',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjE4MTQyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 3,
        title: 'Contemporary Kitchen',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYxODMyMzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 4,
        title: 'Elegant Bedroom',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2MTg2OTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ];
  };

  const getServices = (): ServiceItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('services');
    if (stored) {
      const storedServices = JSON.parse(stored);
      const serviceMap: Record<string, { icon: any; color: string; image: string }> = {
        'Desain Arsitektur': {
          icon: Building2,
          color: '#8CC55A',
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        'Desain Interior': {
          icon: Home,
          color: '#8CC55A',
          image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjE5MzIwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        'Renovasi & Remodeling': {
          icon: Wrench,
          color: '#BC5D60',
          image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5vdmF0aW9uJTIwaG91c2V8ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        'Landscape Design': {
          icon: Sparkles,
          color: '#8CC55A',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        'Build & Construction': {
          icon: Building2,
          color: '#E2B546',
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        'Konsultasi Desain': {
          icon: ClipboardCheck,
          color: '#8CC55A',
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdWx0YXRpb24lMjBtZWV0aW5nfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      };

      const featuredServices = storedServices.filter((s: any) => s.showOnHomepage && s.isActive);
      const activeServices = storedServices.filter((s: any) => s.isActive);
      const itemsToShow = featuredServices.length > 0 ? featuredServices : activeServices;

      return itemsToShow.slice(0, 3).map((s: any): ServiceItem => {
        const defaults = serviceMap[s.name] || {
          icon: Home,
          color: '#8CC55A',
          image: 'https://images.unsplash.com/photo-1611001440648-e90aff42faa3',
        };

        return {
          id: s.id,
          icon: defaults.icon,
          title: s.name,
          description: s.description,
          price: s.price,
          color: defaults.color,
          image: s.imageUrl || defaults.image,
          features: s.features || [],
        };
      });
    }

    return [
      {
        id: 1,
        icon: Building2,
        title: 'Desain Arsitektur',
        description: 'Layanan desain arsitektur lengkap untuk rumah tinggal, komersial, dan bangunan publik',
        price: 'Mulai dari Rp 15.000.000',
        color: '#8CC55A',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Konsep desain 3D', 'Gambar kerja lengkap', 'RAB (Rencana Anggaran Biaya)', 'Revisi unlimited hingga ACC'],
      },
      {
        id: 2,
        icon: Home,
        title: 'Desain Interior',
        description: 'Transformasi ruang interior dengan desain yang fungsional dan estetis',
        price: 'Mulai dari Rp 10.000.000',
        color: '#8CC55A',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjE5MzIwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Konsep interior 3D', 'Pemilihan material & finishing', 'Furniture custom design', 'Mood board & color scheme'],
      },
      {
        id: 3,
        icon: Wrench,
        title: 'Renovasi & Remodeling',
        description: 'Renovasi total atau parsial untuk memberikan wajah baru pada bangunan Anda',
        price: 'Mulai dari Rp 8.000.000',
        color: '#BC5D60',
        image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5vdmF0aW9uJTIwaG91c2V8ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Survey & analisa kondisi', 'Desain renovasi', 'Koordinasi kontraktor', 'Quality control'],
      },
      {
        id: 4,
        icon: Sparkles,
        title: 'Landscape Design',
        description: 'Desain taman dan landscape untuk menciptakan outdoor space yang menawan',
        price: 'Mulai dari Rp 5.000.000',
        color: '#8CC55A',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Konsep landscape 3D', 'Pemilihan tanaman & hardscape', 'Sistem irigasi', 'Outdoor lighting design'],
      },
      {
        id: 5,
        icon: Building2,
        title: 'Build & Construction',
        description: 'Layanan konstruksi lengkap dari pondasi hingga finishing dengan quality control',
        price: 'Mulai dari Rp 20.000.000',
        color: '#E2B546',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Project planning', 'Material procurement', 'Skilled workers team', 'Weekly progress report'],
      },
      {
        id: 6,
        icon: ClipboardCheck,
        title: 'Konsultasi Desain',
        description: 'Konsultasi profesional untuk mendapatkan solusi terbaik untuk proyek Anda',
        price: 'Rp 500.000 / sesi',
        color: '#8CC55A',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdWx0YXRpb24lMjBtZWV0aW5nfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        features: ['Durasi 1-2 jam', 'Diskusi konsep & ide', 'Rekomendasi material', 'Estimasi budget'],
      },
    ];
  };

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Side by Side Layout */}
      <section className="relative py-20 bg-gradient-to-br from-[#F7F7F7] via-white to-[#F7F7F7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-block mb-6 px-6 py-2 bg-[#8CC55A]/10 rounded-full text-[#8CC55A] border border-[#8CC55A]/20"
              >
                Arsitektur & Desain Interior Profesional
              </motion.div>
              <h1 className="text-[#333333] mb-6 text-4xl lg:text-5xl font-bold leading-tight">
                Wujudkan Hunian Impian Anda Bersama CEMA Design
              </h1>
              <p className="text-[#868686] text-lg mb-10 leading-relaxed">
                Layanan lengkap dari konsep hingga realisasi untuk menciptakan ruang yang sempurna sesuai visi Anda
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => onNavigate('booking')}
                  className="px-8 py-4 bg-[#8CC55A] text-white rounded-lg hover:bg-[#7AB84A] transition-colors inline-flex items-center gap-2 shadow-lg font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Konsultasi Gratis <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  onClick={() => {
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white text-[#8CC55A] border-2 border-[#8CC55A] rounded-lg hover:bg-[#8CC55A] hover:text-white transition-colors inline-flex items-center gap-2 shadow-lg font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calculator size={20} /> Hitung Estimasi
                </motion.button>
              </div>
            </motion.div>

            {/* Right - 3D Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block pt-12"
            >
              <div className="relative w-full max-w-2xl mx-auto">
                <img
                  src='/images/3d-model-house.png'
                  alt="3D Interior Design"
                  className="w-full h-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {([
              { number: '500+', label: 'Proyek Selesai' },
              { number: '15+', label: 'Tahun Pengalaman' },
              { number: '98%', label: 'Kepuasan Klien' },
              { number: '50+', label: 'Tim Profesional' },
            ] as Stat[]).map((stat: Stat, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl text-[#8CC55A] font-bold mb-2">{stat.number}</div>
                <div className="text-[#868686] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section - Enhanced with 3D Visuals */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[#333333] mb-4 font-bold text-4xl">Layanan Terbaik Kami</h2>
            <p className="text-[#868686] max-w-2xl mx-auto text-lg">
              Solusi lengkap untuk semua kebutuhan arsitektur dan desain interior Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: ServiceItem, index: number) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
              >
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white">
                    <service.icon size={24} style={{ color: service.color }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-[#333333] mb-2">{service.title}</h3>
                  <p className="text-[#868686] mb-4 line-clamp-2">{service.description}</p>

                  {/* Price */}
                  {service.price && (
                    <div className="text-[#8CC55A] mb-4">{service.price}</div>
                  )}

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="mb-6 space-y-2 flex-grow">
                      {service.features.slice(0, 4).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="text-[#8CC55A] flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-[#868686]">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <div className="text-[#868686] text-sm">
                          +{service.features.length - 4} fitur lainnya
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => onNavigate('booking')}
                    className="w-full py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    style={{ backgroundColor: service.color }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Konsultasi Gratis <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-12">
            <motion.button
              onClick={() => onNavigate('services')}
              className="px-8 py-4 border-2 border-[#8CC55A] text-[#8CC55A] rounded-lg hover:bg-[#8CC55A] hover:text-white transition-colors inline-flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Semua Layanan <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights - Horizontal Scroll */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[#333333] mb-4 font-bold text-4xl">Portfolio Kami</h2>
            <p className="text-[#868686]">
              Lihat beberapa proyek terbaik yang telah kami kerjakan
            </p>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
            {portfolioItems.map((item: PortfolioItem, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-80 snap-center cursor-pointer"
              >
                <div className="relative h-96 rounded-lg overflow-hidden group">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <div className="text-[#8CC55A] mb-2">{item.category}</div>
                      <h3 className="text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <motion.button
              onClick={() => onNavigate('portfolio')}
              className="px-6 py-3 border-2 border-[#8CC55A] text-[#8CC55A] rounded-lg hover:bg-[#8CC55A] hover:text-white transition-colors inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Semua Portfolio <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-white" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Calculator size={64} className="mx-auto mb-4 text-[#8CC55A]" />
          <h2 className="text-[#333333] mb-4">Kalkulator Estimasi Biaya</h2>
          <p className="text-[#868686] max-w-2xl mx-auto">
            Hitung perkiraan biaya proyek desain Anda dengan mudah
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-[#F7F7F7] rounded-lg shadow-lg p-8"
          >
            <h3 className="text-[#333333] mb-6">Input Detail Proyek</h3>

            <div className="space-y-8">
              {/* Building Area */}
              <div>
                <label className="block text-[#333333] mb-2">
                  <Home className="inline mr-2" size={18} />
                  Luas Bangunan
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={area}
                    onValueChange={setArea}
                    min={20}
                    max={500}
                    step={10}
                    className="flex-1"
                  />
                  
                  <div className="w-24 text-center">
                    <span className="text-[#333333]">{area[0]} m²</span>
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-[#333333] mb-2">
                  <Sparkles className="inline mr-2" size={18} />
                  Jenis Layanan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {serviceOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setServiceType(option.value as any)}
                      className={`p-4 rounded-lg border-2 transition-colors ${serviceType === option.value
                          ? 'border-[#8CC55A] bg-[#8CC55A]/10'
                          : 'border-gray-200 hover:border-[#8CC55A]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-[#333333]">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-[#333333] mb-2">
                  <Sparkles className="inline mr-2" size={18} />
                  Kualitas Material
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {materialOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setMaterialType(option.value as any)}
                      className={`p-4 rounded-lg border-2 transition-colors ${materialType === option.value
                          ? 'border-[#8CC55A] bg-[#8CC55A]/10'
                          : 'border-gray-200 hover:border-[#8CC55A]'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-[#333333]">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Room Count */}
              <div>
                <label className="block text-[#333333] mb-2">
                  Jumlah Ruangan
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={roomCount}
                    onValueChange={setRoomCount}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <div className="w-24 text-center">
                    <span className="text-[#333333]">{roomCount[0]} ruangan</span>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <motion.button
                onClick={handleCalculate}
                className="w-full bg-[#8CC55A] text-white py-3 rounded-lg hover:bg-[#7AB84A] transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calculator size={20} />
                Hitung Estimasi
              </motion.button>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Estimate Result */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-[#333333] mb-4">
                <DollarSign className="inline mr-2" size={20} />
                Estimasi Biaya
              </h4>
              {showResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-[#8CC55A] rounded-lg text-white text-center">
                    <div className="mb-2">Total Estimasi</div>
                    <div className="text-2xl font-bold">{formatCurrency(calculateEstimate())}</div>
                  </div>
                  <div className="text-[#868686]">
                    <p className="mb-2">Rincian:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Luas: {area[0]} m²</li>
                      <li>• Layanan: {serviceOptions.find((s) => s.value === serviceType)?.label}</li>
                      <li>• Material: {materialOptions.find((m) => m.value === materialType)?.label}</li>
                      <li>• Ruangan: {roomCount[0]} ruangan</li>
                    </ul>
                  </div>
                  <motion.button
                    onClick={() => onNavigate('booking')}
                    className="w-full bg-[#E2B546] text-white py-2 rounded-lg hover:bg-[#D1A435] transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Booking Konsultasi
                  </motion.button>
                </motion.div>
              ) : (
                <div className="text-center text-[#868686] py-8">
                  <Calculator size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Isi form dan klik "Hitung Estimasi"</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-[#E2B546]/10 border border-[#E2B546] rounded-lg p-6">
              <div className="text-[#E2B546] mb-3 font-medium">💡 Catatan</div>
              <ul className="space-y-2 text-[#868686] text-sm">
                <li>• Estimasi ini adalah perkiraan kasar</li>
                <li>• Harga final dapat berbeda</li>
                <li>• Konsultasi gratis untuk detail lebih lanjut</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* CTA Section - Design Quiz */}
      <section className="py-20 bg-[#F7F7F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <DesignQuizUser />

      </div>
    </div>
  </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[#333333] mb-4 font-bold text-4xl">Apa Kata Klien Kami</h2>
            <p className="text-[#868686]">
              Kepuasan klien adalah prioritas utama kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_: number, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_: any, i: number) => (
                    <span key={i} className="text-[#E2B546]">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[#868686] mb-4">
                  "Sangat puas dengan hasil desain dari Company X. Tim sangat profesional
                  dan memahami kebutuhan kami."
                </p>
                <div>
                  <div className="text-[#333333]">Budi Santoso</div>
                  <div className="text-[#868686]">Jakarta</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}