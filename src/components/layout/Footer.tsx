'use client';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[#333333] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-[#8CC55A] mb-4">PT Cipta Maharupa Abadi</h3>
                        <p className="text-[#868686]">
                            Solusi terpercaya untuk arsitektur dan desain interior Anda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4">Link Cepat</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/portfolio"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/myproject"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    My Project
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4">Kontak</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <Phone size={18} className="text-[#8CC55A] mt-1 flex-shrink-0" />
                                <span className="text-[#868686]">+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail size={18} className="text-[#8CC55A] mt-1 flex-shrink-0" />
                                <span className="text-[#868686]">info@cema.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={18} className="text-[#8CC55A] mt-1 flex-shrink-0" />
                                <span className="text-[#868686]">
                                    Jl. Contoh No. 123, Jakarta, Indonesia
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* FAQ & Social */}
                    <div>
                        <h4 className="mb-4">FAQ</h4>
                        <ul className="space-y-2 mb-6">
                            <li>
                                <a href="#" className="text-[#868686] hover:text-[#8CC55A] transition-colors">
                                    Cara Booking?
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#868686] hover:text-[#8CC55A] transition-colors">
                                    Biaya Konsultasi?
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#868686] hover:text-[#8CC55A] transition-colors">
                                    Durasi Proyek?
                                </a>
                            </li>
                        </ul>

                        <h4 className="mb-4">Ikuti Kami</h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                            >
                                <Facebook size={24} />
                            </a>
                            <a
                                href="#"
                                className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                            >
                                <Instagram size={24} />
                            </a>
                            <a
                                href="#"
                                className="text-[#868686] hover:text-[#8CC55A] transition-colors"
                            >
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#868686] mt-8 pt-8 text-center text-[#868686]">
                    <p>&copy; 2025 PT Cipta Maharupa Abadi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
