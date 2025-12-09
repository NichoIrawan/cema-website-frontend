export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="bg-gray-50 pt-20 md:pt-24 lg:pt-[6.5vw]">
            {children}
        </main>
    )
}
