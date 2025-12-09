'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';

interface ClientDashboardLayoutProps {
    children: React.ReactNode;
}

export default function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
    const pathname = usePathname();
    const userName = 'John Doe'; // TODO: Get from auth context

    const tabs = [
        { id: 'my-project', label: 'My Project', href: '/dashboard/client/my-project' },
        { id: 'schedule', label: 'Schedule', href: '/dashboard/client/schedule' },
        { id: 'chat', label: 'Chat', href: '/dashboard/client/chat' },
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header - Different styling from Admin */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Welcome, {userName}</h1>
                            <p className="text-sm text-gray-600 mt-1">Track your project and collaborate with our team</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Tabs Navigation */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-2 overflow-x-auto py-2">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`
                                        px-6 py-2.5 text-sm font-medium whitespace-nowrap rounded-t transition-colors
                                        ${isActive
                                            ? 'bg-white text-gray-900 border-t-2 border-gray-200 border-t-gray-900'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </main>
    );
}
