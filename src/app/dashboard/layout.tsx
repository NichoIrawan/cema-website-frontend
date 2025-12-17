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
        <main 
            className={`bg-gray-50 ${
               
                isAdminPage 
                    ? "p-0" 
                    
                    : "bg-gray-50 pt-20 md:pt-24 lg:pt-[6.5vw]"
            }`}
        >
            {children}
        </main>
    )
}