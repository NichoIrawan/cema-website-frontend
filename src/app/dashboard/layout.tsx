"use client";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


    const isAdminPage = pathname?.startsWith("/dashboard/admin");

    return (
        <main>
            {children}
        </main>
    )
}