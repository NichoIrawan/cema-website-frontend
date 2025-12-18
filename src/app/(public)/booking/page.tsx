'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, MapPin, Briefcase, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: string;
  time: string;
  notes: string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get('service');

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    serviceType: serviceFromUrl || '',
    time: '',
    notes: '',
  });

  // Get service types from localStorage
  const getServiceTypes = () => {
    const stored = localStorage.getItem('services');
    if (stored) {
      const services = JSON.parse(stored);
      return services.map((s: any) => s.name);
    }
    return [
      'Desain Arsitektur',
      'Desain Interior',
      'Renovasi & Remodeling',
      'Landscape Design',
      'Build & Construction',
      'Konsultasi Desain',
    ];
  };

  const [serviceTypes, setServiceTypes] = useState(getServiceTypes());

  // Update when services change
  useEffect(() => {
    const handleServicesUpdate = () => {
      setServiceTypes(getServiceTypes());
    };

    window.addEventListener('servicesUpdated', handleServicesUpdate);
    window.addEventListener('storage', handleServicesUpdate);

    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdate);
      window.removeEventListener('storage', handleServicesUpdate);
    };
  }, []);

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      id: Date.now(),
      ...formData,
      date: date?.toISOString(),
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success message
    alert('Booking berhasil! Kami akan menghubungi Anda segera.');
    router.push('/');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setFormData({ ...formData, name: value });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setFormData({ ...formData, phone: value });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-[#333333] mb-3 text-3xl sm:text-4xl font-bold">
            Booking Konsultasi
          </h1>
          <p className="text-[#868686] text-base sm:text-lg">
            Jadwalkan konsultasi gratis dengan tim ahli kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-6"
          >
            <h3 className="text-[#333333] mb-5 text-lg sm:text-xl font-semibold ">
              Informasi Booking
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Nama Lengkap
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Masukkan nama lengkap"
                  className="h-11 border-gray-200 focus:border-[#8CC55A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="h-11 border-gray-200 focus:border-[#8CC55A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Nomor Telepon
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+62 812-3456-7890"
                  className="h-11 border-gray-200 focus:border-[#8CC55A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-[#333333] flex items-center gap-2"
                >
                  <MapPin size={16} className="text-[#8CC55A]" />
                  Lokasi Proyek
                </label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Kota/Kabupaten"
                  className="h-11 border-gray-200 focus:border-[#8CC55A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium text-[#333333] flex items-center gap-2"
                >
                  <Briefcase size={16} className="text-[#8CC55A]" />
                  Jenis Layanan
                </label>
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base outline-none transition-all focus:border-[#8CC55A] focus:ring-2 focus:ring-[#8CC55A]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Pilih jenis layanan</option>
                  {serviceTypes.map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-[#333333] flex items-center gap-2"
                >
                  <Clock size={16} className="text-[#8CC55A]" />
                  Waktu Konsultasi
                </label>
                <select
                  id="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base outline-none transition-all focus:border-[#8CC55A] focus:ring-2 focus:ring-[#8CC55A]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Pilih waktu</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-[#333333]"
                >
                  Catatan (Opsional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base outline-none transition-all focus:border-[#8CC55A] focus:ring-2 focus:ring-[#8CC55A]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Ceritakan sedikit tentang proyek Anda..."
                  rows={4}
                />
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#8CC55A] hover:bg-[#7AB84A] text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Pesan Sekarang
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Calendar Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-6"
          >
            <h3 className="text-[#333333] mb-5 text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Calendar size={24} className="text-[#8CC55A]" />
              Pilih Tanggal
            </h3>
            <div className="space-y-4 mb-4">
              <label 
                htmlFor="date"
                className="block text-sm font-medium text-[#333333]"
              >
                Tanggal Konsultasi
              </label>
              <input
                id="date"
                type="date"
                value={date ? date.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setDate(newDate);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base outline-none transition-all focus:border-[#8CC55A] focus:ring-2 focus:ring-[#8CC55A]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              />
            </div>

            <div className="mt-8 p-6 bg-[#F7F7F7] rounded-xl">
              <h4 className="text-[#333333] mb-4 font-semibold">
                Informasi Penting
              </h4>
              <ul className="space-y-3 text-[#868686]">
                <li className="flex items-start gap-3">
                  <span className="text-[#8CC55A] mt-1 flex-shrink-0 font-bold">
                    •
                  </span>
                  <span>Konsultasi pertama gratis (60 menit)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8CC55A] mt-1 flex-shrink-0 font-bold">
                    •
                  </span>
                  <span>Tim kami akan menghubungi Anda untuk konfirmasi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8CC55A] mt-1 flex-shrink-0 font-bold">
                    •
                  </span>
                  <span>Konsultasi dapat dilakukan online atau offline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8CC55A] mt-1 flex-shrink-0 font-bold">
                    •
                  </span>
                  <span>Bawa referensi desain jika ada</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
