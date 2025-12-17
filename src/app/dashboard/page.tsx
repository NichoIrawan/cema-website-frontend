import { redirect } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { UserRole as Role } from '@/lib/types';

export default function DashboardPage() {
    // TODO: Get actual user from auth context/session
    // For now, using mock data
    const user: User | null = {
        id: '1',
        name: 'Admin',
        email: 'admin@email.com',
        role: Role.ADMIN // Change to Role.CLIENT to test client redirect
    };

    // If not authenticated, redirect to login
    if (!user) {
        redirect('/login');
    }

    // Redirect based on user role
    if (user.role === Role.ADMIN) {
        redirect('/dashboard/admin');
    } else if (user.role === Role.CLIENT) {
        redirect('/dashboard/client/my-project');
    }

    // Fallback for guest or unknown roles
    redirect('/');
}
