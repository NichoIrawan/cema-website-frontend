import { Sidebar } from '@/components/layout/sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Dashboard Layout
 * Features: Sidebar with role-based navigation, Scrollable content area
 * TODO: Get actual user role from auth context/session
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // TODO: Replace with actual user data from auth context
    const userRole: 'admin' | 'client' = 'client'; // This should come from authentication
    const userName = 'John Doe';
    const userEmail = 'john@example.com';

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar - Fixed width on desktop, collapsible on mobile */}
            <Sidebar role={userRole} userName={userName} userEmail={userEmail} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
