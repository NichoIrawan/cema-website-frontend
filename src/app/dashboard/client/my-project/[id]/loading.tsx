import { DetailSkeleton } from '../components/DetailSkeleton';

export default function Loading() {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            <DetailSkeleton />
        </div>
    );
}
