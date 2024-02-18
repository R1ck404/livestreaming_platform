import React, { useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Fullscreen, Pause, Play, Settings, Volume2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface FLVPlayerProps {
    url: string;
    className?: string;
    onLoaded?: () => void;
}

const FLVPlayer: React.FC<FLVPlayerProps> = ({ url, className, onLoaded }) => {
    console.log(url);
    const videoRef = useRef<HTMLMediaElement>(null);

    useEffect(() => {
        const loadPlayer = async () => {
            if (!videoRef.current) return;
            videoRef.current.crossOrigin = 'anonymous';
            videoRef.current.muted = true;
            videoRef.current.autoplay = false;

            // gotta import flv.js client-side
            const flv = (await import('flv.js')).default;

            const player = flv.createPlayer({
                type: 'flv',
                url,
            }, {

                isLive: true,
            });

            player.attachMediaElement(videoRef.current);
            player.load();
            await player.play();

            if (onLoaded) onLoaded();

            player.on('error', (err) => {
                console.log(err);
            });

            return () => {
                player.detachMediaElement();
                player.destroy();
            };
        };

        loadPlayer();

        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, [url]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const toggleFullScreen = () => {
        if (!videoRef.current) return;

        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className={cn(className, "relative group bg-muted rounded-xl w-full h-full")}>
            <video
                ref={videoRef as any}
                style={{ width: '100%', height: '100%' }}
                muted={true}
                autoPlay
                playsInline
            />
            <div className="absolute bottom-0 left-0 h-0 bg-white bg-opacity-10 rounded-b-xl w-full group-hover:h-10 transition-all overflow-hidden">
                <div className="flex w-full h-full items-center space-x-2">
                    <div className="rounded-full hover:bg-muted/40 hover:text-accent transition-all p-1 cursor-pointer ml-3" onClick={togglePlay}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-white">
                                    {videoRef.current?.paused ? <Play /> : <Pause />}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-white">

                                    {videoRef.current?.paused ? 'Play' : 'Pause'}
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="rounded-full hover:bg-muted/40 hover:text-accent transition-all p-1 cursor-pointer">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-white">
                                    <Volume2 />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-white">
                                    Change volume
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className="rounded-full text-white bg-red-500 hover:bg-red-400 space-x-2 flex item-center">
                                <div className="h-1 w-1 rounded-full bg-white"></div>
                                <span>
                                    LIVE
                                </span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span className="text-white">
                                This stream is live
                            </span>
                        </TooltipContent>
                    </Tooltip>
                    <div className="rounded-full hover:bg-muted/40 hover:text-accent transition-all p-1 cursor-pointer !ml-auto">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-white">
                                    <Settings />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-white">
                                    Stream settings
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="rounded-full hover:bg-muted/40 hover:text-accent transition-all p-1 cursor-pointer !mr-3" onClick={toggleFullScreen}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-white">
                                    <Fullscreen />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-white">
                                    Go fullscreen
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FLVPlayer;
