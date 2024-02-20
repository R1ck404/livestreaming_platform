import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Eye, Play, Radio, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Button } from '../ui/button';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';


export default function MainHero() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [stream, setStream] = useState<any>(null);

    useEffect(() => {
        async function fetchMostPopular() {
            try {
                const stream = await client.collection('streams').getFirstListItem('is_live=true', { expand: 'user', sort: 'viewers' }).catch(() => null);
                if (!stream) return;
                const img = client.files.getUrl(stream, stream.thumbnail);
                stream.thumbnail = img;

                setStream(stream);
            } catch (error) {
                return;
            }
        }

        fetchMostPopular();
        setIsClient(true);

    }, []);

    return (
        <header className='h-full relative rounded-lg flex flex-col p-6'>
            <div className="relative w-full h-[30rem]">
                {isClient ? (
                    <>
                        {stream ? (
                            <>
                                <Image src={stream?.thumbnail} layout="fill" className="rounded-lg w-full h-full z-10 clip-path-hero" alt={''} style={{ objectFit: "cover" }} />
                                <div className="bg-accent absolute -bottom-2 -left-2 rounded-lg w-full h-full z-0 clip-path-hero"></div>

                                <div className="absolute z-20 p-5 flex flex-col">
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <Badge className="text-white bg-red-500 w-fit">
                                            <Radio size={22} />
                                            <span className="ml-1 uppercase font-bold">Live</span>
                                        </Badge>
                                        <Badge className="text-white bg-black/20 backdrop-blur-md hover:bg-slate-500 w-fit">
                                            <Eye size={22} />
                                            <span className="ml-1 uppercase font-bold">
                                                {stream?.viewers ?? 0} Viewers
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="flex-row mt-4 space-y-5">
                                        <div className="space-y-4">
                                            <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl text-white'>{stream?.title}</h1>
                                        </div>
                                        <div className="flex items-center flex-row space-x-2 text-white">
                                            <Avatar >
                                                <AvatarFallback>
                                                    {stream?.expand?.user?.username[0].toUpperCase()}
                                                </AvatarFallback>
                                                <AvatarImage src="" />
                                            </Avatar>
                                            <span className='font-semibold text-lg'>
                                                {stream?.expand?.user?.username}
                                            </span>
                                        </div>
                                        <Link href={"/stream/" + stream?.stream_key} style={{ clipPath: 'polygon(0 0, 93% 0, 100% 30%, 100% 100%, 80% 100%, 7% 100%, 0 78%, 0% 30%)' }} className="flex items-center bg-white hover:bg-gray-200/80 w-36 justify-center transition-all overflow-hidden rounded px-2 py-3">
                                            <Play className="text-black font-bold" />
                                            <span className="ml-2 text-sm text-black font-bold uppercase">
                                                Watch now
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <LoadingSkeleton nostreamers />
                        )}
                    </>
                ) : (
                    <LoadingSkeleton />
                )}
            </div>
        </header>
    );
}

const LoadingSkeleton = ({ nostreamers }: { nostreamers?: boolean }) => {
    return (
        <div className='relative w-full h-full'>
            <Skeleton className="rounded-lg w-full h-full z-20 clip-path-hero bg-muted absolute" />
            {nostreamers && (
                <h1 className='font-bold text-4xl text-gray-500 absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Nobody is currently live.</h1>
            )}
        </div>
    )
}