"use client"; 

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ChatWidget from '@/components/layout/ChatWidget';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/dashboard/admin");


  if (isAdminPage) {
    return <>{children}</>;
  }


  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </>
  );
}