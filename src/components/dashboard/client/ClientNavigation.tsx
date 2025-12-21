'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clientNavTabs } from './navigationConfig';

export function ClientNavigation() {
    const pathname = usePathname();

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex gap-1 overflow-x-auto py-1 hide-scrollbar" aria-label="Tabs">
                    {clientNavTabs.map((tab) => {
                        const isActive = tab.activeCheck(pathname);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`
                                    group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                                    ${isActive
                                        ? 'border-[#8CC540] text-[#8CC540] bg-lime-50/50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                    }
                                `}
                            >
                                <span className={`${isActive ? 'text-[#8CC540]' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
