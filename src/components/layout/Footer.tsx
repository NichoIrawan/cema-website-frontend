import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            {/* TODO: Apply final Footer Design here */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            PT Cipta Maharupa Abadi
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Solusi terpercaya untuk desain interior, arsitektur, dan renovasi bangunan Anda.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+62 xxx xxxx xxxx</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>info@ciptamaharupa.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Beranda', href: '/' },
                                { label: 'Layanan', href: '/services' },
                                { label: 'Portofolio', href: '/portfolio' },
                                { label: 'Tentang Kami', href: '/about' },
                                { label: 'Kontak', href: '/contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5 text-[#000000]" />
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5 text-[#000000]" />
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5 text-[#000000]" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} PT Cipta Maharupa Abadi. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
