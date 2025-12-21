'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Briefcase, 
    Package, 
    MessageCircle, 
    FileQuestion, 
    FolderKanban, 
    Users, 
    Calculator,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    
    // Logout Handler
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };
    
    // Menu Navigasi Admin
    const tabs = [
        { 
            label: 'Overview', 
            href: '/dashboard/admin', 
            icon: <LayoutDashboard size={18} />,
            activeCheck: (path: string) => path === '/dashboard/admin'
        },
        { 
            label: 'Portfolio', 
            href: '/dashboard/admin/portfolio',
            icon: <Briefcase size={18} />,
            activeCheck: (path: string) => path.includes('/portfolio')
        },
        { 
            label: 'Layanan', 
            href: '/dashboard/admin/service',
            icon: <Package size={18} />,
            activeCheck: (path: string) => path.includes('/service')
        },
        { 
            label: 'Chat Client', 
            href: '/dashboard/admin/chat-client',
            icon: <MessageCircle size={18} />,
            activeCheck: (path: string) => path.includes('/chat-client')
        },
        { 
            label: 'Semua Proyek', 
            href: '/dashboard/admin/projects',
            icon: <FolderKanban size={18} />,
            activeCheck: (path: string) => path.includes('/projects')
        },
        { 
            label: 'User Management', 
            href: '/dashboard/admin/users',
            icon: <Users size={18} />,
            activeCheck: (path: string) => path.includes('/users')
        },
        { 
            label: 'Kalkulator', 
            href: '/dashboard/admin/kalkulator',
            icon: <Calculator size={18} />,
            activeCheck: (path: string) => path.includes('/calculator')
        },
        { 
            label: 'Design Quiz', 
            href: '/dashboard/admin/design-kuis',
            icon: <FileQuestion size={18} />,
            activeCheck: (path: string) => path.includes('/design-kuis')
        },
        { 
            label: 'Chat CS', 
            href: '/dashboard/admin/chat-cs',
            icon: <MessageCircle size={18} />,
            activeCheck: (path: string) => path.includes('/chat-cs')
        },
    ];

    return (
        
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            
            
            <header className="bg-gray-900 text-white border-b border-gray-800 w-full">
                <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">Cema Design Admin</h1>
                                <p className="text-xs text-gray-400">Administrator Panel</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block">Halo, {session?.user?.name || "Admin"}</span>
                            <button 
                                className="flex items-center gap-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-md transition-all text-xs font-medium border border-gray-700 hover:border-red-500"
                                onClick={handleLogout}
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-1 overflow-x-auto py-1 hide-scrollbar" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = tab.activeCheck(pathname);
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`
                                        group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                                        ${isActive
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <span className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}