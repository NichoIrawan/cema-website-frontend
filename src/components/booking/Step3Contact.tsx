"use client";

import { motion } from "motion/react";
import { Video, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step3Props {
  isLoggedIn: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any;
  formData: {
    method: string;
    guestName: string;
    guestPhone: string;
  };
  onMethodSelect: (method: "online" | "offline") => void;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Contact({ 
  isLoggedIn, 
  userData, 
  formData, 
  onMethodSelect,
  onNameChange,
  onPhoneChange,
  onNext, 
  onBack 
}: Step3Props) {
  return (
    <div className="space-y-8">
      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onMethodSelect('online')}
          className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center h-32 transition-all ${formData.method === 'online' ? 'bg-[#8CC540]/10 border-[#8CC540]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
        >
          <Video className={formData.method === 'online' ? "text-[#8CC540]" : "text-slate-400"} />
          <span className={`font-bold ${formData.method === 'online' ? 'text-[#8CC540]' : 'text-slate-600'}`}>Online Meeting</span>
        </div>
        <div 
          onClick={() => onMethodSelect('offline')}
          className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center h-32 transition-all ${formData.method === 'offline' ? 'bg-[#8CC540]/10 border-[#8CC540]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
        >
          <Users className={formData.method === 'offline' ? "text-[#8CC540]" : "text-slate-400"} />
          <span className={`font-bold ${formData.method === 'offline' ? 'text-[#8CC540]' : 'text-slate-600'}`}>Offline / Visit</span>
        </div>
      </div>

      {isLoggedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#8CC540]">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-bold">Logged in as:</p>
              <p className="text-lg font-bold text-slate-900">{userData?.name}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Nomor WhatsApp (Dapat diedit)</label>
            <Input 
              value={formData.guestPhone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="h-12 bg-white border-slate-200"
              placeholder="08123456789"
            />
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 block">Nama Lengkap</label>
            <Input 
              value={formData.guestName}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-12 border-slate-300 focus:ring-[#8CC540]" 
              placeholder="Masukkan nama lengkap" 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1 block">Nomor WhatsApp</label>
            <Input 
              value={formData.guestPhone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="h-12 border-slate-300 focus:ring-[#8CC540]" 
              placeholder="e.g. 08123456789" 
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="h-14 px-8 border-slate-200 text-slate-600 hover:bg-slate-50">
          Kembali
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!formData.method || (!isLoggedIn && (!formData.guestName || !formData.guestPhone))}
          className="h-14 flex-1 bg-[#8CC540] hover:bg-[#7AB84A] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#8CC540]/20"
        >
          Review & Konfirmasi
        </Button>
      </div>
    </div>
  );
}
