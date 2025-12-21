import { FolderKanban, Calendar, MessageCircle } from 'lucide-react';

export interface NavTab {
    label: string;
    href: string;
    icon: React.ReactNode;
    activeCheck: (path: string) => boolean;
}

export const clientNavTabs: NavTab[] = [
    {
        label: 'My Project',
        href: '/dashboard/client/my-project',
        icon: <FolderKanban size={18} />,
        activeCheck: (path: string) => path.includes('/my-project') || path === '/dashboard/client'
    },
    {
        label: 'Schedule',
        href: '/dashboard/client/schedule',
        icon: <Calendar size={18} />,
        activeCheck: (path: string) => path.includes('/schedule')
    },
    {
        label: 'Chat',
        href: '/dashboard/client/chat',
        icon: <MessageCircle size={18} />,
        activeCheck: (path: string) => path.includes('/chat')
    },
];
