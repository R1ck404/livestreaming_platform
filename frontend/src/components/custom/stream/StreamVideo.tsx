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

    const followStreamer = async () => {
        const user_id = client.authStore.model?.id;
        if (!user_id) return;

        if (isFollowingStreamer) {
            console.log('unfollowing');
            try {
                const following = await client.collection('followers').getFullList({ filter: `follower="${user_id}" && following="${streamer?.id}"` });
                await client.collection('followers').delete(following[0].id);
            } catch (error) {

            }
            setIsFollowingStreamer(false);
        } else {
            console.log('following');
            try {
                await client.collection('followers').create({ follower: user_id, following: streamer?.id });
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
                        <FLVPlayer url={src} />
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
                        <div className="flex flex-col md:flex-row md:items-center mt-4 w-full">
                            <div className="flex items-center">
                                <Avatar className="mr-2">
                                    <AvatarImage src={streamer?.avatar} />
                                    <AvatarFallback className="bg-accent text-accent-content">{streamer?.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="ml-2">
                                    <h1 className="font-bold text-xl">{streamer?.username}</h1>
                                    <p className="text-sm text-stone-500">{streamer?.followers_amount} Followers</p>
                                </div>
                            </div>
                            <div className="flex w-full flex-col sm:flex-row">
                                <div className="flex  ml-6">
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
                                    <div className="flex justify-center rounded-full bg-muted hover:text-accent hover:bg-muted/40 transition-all p-2 cursor-pointer space-x-2 px-4">
                                        <Eye />
                                        <span>
                                            {viewers}
                                        </span>
                                    </div>
                                    <div className="rounded-full bg-muted hover:bg-muted/40 hover:text-accent transition-all p-2 cursor-pointer">
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