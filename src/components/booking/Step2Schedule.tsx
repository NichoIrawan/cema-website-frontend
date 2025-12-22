"use client";

import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "./CustomCalendar";
import { TIME_SLOTS, formatDate } from "./helpers";

interface Step2Props {
  formData: {
    date: string;
    time: string;
  };
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Schedule({ 
  formData, 
  onDateSelect,
  onTimeSelect,
  onNext, 
  onBack 
}: Step2Props) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Calendar */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <CalendarIcon size={18} className="text-[#8CC540]"/> Pilih Tanggal
          </label>
          
          <div className="max-w-[360px]">
            <CustomCalendar 
              selectedDate={formData.date}
              onSelectDate={onDateSelect}
            />
          </div>
          
          <p className="text-xs text-slate-400">*Minimal pemesanan H+3 dari hari ini.</p>
        </div>

        {/* Right: Time Slots */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Clock size={18} className="text-[#8CC540]"/> Pilih Jam
          </label>
          
          {formData.date ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 font-medium">
                Ketersediaan pada <span className="text-[#8CC540]">{formatDate(formData.date)}</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map(time => (
                  <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`
                      py-3 px-4 rounded-lg text-sm font-bold border transition-all
                      ${formData.time === time 
                        ? 'bg-[#8CC540] border-[#8CC540] text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#8CC540]'
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <CalendarIcon size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Pilih tanggal terlebih dahulu</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="h-14 px-8 border-slate-200 text-slate-600 hover:bg-slate-50">
          Kembali
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!formData.date || !formData.time}
          className="h-14 flex-1 bg-[#8CC540] hover:bg-[#7AB84A] text-white text-lg font-bold rounded-xl shadow-lg shadow-[#8CC540]/20"
        >
          Lanjut ke Detail
        </Button>
      </div>
    </div>
  );
}
