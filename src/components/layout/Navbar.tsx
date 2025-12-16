'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import Link from 'next/link';
import { CustomButton } from '@/components/ui/custom-button';
import { UserMenu } from '@/components/layout/user-menu';
import type { User, NavItem } from '@/lib/types';
import { UserRole } from '@/lib/types';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // TODO: Replace with actual auth state from context/session
    const isLoggedIn = true; // Change this based on actual auth state
    const user: User = {
        id: '1',
        name: 'Admin',
        role: UserRole.ADMIN,
        email: 'admin@email.com'
    };

    const menuItems: NavItem[] = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
        { id: 'services', label: 'Services', href: '/services' },
        { id: 'about', label: 'About Us', href: '/about' },
        { id: 'contact', label: 'Contact Us', href: '/contact' },
    ];

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed left-0 top-0 w-full z-[1000]">
            <nav
                className="w-full px-[5vw] py-[1.11vw] flex flex-row items-center"
                style={{
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(1.11rem)',
                    WebkitBackdropFilter: 'blur(1.11rem)',
                }}
            >
                {/* Logo */}
                <Link href="/">
                    <motion.div
                        className="cursor-pointer h-16 md:h-[4vw] min-h-[3rem] max-h-[5rem]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <ImageWithFallback
                            src="/images/Cema_Logo.png"
                            alt="Cema Logo"
                            className="h-full w-auto object-contain"
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex flex-row gap-6 list-none ml-auto items-center">
                    {menuItems.map((item) => (
                        <motion.li
                            key={item.id}
                            className="text-[0.67rem] lg:text-[0.875rem] text-black cursor-pointer relative"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Link href={item.href}>
                                <motion.span
                                    className="relative inline-block"
                                    initial={false}
                                    animate={
                                        isActive(item.href)
                                            ? { color: '#000000' }
                                            : { color: '#000000' }
                                    }
                                >
                                    {item.label}
                                    {/* Animated underline */}
                                    <motion.span
                                        className="absolute left-0 bottom-0 w-full h-[1px] bg-black"
                                        initial={false}
                                        animate={
                                            isActive(item.href)
                                                ? { scaleX: 1, opacity: 1 }
                                                : { scaleX: 0, opacity: 0 }
                                        }
                                        whileHover={{ scaleX: 1, opacity: 1 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        style={{
                                            originX: 0,
                                            transformOrigin: 'left',
                                            bottom: '-0.3rem',
                                        }}
                                    />
                                </motion.span>
                            </Link>
                        </motion.li>
                    ))}

                    {/* Auth Section */}
                    <li className="ml-4">
                        {isLoggedIn ? (
                            <UserMenu user={user} />
                        ) : (
                            <Link href="/login">
                                <CustomButton variant="default" size="sm">
                                    Login
                                </CustomButton>
                            </Link>
                        )}
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden ml-auto text-[#333333]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 border-t border-gray-200 overflow-hidden"
                        style={{
                            backdropFilter: 'blur(1.11rem)',
                            WebkitBackdropFilter: 'blur(1.11rem)',
                        }}
                    >
                        <div className="px-4 py-4 space-y-3">
                            {menuItems.map((item) => (
                                <Link key={item.id} href={item.href}>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block w-full text-left px-4 py-2 rounded-lg ${isActive(item.href)
                                            ? 'bg-[#8CC55A] text-white'
                                            : 'text-black hover:bg-[#F7F7F7]'
                                            } transition-colors`}
                                    >
                                        {item.label}
                                    </button>
                                </Link>
                            ))}

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-gray-200">
                                {isLoggedIn ? (
                                    <div className="space-y-2">
                                        <div className="px-4 py-2">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.role}</p>
                                        </div>
                                        <Link href="/dashboard">
                                            <button className="block w-full text-left px-4 py-2 rounded-lg text-black hover:bg-[#F7F7F7] transition-colors">
                                                Dashboard
                                            </button>
                                        </Link>
                                        <CustomButton variant="destructive" size="sm" className="w-full">
                                            Logout
                                        </CustomButton>
                                    </div>
                                ) : (
                                    <Link href="/login">
                                        <CustomButton variant="default" size="sm" className="w-full">
                                            Login
                                        </CustomButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
