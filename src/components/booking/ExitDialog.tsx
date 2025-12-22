"use client";

import { motion, AnimatePresence } from "motion/react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitDialog({ isOpen, onClose, onConfirm }: ExitDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <Info size={32} className="text-amber-600" />
            </div>
            
            {/* Content */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Keluar dari Booking?</h3>
              <p className="text-slate-500 text-sm">
                Data yang sudah Anda isi akan hilang dan tidak tersimpan. Yakin ingin kembali ke beranda?
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Lanjutkan Booking
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Keluar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
