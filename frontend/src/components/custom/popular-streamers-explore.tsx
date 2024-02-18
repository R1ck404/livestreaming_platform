import { ScrollArea } from "@radix-ui/react-scroll-area";
import StreamPreview from "./stream-preview";
import { ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Eye, Radio } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import Link from "next/link";

type StreamPreviewProps = {
    title: string;
    viewers: number;
    isLive: boolean;
    streamer: string;
    game: string;
    image: string;
    stream_id: string;
}

export default function PopularStreamersExplore() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [streams, setStreams] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStreams() {
            const res = await client.collection('streams').getList(0, 5, { expand: 'user', filter: 'is_live=true' });

            const data = res.items.map((item: any) => {
                const img = client.files.getUrl(item, item.thumbnail);
                return { ...item, thumbnail: img };
            });

            setStreams(data);
            console.log(data);
        }

        fetchStreams();
        setIsClient(true);
    }, []);

    return (
        <section className='h-full relative rounded-lg flex flex-col px-6'>
            <h1 className='font-bold text-3xl w-full text-center mb-4'>Popular Streamers</h1>

            <div className="flex w-full mt-2">
                {isClient ? (
                    <>
                        {streams.length === 0 && (
                            <div className="w-full h-64">
                                <h1>
                                    No streamers are live right now
                                </h1>
                            </div>
                        )}

                        <div className="flex flex-col xl:flex-row space-x-4 w-full">
                            <div className="w-1/5 justify-center h-[25rem] hidden xl:flex">
                                <Carousel
                                    opts={{
                                        align: "start",
                                    }}
                                    orientation="vertical"
                                    className="w-full h-full"
                                >
                                    <CarouselContent className="-mt-1 h-[26rem] space-y-4">
                                        {streams.map((stream, index) => (
                                            <CarouselItem key={index} className="pt-1 md:basis-1/2">
                                                <StreamPreview key={index}
                                                    title={stream.title}
                                                    viewers={stream.viewers ?? 0}
                                                    isLive={true}
                                                    streamer={stream!.expand.user.username}
                                                    game={stream.game}
                                                    image={stream.thumbnail}
                                                    stream_id={stream.stream_key}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                            <div className="w-full xl:w-3/5 h-auto">
                                <CustomStreamPreview
                                    title={streams && streams[0]?.title}
                                    viewers={streams && streams[0]?.viewers}
                                    isLive={true}
                                    streamer={streams[0]?.expand.user.username ?? 'Unknown'}
                                    game={streams && streams[0]?.game}
                                    image={streams && streams[0]?.thumbnail}
                                    stream_id={streams && streams[0]?.stream_key}
                                />
                            </div>

                            <div className="w-1/5 h-[26rem] hidden xl:flex justify-center">
                                <Carousel
                                    opts={{
                                        align: "start",
                                    }}
                                    orientation="vertical"
                                    className="w-full"
                                >
                                    <CarouselContent className="-mt-1 h-[25rem] space-y-4">
                                        {streams.map((stream, index) => (
                                            <CarouselItem key={index} className="pt-1 md:basis-1/2">
                                                <StreamPreview key={index}
                                                    title={stream.title}
                                                    viewers={stream.viewers ?? 0}
                                                    isLive={true}
                                                    streamer={stream!.expand.user.username}
                                                    game={stream.game}
                                                    image={stream.thumbnail}
                                                    stream_id={stream.stream_key}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
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

function CustomStreamPreview(
    { title, viewers, isLive, streamer, game, image, stream_id }: StreamPreviewProps
) {

    const { push, replace } = useRouter();
    return (
        <Link className="flex flex-col overflow-hidden shadow-md space-y-1 w-full group" href={`/stream/${stream_id}`}>
            <div className="w-full min-h-[25rem] relative h-auto cursor-pointer">
                <Image src={image} alt={''} layout="fill" objectFit="cover" className='rounded-lg hover:border border-accent h-auto' />
                <div className="absolute top-2 left-0 w-full flex justify-between">
                    <Badge className="text-white bg-black/30 backdrop-blur-md hover:bg-slate-500 ml-2">
                        <Eye size={22} />
                        <span className="ml-1 uppercase font-bold">
                            {viewers > 1000 ? `${(viewers / 1000).toFixed(1)}k` : `${viewers} Viewers`}
                        </span>
                    </Badge>
                    <Badge className="text-white bg-red-500 mr-2">
                        <Radio size={22} />
                        <span className="ml-1 uppercase font-bold">{isLive ? 'Live' : 'Offline'}</span>
                    </Badge>
                </div>
            </div>

            <h2 className='font-semibold text-xl text-white w-full'>
                {title}
            </h2>

            <Link className="flex items-center space-x-2 cursor-pointer" href={`/user/${streamer}`}>
                <Avatar>
                    <AvatarFallback>{streamer.charAt(0).toUpperCase()}</AvatarFallback>
                    <AvatarImage src="" />
                </Avatar>
                <div className="flex flex-col">
                    <span className='font-semibold text-white'>
                        {streamer}
                    </span>
                    <span className="text-gray-400 text-sm">
                        {game}
                    </span>
                </div>
            </Link>
        </Link>
    );
}