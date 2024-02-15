import { ScrollArea } from "@radix-ui/react-scroll-area";
import StreamPreview from "./stream-preview";
import { ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";

export default function PopularStreamers() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [streams, setStreams] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStreams() {
            setIsClient(true);
            const user_id = client.authStore.model?.id;
            if (!user_id) return;

            const response = await fetch("/api/metrics/recommended_streams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id, should_be_live: true })
            });

            const res = await response.json();
            const fetchedStreams = res.streams;
            setIsFetching(false);

            const updatedStreams = fetchedStreams && await Promise.all(fetchedStreams?.map(async (stream: any) => {
                const userResponse = await client.collection('users').getOne(stream.user, { expand: 'user' }).catch(() => null);
                const thumbnail = client.files.getUrl(stream, stream.thumbnail)
                stream.expand = { user: userResponse ?? null };
                stream.thumbnail = thumbnail;

                return stream;
            }));

            setStreams(updatedStreams);
        }

        fetchStreams();
    }, []);

    return (
        <section className='h-full relative rounded-lg flex flex-col px-6'>
            <h1 className='font-bold text-2xl'>Recommended Streamers</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
                {isClient ? (
                    <>
                        {(!streams || streams?.length === 0) && (
                            <div className="w-full h-64">
                                <h1>
                                    No streamers are live right now
                                </h1>
                            </div>
                        )}
                        {streams?.map((stream, i) => (
                            <StreamPreview
                                key={i}
                                title={stream.title}
                                viewers={stream.viewers ?? 0}
                                isLive={true}
                                streamer={stream!.expand.user.username}
                                game={stream.game}
                                image={stream.thumbnail}
                                stream_id={stream.stream_key}
                            />
                        ))}
                    </>
                ) : (
                    <LoadingSkeleton />
                )}
            </div>
        </section>
    );
}

const LoadingSkeleton = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <div className="space-y-1 w-full" key={i}>

                    <Skeleton className="w-full h-48" />
                    <Skeleton className="w-52 h-6" />
                    <div className="flex space-x-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col space-y-1 justify-center">
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}