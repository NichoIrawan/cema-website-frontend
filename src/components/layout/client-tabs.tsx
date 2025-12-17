'use client';

import { useState } from 'react';
import type { TabConfig } from '@/lib/types';
import { CustomButton } from '@/components/ui/custom-button';

interface ClientTabsLayoutProps {
    tabs: TabConfig[];
    defaultTab?: string;
    userName?: string;
}

export function ClientTabsLayout({ tabs, defaultTab, userName = 'Client' }: ClientTabsLayoutProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

    const currentTab = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TODO: Apply final Client Dashboard Design here */}

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

            {/* Horizontal Tabs Navigation - Different styling from Admin */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-2 overflow-x-auto py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  px-6 py-2.5 text-sm font-medium whitespace-nowrap rounded-t transition-colors
                  ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 border-t-2 border-gray-200 border-t-gray-900'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentTab?.content || (
                    <div className="p-10 border-2 border-dashed border-gray-300 rounded bg-white text-center text-gray-500">
                        Content for {currentTab?.label}
                    </div>
                )}
            </div>
        </div>
    );
}
