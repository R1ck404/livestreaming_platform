import { ScrollArea } from "@radix-ui/react-scroll-area";
import StreamPreview from "./stream-preview";
import { ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { getDateDaysAgo } from "@/lib/utils";

export default function RecentlyWatched() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [streams, setStreams] = useState<any[]>([]);

    const filter_date = getDateDaysAgo(7);

    useEffect(() => {
        async function fetchStreams() {
            setIsClient(true);
            const user_id = client.authStore.model?.id;
            if (!user_id) return;

            //`(user=${user_id}" && created >= "${filter_date}" && type="view")`
            const recent_view_metrics = await client.collection('user_metrics').getList(1, 5, { filter: `(user="${user_id}" && created >= "${filter_date}" && interaction_type="view" && stream.is_live=true && stream.user != "${user_id}")`, expand: "stream,stream.user" });
            console.log(recent_view_metrics);
            if (!recent_view_metrics || !recent_view_metrics.items) return;

            const streams = (recent_view_metrics.items as any).map((metric: any) => metric);
            setStreams(streams);
        }

        try {

            fetchStreams();
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }, []);

    return (
        <section className='h-fit relative rounded-lg flex flex-col px-6'>
            <h1 className='font-bold text-2xl'>Recently watched</h1>

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
                        {streams?.map((obj, i) => {
                            console.log(obj);
                            const stream = obj?.expand?.stream;

                            if (!stream) return null;
                            stream.img = client.files.getUrl(stream, stream.thumbnail);
                            console.log(stream);

                            return <StreamPreview
                                key={i}
                                title={stream.title}
                                viewers={stream.viewers ?? 0}
                                isLive={true}
                                streamer={stream?.expand?.user.username ?? ""}
                                game={stream.game}
                                image={stream.img}
                                stream_id={stream.stream_key}
                            />
                        })}
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