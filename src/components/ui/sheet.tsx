'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    side?: 'left' | 'right';
}

/**
 * Mobile Sheet/Drawer component
 * Used for mobile navigation menu
 */
export function Sheet({ open, onOpenChange, children, side = 'left' }: SheetProps) {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Sheet Panel */}
            <div
                className={cn(
                    'fixed top-0 bottom-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out',
                    side === 'left' ? 'left-0' : 'right-0',
                    open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
                )}
            >
                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </button>

                {/* Content */}
                <div className="h-full overflow-y-auto p-6 pt-16">{children}</div>
            </div>
        </div>
    );
}
