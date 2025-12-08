'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    MessageSquare,
    Folder,
    TrendingUp,
    Calendar,
    User,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type UserRole = 'admin' | 'client';

interface SidebarProps {
    role: UserRole;
    userName?: string;
    userEmail?: string;
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: UserRole[];
}

/**
 * Navigation items based on SRS requirements
 * Admin: Chat Client, Project Monitoring, Update Progress
 * Client: My Project (View Progress), Chat Admin, Schedule Meeting
 */
const navItems: NavItem[] = [
    // Admin Items
    {
        label: 'Chat Client',
        href: '/dashboard/admin/chat',
        icon: MessageSquare,
        roles: ['admin'],
    },
    {
        label: 'Project Monitoring',
        href: '/dashboard/admin/projects',
        icon: Folder,
        roles: ['admin'],
    },
    {
        label: 'Update Progress',
        href: '/dashboard/admin/progress',
        icon: TrendingUp,
        roles: ['admin'],
    },
    // Client Items
    {
        label: 'My Project',
        href: '/dashboard/client/projects',
        icon: Folder,
        roles: ['client'],
    },
    {
        label: 'Chat Admin',
        href: '/dashboard/client/chat',
        icon: MessageSquare,
        roles: ['client'],
    },
    {
        label: 'Schedule Meeting',
        href: '/dashboard/client/schedule',
        icon: Calendar,
        roles: ['client'],
    },
];

/**
 * Dashboard Sidebar Component
 * Features: Role-based navigation, Active state, User profile, Mobile collapsible
 */
export function Sidebar({ role, userName = 'User', userEmail = 'user@example.com' }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
            >
                {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:relative lg:translate-x-0',
                    isCollapsed ? '-translate-x-full' : 'translate-x-0'
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center border-b border-gray-200 px-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <span className="text-sm font-bold text-white">CM</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">Dashboard</p>
                            <p className="text-xs text-gray-500 capitalize">{role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsCollapsed(true)}
                                className={cn(
                                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-700' : 'text-gray-500')} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-gray-200 p-4">
                    <div className="mb-3 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
                            <p className="truncate text-xs text-gray-500">{userEmail}</p>
                        </div>
                    </div>
                    <button
                        className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </>
    );
}
