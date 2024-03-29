"use client"

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Forward, Fullscreen, MoreVertical, Pause, Play, Settings, Volume2 } from "lucide-react";
import flv from 'flv.js';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import FLVPlayer from "../flv-player";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import Link from "next/link";

type StreamVideoProps = {
    stream_key: string | null;
    isLive: boolean;
    title: string;
    viewers: number;
    streamer: any;
};

type StreamerInfoProps = {
    title: string;
    streamer: any;
    isFollowingStreamer: boolean;
    followStreamer: () => void;
    viewers: number;
};

export default function StreamVideo({ stream_key, isLive, title, viewers, streamer }: StreamVideoProps) {
    const src = `http://localhost:8000/live/${stream_key}.flv`;
    const client = createBrowserClient();
    const [isFollowingStreamer, setIsFollowingStreamer] = useState(false);

    const getFollowing = async () => {
        const user_id = client.authStore.model?.id;
        if (!user_id) return;

        try {
            const following = await client.collection('followers').getFullList({ filter: `follower="${user_id}" && following="${streamer?.id}"` });
            if (following.length > 0) {
                setIsFollowingStreamer(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getFollowing();
    }, []);

    const addMetrics = async (type: string) => {
        const user_id = client.authStore.model?.id;
        if (!user_id) return;

        await fetch("/api/metrics/add_metrics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id, stream_key, type })
        });
    }

    const followStreamer = async () => {
        const user_id = client.authStore.model?.id;
        if (!user_id) return;

        if (isFollowingStreamer) {
            try {
                const following = await client.collection('followers').getFullList({ filter: `follower="${user_id}" && following="${streamer?.id}"` });
                await client.collection('followers').delete(following[0].id);
            } catch (error) {

            }
            setIsFollowingStreamer(false);
        } else {
            try {
                await client.collection('followers').create({ follower: user_id, following: streamer?.id });

                addMetrics('follow');
            } catch (error) {
                console.log(error);
            }
            setIsFollowingStreamer(true);
        }
    }

    return (
        <div className="rounded-xl h-96 sm:h-96 md:h-[35rem] xl:h-auto">
            {stream_key !== null ? (
                <div className="flex flex-col h-full">
                    {isLive ? (
                        <>
                            <FLVPlayer url={src} onLoaded={
                                () => {
                                    addMetrics('view');
                                }
                            } />
                        </>
                    ) : (
                        <div className="relative w-full h-full">
                            <Skeleton className="w-full h-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="font-bold text-3xl text-gray-400">Stream appears to be offline</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col mt-4 w-full">
                        <h1 className="font-bold text-3xl">{title}</h1>
                        <div className="flex space-y-2 sm:space-y-0 sm:items-center mt-4 w-full flex-col sm:flex-row">
                            <Link className="flex items-center" href={`/user/${streamer?.username}`}>
                                <Avatar className="mr-2 border ring-2 ring-red-600 border-background m-0.5 relative">
                                    <AvatarImage src={streamer?.avatar} />
                                    <AvatarFallback className="bg-accent text-accent-content">{streamer?.username[0]}</AvatarFallback>
                                </Avatar>

                                <div className="ml-2">
                                    <h1 className="font-bold text-xl">{streamer?.username}</h1>
                                    <p className="text-sm text-stone-500">{streamer?.followers_amount} Followers</p>
                                </div>
                            </Link>
                            <div className="flex w-full flex-row">
                                <div className="flex sm:ml-6">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button className="rounded-lg" variant="accent" onClick={followStreamer}>
                                                {isFollowingStreamer ? "Following" : "Follow"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isFollowingStreamer ? "Unfollow" : "Follow"} {streamer?.username}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <div className="flex space-x-4 ml-auto">
                                    <div className="justify-center rounded-full bg-muted hover:text-accent hover:bg-muted/40 transition-all p-2 cursor-pointer space-x-2 px-4 hidden lg:flex">
                                        <Eye />
                                        <span>
                                            {viewers}
                                        </span>
                                    </div>
                                    <div className="rounded-full bg-muted hover:bg-muted/40 hover:text-accent transition-all p-2 cursor-pointer hidden lg:flex">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Forward />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Share</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="rounded-full bg-muted hover:bg-muted/40 hover:text-accent transition-all p-2 cursor-pointer">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <MoreVertical />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>More</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Skeleton className="w-full h-96" />
            )
            }
        </div >
    );
}