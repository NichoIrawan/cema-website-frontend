import ChatWidget from "@/components/layout/ChatWidget";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    
    return (
        <>
            <main className="min-h-screen">
                {children}
            </main>
        </>
    );
}
