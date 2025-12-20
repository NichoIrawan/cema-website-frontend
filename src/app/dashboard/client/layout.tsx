'use client';

import { ClientHeader, ClientNavigation } from '@/components/dashboard/client';

interface ClientDashboardLayoutProps {
    children: React.ReactNode;
}

export default function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
    // TODO: Get from auth context
    const userName = 'John Doe';

    const handleLogout = () => {
        alert('Logout clicked');
    };

    return (
        // Root container: Full viewport, no page scroll
        <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-none">
                <ClientHeader userName={userName} onLogout={handleLogout} />
                <ClientNavigation />
            </div>

            {/* Scrollable Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {children}
            </main>
        </div>
    );
}
