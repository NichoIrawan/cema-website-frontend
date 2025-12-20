'use client';

const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

export function DetailSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Back link skeleton */}
            <div className={`h-5 w-48 rounded ${shimmerClass} mb-6`} />
            
            {/* Title + Badge skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`h-10 w-2/3 rounded-lg ${shimmerClass}`} />
                <div className={`h-8 w-28 rounded-full ${shimmerClass}`} />
            </div>
            
            {/* Hero image skeleton */}
            <div className={`h-72 w-full rounded-2xl ${shimmerClass} mb-8`} />
            
            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className={`h-40 w-full rounded-xl ${shimmerClass}`} />
                    <div className={`h-32 w-full rounded-xl ${shimmerClass}`} />
                </div>
                <div className="space-y-4">
                    <div className={`h-32 w-full rounded-xl ${shimmerClass}`} />
                    <div className={`h-48 w-full rounded-xl ${shimmerClass}`} />
                </div>
            </div>
        </div>
    );
}
