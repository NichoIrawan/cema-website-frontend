'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../../../components/ui/image-with-fallback';
import {
  Filter,
  Calendar,
  X,
  ArrowRight,
  Grid3x3,
  LayoutGrid,
  Search,
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface PortfolioPageProps {
  onNavigate: (page: string) => void;
}

interface Portfolio {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  completedDate: string;
}

export default function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridView, setGridView] = useState<'2' | '3'>('3');

  // Get portfolios from localStorage
  const getPortfolios = (): Portfolio[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('portfolios');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      {
        id: 1,
        title: 'Modern Minimalist House',
        category: 'Residential',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwaG91c2V8ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'A beautiful modern minimalist house with clean lines and open spaces',
        completedDate: '2025-09-15',
      },
      {
        id: 2,
        title: 'Corporate Office Design',
        category: 'Commercial',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2V8ZW58MXx8fHwxNzYxOTMyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Contemporary office space design for tech company with collaborative zones',
        completedDate: '2025-08-20',
      },
      {
        id: 3,
        title: 'Luxury Villa Interior',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYXxlbnwxfHx8fDE3NjE5MzIwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'High-end interior design for luxury villa with premium materials',
        completedDate: '2025-10-05',
      },
    ];
  };

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  // Initialize portfolios on client-side and update when localStorage changes
  useEffect(() => {
    setPortfolios(getPortfolios());

    const handlePortfolioUpdate = () => {
      setPortfolios(getPortfolios());
    };

    window.addEventListener('portfolioUpdated', handlePortfolioUpdate);
    window.addEventListener('storage', handlePortfolioUpdate);

    return () => {
      window.removeEventListener('portfolioUpdated', handlePortfolioUpdate);
      window.removeEventListener('storage', handlePortfolioUpdate);
    };
  }, []);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(portfolios.map((p) => p.category)))];

  // Filter portfolios
  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesCategory = selectedCategory === 'All' || portfolio.category === selectedCategory;
    const matchesSearch = portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         portfolio.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
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
              Portfolio Kami
            </motion.div>
            <h1 className="text-[#333333] mb-6">
              Proyek yang Telah Kami Kerjakan
            </h1>
            <p className="text-[#868686] text-xl max-w-3xl mx-auto">
              Jelajahi koleksi lengkap proyek desain dan arsitektur yang telah kami selesaikan dengan penuh dedikasi dan kreativitas
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#868686]" size={20} />
                <Input
                  type="text"
                  placeholder="Cari portfolio berdasarkan nama atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-[#8CC55A]"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[#868686]">
                  <Filter size={20} />
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

                {/* Grid View Toggle */}
                <div className="ml-auto flex gap-2">
                  <motion.button
                    onClick={() => setGridView('2')}
                    className={`p-2 rounded-lg transition-all ${
                      gridView === '2'
                        ? 'bg-[#8CC55A] text-white'
                        : 'bg-gray-100 text-[#868686] hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LayoutGrid size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => setGridView('3')}
                    className={`p-2 rounded-lg transition-all ${
                      gridView === '3'
                        ? 'bg-[#8CC55A] text-white'
                        : 'bg-gray-100 text-[#868686] hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid3x3 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-[#868686]">
                Menampilkan {filteredPortfolios.length} dari {portfolios.length} portfolio
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPortfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-[#868686] text-xl mb-4">Tidak ada portfolio ditemukan</div>
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
            <div
              className={`grid grid-cols-1 ${
                gridView === '3' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
              } gap-8`}
            >
              <AnimatePresence mode="popLayout">
                {filteredPortfolios.map((portfolio, index) => (
                  <motion.div
                    key={portfolio.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={portfolio.imageUrl}
                        alt={portfolio.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div className="text-white flex items-center gap-2">
                          <span>Lihat Detail</span>
                          <ArrowRight size={20} />
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-4 py-2 bg-[#8CC55A] text-white rounded-lg shadow-lg">
                        {portfolio.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-[#333333] mb-2">{portfolio.title}</h3>
                      <p className="text-[#868686] mb-4 line-clamp-2">
                        {portfolio.description}
                      </p>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 text-[#868686]">
                        <Calendar size={16} />
                        <span>{formatDate(portfolio.completedDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#8CC55A] to-[#7AB84A] rounded-2xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-white mb-4">
              Siap Memulai Proyek Anda?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Mari wujudkan visi Anda menjadi kenyataan bersama tim profesional kami
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => onNavigate('booking')}
                className="px-8 py-4 bg-white text-[#8CC55A] rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Konsultasi Gratis <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Hubungi Kami
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Detail Dialog */}
      <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-8 mt-12">
          {selectedPortfolio && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#333333]">
                  {selectedPortfolio.title}
                </DialogTitle>
                <DialogDescription className="text-[#868686]">
                  Detail lengkap portfolio proyek
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Image */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedPortfolio.imageUrl}
                    alt={selectedPortfolio.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[#868686] mb-2">Kategori</div>
                    <div className="inline-block px-4 py-2 bg-[#8CC55A]/10 text-[#8CC55A] rounded-lg border border-[#8CC55A]/20">
                      {selectedPortfolio.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#868686] mb-2">Tanggal Selesai</div>
                    <div className="flex items-center gap-2 text-[#333333]">
                      <Calendar size={20} className="text-[#8CC55A]" />
                      <span>{formatDate(selectedPortfolio.completedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-[#868686] mb-2">Deskripsi</div>
                  <p className="text-[#333333] leading-relaxed">
                    {selectedPortfolio.description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setSelectedPortfolio(null);
                      onNavigate('booking');
                    }}
                    className="flex-1 bg-[#8CC55A] hover:bg-[#7AB84A]"
                  >
                    Booking Konsultasi
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPortfolio(null);
                      onNavigate('contact');
                    }}
                    variant="outline"
                    className="flex-1 border-[#8CC55A] text-[#8CC55A] hover:bg-[#8CC55A]/10 bg-white"
                  >
                    Hubungi Kami
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
