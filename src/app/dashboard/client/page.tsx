import { redirect } from 'next/navigation';

export default function ClientDashboardPage() {
    // Redirect to the default tab
    redirect('/dashboard/client/my-project');
}
