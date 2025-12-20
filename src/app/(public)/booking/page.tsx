"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  Users,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    method: "",
    locationType: "",
    phone: "",
  });

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const services = [
    { id: "Interior", name: "Design Interior", icon: <Users size={20} /> },
    {
      id: "Konstruksi",
      name: "Jasa Konstruksi",
      icon: <CheckCircle2 size={20} />,
    },
    { id: "Arsitektur", name: "Arsitektur Rumah", icon: <MapPin size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-52 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= s
                  ? "bg-[#8CC55A] text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
          ))}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-0">
            <motion.div
              className="h-full bg-[#8CC55A]"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* STEP 1: PILIH JASA */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Pilih Layanan</h2>
                <p className="text-gray-600">
                  Pilih jasa yang ingin Anda konsultasikan
                </p>
              </div>
              <div className="grid gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFormData({ ...formData, service: s.id })}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                      formData.service === s.id
                        ? "border-[#8CC55A] bg-[#8CC55A]/5 text-[#8CC55A]"
                        : "border-gray-100 hover:border-gray-200 text-black"
                    }`}
                  >
                    <span
                      className={
                        formData.service === s.id
                          ? "text-[#8CC55A]"
                          : "text-black"
                      }
                    >
                      {s.icon}
                    </span>
                    <span className="font-bold">{s.name}</span>
                  </button>
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={!formData.service}
                className="w-full bg-[#8CC55A] hover:bg-[#7AB84A] h-12 text-lg text-white font-bold"
              >
                Lanjut <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          )}

          {/* STEP 2: JADWAL */}
          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center text-black hover:underline text-sm font-medium"
              >
                <ArrowLeft size={16} className="mr-1" /> Kembali
              </button>
              <div>
                <h2 className="text-2xl font-bold text-black">Atur Jadwal</h2>
                <p className="text-gray-600">
                  Pilih waktu yang tersedia (Minimal H+3)
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <Calendar size={16} className="text-[#8CC55A]" /> Pilih
                    Tanggal
                  </label>
                  <Input
                    type="date"
                    min={getMinDate()}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="h-12 border-gray-300 text-black focus:ring-[#8CC55A]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <Clock size={16} className="text-[#8CC55A]" /> Pilih Jam
                  </label>
                  <Input
                    type="time"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="h-12 border-gray-300 text-black focus:ring-[#8CC55A]"
                  />
                </div>
              </div>
              <Button
                onClick={handleNext}
                disabled={!formData.date || !formData.time}
                className="w-full bg-[#8CC55A] hover:bg-[#7AB84A] h-12 text-lg text-white font-bold"
              >
                Metode Konsultasi <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          )}

          {/* STEP 3: METODE & KONTAK */}
          {/* STEP 3: METODE & KONTAK */}
          {/* STEP 3: METODE & KONTAK */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="flex items-center text-black hover:underline text-sm font-bold"
                >
                  <ArrowLeft size={16} className="mr-1" /> Kembali ke Jadwal
                </button>

                {/* Tombol Reset Metode muncul jika sudah milih salah satu */}
                {formData.method && (
                  <button
                    onClick={() =>
                      setFormData({ ...formData, method: "", locationType: "" })
                    }
                    className="text-[#8CC55A] hover:underline text-sm font-bold"
                  >
                    Ganti Metode
                  </button>
                )}
              </div>

              {!formData.method ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      Metode Konsultasi
                    </h2>
                    <p className="text-gray-600">
                      Bagaimana Anda ingin berdiskusi dengan kami?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, method: "online" })
                      }
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#8CC55A] flex flex-col items-center gap-3 transition-all bg-white hover:bg-[#8CC55A]/5 group shadow-sm"
                    >
                      <Video size={32} className="text-[#8CC55A]" />
                      <span className="font-bold text-black group-hover:text-[#8CC55A]">
                        Online (Meet)
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, method: "offline" })
                      }
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-[#8CC55A] flex flex-col items-center gap-3 transition-all bg-white hover:bg-[#8CC55A]/5 group shadow-sm"
                    >
                      <Users size={32} className="text-[#E2B546]" />
                      <span className="font-bold text-black group-hover:text-[#8CC55A]">
                        Offline (Tatap Muka)
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-black">
                    {formData.method === "online"
                      ? "Detail Konsultasi Online"
                      : "Lokasi Pertemuan Tatap Muka"}
                  </h2>

                  {formData.method === "offline" && !formData.locationType ? (
                    <div className="grid gap-3">
                      <Button
                        onClick={() =>
                          setFormData({ ...formData, locationType: "self" })
                        }
                        variant="outline"
                        className="h-14 bg-white text-black border-gray-200 font-bold hover:border-[#8CC55A]"
                      >
                        Saya yang Tentukan Tempat
                      </Button>
                      <Button
                        onClick={() =>
                          setFormData({ ...formData, locationType: "office" })
                        }
                        variant="outline"
                        className="h-14 bg-white text-black border-gray-200 font-bold hover:border-[#8CC55A]"
                      >
                        Saya Datang ke Kantor
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <label className="text-sm font-bold text-black">
                        Masukkan Nomor WhatsApp Aktif
                      </label>
                      <Input
                        placeholder="Contoh: 08123456789"
                        className="h-12 border-gray-300 text-black placeholder:text-gray-400 focus:border-[#8CC55A]"
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />

                      {formData.locationType === "office" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 bg-[#8CC55A]/5 border border-[#8CC55A]/20 rounded-xl space-y-4"
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-black flex items-center gap-2">
                              <MapPin size={18} className="text-[#8CC55A]" />{" "}
                              Lokasi Kantor Kami:
                            </p>
                            <p className="text-black text-sm leading-relaxed">
                              Jl. Sudirman No. 45, Graha Cipta Lt. 2, Jakarta
                              Pusat
                            </p>
                            <p className="text-black text-xs font-bold">
                              Telp: (021) 123456
                            </p>
                          </div>

                          {/* Google Maps Embed */}
                          <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                            <iframe
                              title="Lokasi Kantor"
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.297683955677!2d106.82012717585!3d-6.224424360960589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3fb496739e3%3A0xc3f83768f54e196!2sJl.%20Jend.%20Sudirman%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen={true}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        </motion.div>
                      )}

                      <Button
                        onClick={() => setStep(4)}
                        disabled={!formData.phone}
                        className="w-full bg-[#8CC55A] hover:bg-[#7AB84A] h-12 text-white font-bold shadow-lg mt-4"
                      >
                        Konfirmasi & Selesaikan Booking
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SELESAI */}
          {step === 4 && (
            <div className="text-center py-10 space-y-5">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={80} className="mx-auto text-[#8CC55A]" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-black">
                Booking Terkirim!
              </h2>
              <p className="text-black text-lg max-w-sm mx-auto">
                Tim kami akan menghubungi nomor{" "}
                <span className="font-bold underline">{formData.phone}</span>{" "}
                segera pada jam kerja.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-black text-white px-10 hover:bg-gray-800"
              >
                Tutup
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
