'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  features?: string[];
  imageUrl: string;
  category?: string;
  popular?: boolean;
}

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get services from localStorage
  const getServices = (): Service[] => {
    const stored = localStorage.getItem('services');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      {
        id: 1,
        name: 'Desain Arsitektur',
        description: 'Layanan desain arsitektur lengkap untuk rumah tinggal, komersial, dan bangunan publik',
        price: 'Mulai dari Rp 15.000.000',
        features: [
          'Konsep desain 3D',
          'Gambar kerja lengkap',
          'RAB (Rencana Anggaran Biaya)',
          'Revisi unlimited hingga ACC',
          'Konsultasi dengan arsitek',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Architecture',
        popular: true,
      },
      {
        id: 2,
        name: 'Desain Interior',
        description: 'Transformasi ruang interior dengan desain yang fungsional dan estetis',
        price: 'Mulai dari Rp 10.000.000',
        features: [
          'Konsep interior 3D',
          'Pemilihan material & finishing',
          'Furniture custom design',
          'Mood board & color scheme',
          'Project supervision',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjE5MzIwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Interior',
        popular: true,
      },
      {
        id: 3,
        name: 'Renovasi & Remodeling',
        description: 'Renovasi total atau parsial untuk memberikan wajah baru pada bangunan Anda',
        price: 'Mulai dari Rp 8.000.000',
        features: [
          'Survey & analisa kondisi',
          'Desain renovasi',
          'Koordinasi kontraktor',
          'Quality control',
          'Project management',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5vdmF0aW9uJTIwaG91c2V8ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Renovation',
      },
      {
        id: 4,
        name: 'Landscape Design',
        description: 'Desain taman dan landscape untuk menciptakan outdoor space yang menawan',
        price: 'Mulai dari Rp 5.000.000',
        features: [
          'Konsep landscape 3D',
          'Pemilihan tanaman & hardscape',
          'Sistem irigasi',
          'Outdoor lighting design',
          'Maintenance guidance',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Landscape',
      },
      {
        id: 5,
        name: 'Build & Construction',
        description: 'Layanan konstruksi lengkap dari pondasi hingga finishing dengan quality control',
        price: 'Mulai dari Rp 20.000.000',
        features: [
          'Project planning',
          'Material procurement',
          'Skilled workers team',
          'Weekly progress report',
          'Quality assurance',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Construction',
        popular: true,
      },
      {
        id: 6,
        name: 'Konsultasi Desain',
        description: 'Konsultasi profesional untuk mendapatkan solusi terbaik untuk proyek Anda',
        price: 'Rp 500.000 / sesi',
        features: [
          'Durasi 1-2 jam',
          'Diskusi konsep & ide',
          'Rekomendasi material',
          'Estimasi budget',
          'Follow-up support',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdWx0YXRpb24lMjBtZWV0aW5nfGVufDF8fHx8MTc2MTkzMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Consultation',
      },
    ];
  };

  const [services, setServices] = useState<Service[]>(getServices());

  // Update when localStorage changes
  useEffect(() => {
    const handleServicesUpdate = () => {
      setServices(getServices());
    };

    window.addEventListener('servicesUpdated', handleServicesUpdate);
    window.addEventListener('storage', handleServicesUpdate);

    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdate);
      window.removeEventListener('storage', handleServicesUpdate);
    };
  }, []);

  // Get unique categories
  const categories = [
    'All',
    ...Array.from(
      new Set(services.map((s) => s.category).filter(Boolean) as string[])
    ),
  ];

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separate popular and regular services
  const popularServices = filteredServices.filter((s) => s.popular);
  const regularServices = filteredServices.filter((s) => !s.popular);

  // Icon mapping for default services
  const getServiceIcon = (name: string) => {
    const iconMap: Record<string, any> = {
      'Desain Arsitektur': Building2,
      'Desain Interior': Home,
      'Renovasi & Remodeling': Wrench,
      'Landscape Design': Sparkles,
      'Build & Construction': Building2,
      'Konsultasi Desain': ClipboardCheck,
    };
    return iconMap[name] || Package;
  };

  const getServiceColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Desain Arsitektur': '#8CC55A',
      'Desain Interior': '#8CC55A',
      'Renovasi & Remodeling': '#BC5D60',
      'Landscape Design': '#8CC55A',
      'Build & Construction': '#E2B546',
      'Konsultasi Desain': '#8CC55A',
    };
    return colorMap[name] || '#8CC55A';
  };

  const handleNavigate = (page: string, service?: string) => {
    if (page === 'booking' && service) {
      router.push(`/${page}?service=${encodeURIComponent(service)}`);
    } else {
      router.push(`/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#8CC55A]/10 via-white to-[#E2B546]/10 overflow-hidden">
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
            <h1 className="text-[#333333] mb-6">
              Solusi Lengkap untuk Kebutuhan Desain & Konstruksi
            </h1>
            <p className="text-[#868686] text-xl max-w-3xl mx-auto">
              Dari konsep hingga realisasi, kami menyediakan layanan profesional
              untuk mewujudkan ruang impian Anda
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* Search Bar */}
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

              {/* Category Filters */}
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
                        ? 'bg-[#8CC55A] text-white shadow-md'
                        : 'bg-gray-100 text-[#868686] hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Results Count */}
              <div className="text-[#868686]">
                Menampilkan {filteredServices.length} dari {services.length}{' '}
                layanan
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
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
              <h2 className="text-[#333333]">
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
                  icon={getServiceIcon(service.name)}
                  color={getServiceColor(service.name)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularServices.length === 0 && popularServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-[#868686] text-xl mb-4">
                Tidak ada layanan ditemukan
              </div>
              <p className="text-[#868686] mb-8">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="bg-[#8CC55A] hover:bg-[#7AB84A]"
              >
                Reset Filter
              </Button>
            </motion.div>
          ) : (
            regularServices.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-[#333333]">Layanan Lainnya</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularServices.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      onNavigate={handleNavigate}
                      icon={getServiceIcon(service.name)}
                      color={getServiceColor(service.name)}
                    />
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-[#333333] mb-4">
              Mengapa Memilih Company X?
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
                title: 'Pengalaman Terpercaya',
                description:
                  'Lebih dari 10 tahun pengalaman dalam industri desain dan konstruksi',
              },
              {
                icon: Star,
                title: 'Kualitas Terjamin',
                description:
                  'Menggunakan material premium dan dikerjakan oleh tim profesional',
              },
              {
                icon: Check,
                title: 'Garansi Kepuasan',
                description:
                  'Revisi unlimited hingga hasil sesuai dengan keinginan Anda',
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
                <h3 className="text-[#333333] mb-2">{item.title}</h3>
                <p className="text-[#868686]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#8CC55A] to-[#7AB84A] rounded-2xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-white mb-4">
              Mulai Konsultasi Gratis Sekarang
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Dapatkan estimasi biaya dan timeline proyek Anda dalam 24 jam
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => handleNavigate('booking')}
                className="px-8 py-4 bg-white text-[#8CC55A] rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Booking Sekarang <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => handleNavigate('calculator')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
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

// Service Card Component
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Icon Badge */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white">
          <Icon size={24} style={{ color }} />
        </div>

        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-[#E2B546] text-white rounded-lg shadow-lg flex items-center gap-2">
            <Star size={16} fill="currentColor" />
            Popular
          </div>
        )}

        {/* Category Badge */}
        {service.category && !isPopular && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-[#8CC55A] text-white rounded-lg shadow-lg">
            {service.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-[#333333] mb-2">{service.name}</h3>
        <p className="text-[#868686] mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <div className="text-[#8CC55A] mb-4">{service.price}</div>

        {/* Features Preview */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 mb-6 flex-grow">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Check className="text-[#8CC55A] flex-shrink-0 mt-0.5" size={16} />
                <span className="text-[#868686] line-clamp-1">{feature}</span>
              </div>
            ))}
            {service.features.length > 3 && (
              <div className="text-[#868686] text-sm">
                +{service.features.length - 3} fitur lainnya
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <motion.button
          onClick={() => onNavigate('booking', service.name)}
          className="w-full py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
