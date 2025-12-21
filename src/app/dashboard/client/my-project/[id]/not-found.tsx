export default function NotFound() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Proyek Tidak Ditemukan</h2>
                <p className="text-slate-500 mb-4">Proyek yang Anda cari tidak tersedia.</p>
                <a 
                    href="/dashboard/client/my-project"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#8CC540] text-white rounded-lg hover:bg-[#76a536] transition-colors"
                >
                    Kembali ke Daftar Proyek
                </a>
            </div>
        </div>
    );
}
