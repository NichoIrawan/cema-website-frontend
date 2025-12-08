import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen">
                {children}
            </div>
            <Footer />
        </>
    );
}
