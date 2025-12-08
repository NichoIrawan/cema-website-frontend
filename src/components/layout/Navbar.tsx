'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavItem } from '@/lib/types';

const navigationItems: NavItem[] = [
    { label: 'Beranda', href: '/' },
    { label: 'Layanan', href: '/services' },
    { label: 'Portofolio', href: '/portfolio' },
    { label: 'Quiz', href: '/quiz' },
    { label: 'Kalkulator', href: '/calculator' },
    { label: 'Booking', href: '/booking' },
    { label: 'Kontak', href: '/contact' },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            {/* TODO: Apply final Navbar Design here */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            PT Cipta Maharupa Abadi
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        <div className="flex gap-6">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2 text-gray-700 hover:text-gray-900"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-2 border-t border-gray-200">
                            <Link
                                href="/login"
                                className="block w-full px-4 py-2 text-center border border-gray-300 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full px-4 py-2 text-center bg-gray-900 text-white rounded hover:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
