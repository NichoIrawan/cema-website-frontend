'use client';

import { useState } from 'react';
import type { TabConfig } from '@/lib/types';

interface AdminTabsLayoutProps {
    tabs: TabConfig[];
    defaultTab?: string;
}

export function AdminTabsLayout({ tabs, defaultTab }: AdminTabsLayoutProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

    const currentTab = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TODO: Apply final Admin Dashboard Design here */}

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your projects and services</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Horizontal Tabs Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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
