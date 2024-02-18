"use client";

import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import DefaultLayout from '@/components/custom/default-layout';
import StreamVideo from '@/components/custom/stream/StreamVideo';
import StreamChat, { StreamChatSkeleton } from '@/components/custom/stream/StreamChat';
import StreamDescription from '@/components/custom/stream/StreamDescription';
import RelatedStreams, { RelatedStreamsSkeleton } from '@/components/custom/related-streams';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';
import { Skeleton } from '@/components/ui/skeleton';
import { deepComparison } from '@/lib/utils';

export default function Page() {
    const client = createBrowserClient();
    const pathname = usePathname();
    const stream_key = pathname?.split('/').pop();
    const [stream, setStream] = useState<any>(null);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const stream = await client.collection('streams').getFirstListItem(`stream_key="${stream_key}"`, { expand: 'user' });

                if (stream) {
                    setStream(stream);
                }

                await client.collection('streams').subscribe(stream.id, (new_stream) => {
                    // const difference = deepComparison(stream, new_stream);

                    // if (Object.keys(difference).length <= 0) {
                    //     return;
                    // }

                    setStream(stream);
                });
            } catch (error) {
                setStream({
                    exists: false
                })
            }
        }

        fetchStream();
    }, []);

    return (
        <DefaultLayout>
            <div className="p-6 flex flex-col">
                {stream !== null && stream?.exists === false && (
                    <div className="flex justify-center items-center h-96">
                        <h1 className="text-4xl font-bold">Stream not found</h1>
                    </div>
                )}

                {stream === null && (
                    <LoadingSkeleton />
                )}

                {stream !== null && stream?.exists !== false && (
                    <>
                        <div className="flex space-x-4">
                            <div className="w-3/4 !rounded-xl overflow-hidden sm:flex-col">
                                <StreamVideo
                                    stream_key={stream_key ?? null}
                                    isLive={stream?.is_live}
                                    title={stream?.title ?? 'Stream offline'}
                                    streamer={stream?.expand?.user}
                                    viewers={stream?.viewers ?? 0}
                                />
                            </div>
                            <div className="w-1/4">
                                <StreamChat stream_key={stream_key ?? null} stream_id={stream?.id} stream_settings={stream?.settings ?? {}} />
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <div className="w-3/4">
                                <StreamDescription
                                    stream_key={stream_key ?? null}
                                    username={stream?.expand?.user?.username ?? 'Unknown'}
                                    description={stream?.description ?? 'This stream is currently offline.'}
                                />
                            </div>
                            <div className="w-1/4">
                                <RelatedStreams stream_key={stream_key ?? null} stream_id={stream?.id} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}

const LoadingSkeleton = () => {
    return (
        <div className='w-full h-full'>
            <div className="flex space-x-4">
                <div className="w-3/4">
                    <Skeleton className="w-full h-full" />
                </div>
                <div className="w-1/4 border rounded-xl">
                    <StreamChatSkeleton />
                </div>
            </div>

            <div className="flex space-x-4 mt-4">
                <div className="w-3/4">
                    <Skeleton className="w-full h-80" />
                </div>
                <div className="w-1/4">
                    <RelatedStreamsSkeleton />
                </div>
            </div>
        </div>
    );
}