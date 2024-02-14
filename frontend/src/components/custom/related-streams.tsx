import { Skeleton } from "../ui/skeleton";

type RelatedStreamsProps = {
    stream_id: string | null;
    stream_key: string | null;
};

export default function RelatedStreams({ stream_key }: RelatedStreamsProps) {
    return (
        <div className="flex flex-col w-full">
            <h1 className="font-bold text-xl">
                Related Streams
            </h1>

            <div className="flex flex-col space-y-2 mt-4">
                <div className="flex space-x-2">
                    <div className="w-1/4 h-24 bg-muted rounded-xl"></div>
                    <div className="w-3/4 h-24 bg-muted rounded-xl"></div>
                </div>
                <div className="flex space-x-2">
                    <div className="w-1/4 h-24 bg-muted rounded-xl"></div>
                    <div className="w-3/4 h-24 bg-muted rounded-xl"></div>
                </div>
                <div className="flex space-x-2">
                    <div className="w-1/4 h-24 bg-muted rounded-xl"></div>
                    <div className="w-3/4 h-24 bg-muted rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}

const LoadingSkeleton = () => {
    return (
        <div className="flex flex-col w-full">
            <h1 className="font-bold text-xl">
                <Skeleton className="w-24 h-6" />
            </h1>

            <div className="flex flex-col space-y-2 mt-4">
                <div className="flex space-x-2">
                    <Skeleton className="w-1/4 h-24 rounded-xl" />
                    <Skeleton className="w-3/4 h-24 rounded-xl" />
                </div>
                <div className="flex space-x-2">
                    <Skeleton className="w-1/4 h-24 rounded-xl" />
                    <Skeleton className="w-3/4 h-24 rounded-xl" />
                </div>
                <div className="flex space-x-2">
                    <Skeleton className="w-1/4 h-24 rounded-xl" />
                    <Skeleton className="w-3/4 h-24 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export { LoadingSkeleton as RelatedStreamsSkeleton };