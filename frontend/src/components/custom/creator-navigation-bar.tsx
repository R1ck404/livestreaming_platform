import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Activity, Bell, Combine, LogIn, MessageSquareMore, Radio, Search, Video } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import SearchBar from "./search-bar";
import { Switch } from "../ui/switch";
import { useLocalStorage } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";

type CreatorNavigationBarProps = {
    isUserAuthenticated: boolean;
    layoutOptions?: boolean;
};

function CreatorNavigationBar({ isUserAuthenticated, layoutOptions }: CreatorNavigationBarProps) {
    const [isClient, setIsClient] = useState(false);
    const client = createBrowserClient();
    const [layout_settings, setLayoutSettings] = useLocalStorage("layout_setting", {
        stream_enabled: true,
        chat_enabled: true,
        quick_actions_enabled: true,
        session_info_enabled: true,
        activity_enabled: true,
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <nav className="flex items-center justify-between w-full px-4 py-2 h-16 bg-card border-b">
            <div>
                {layoutOptions && (
                    <div className="space-x-4">
                        {/* stream icon to enable or disable the stream (SAME FOR OTHER ITEMS IN LAYUT_SETTINFGS*/}
                        <Button
                            onClick={() => setLayoutSettings({ ...layout_settings, stream_enabled: !layout_settings.stream_enabled })}
                            className="border-accent border text-accent" variant="ghost"
                        >
                            <Video />
                        </Button>
                        <Button
                            onClick={() => setLayoutSettings({ ...layout_settings, chat_enabled: !layout_settings.chat_enabled })}
                            className="border-accent border text-accent" variant="ghost"
                        >
                            <MessageSquareMore />
                        </Button>
                        <Button
                            onClick={() => setLayoutSettings({ ...layout_settings, quick_actions_enabled: !layout_settings.quick_actions_enabled })}
                            className="border-accent border text-accent" variant="ghost"
                        >
                            <Combine />
                        </Button>
                        <Button
                            onClick={() => setLayoutSettings({ ...layout_settings, session_info_enabled: !layout_settings.session_info_enabled })}
                            className="border-accent border text-accent" variant="ghost"
                        >
                            <Radio />
                        </Button>
                        <Button
                            onClick={() => setLayoutSettings({ ...layout_settings, activity_enabled: !layout_settings.activity_enabled })}
                            className="border-accent border text-accent" variant="ghost"
                        >
                            <Activity />
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarFallback>
                                XD
                            </AvatarFallback>
                            <AvatarImage src={""} />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent collisionPadding={20} className="min-w-48">
                        {isUserAuthenticated ? (
                            <>
                                <DropdownMenuItem className="hover:!bg-transparent">
                                    <div className="flex space-x-2 items-center">
                                        <Avatar>
                                            <AvatarFallback>
                                                XD
                                            </AvatarFallback>
                                            <AvatarImage src={""} />
                                        </Avatar>

                                        <span>
                                            Username
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/user/${client?.authStore.model?.username}`} className="cursor-pointer">
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Privacy</DropdownMenuItem>
                                <DropdownMenuItem>Safety</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Subscriptions</DropdownMenuItem>
                                <DropdownMenuItem>Wallet</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Language</DropdownMenuItem>
                                <DropdownMenuItem className="flex justify-between items-center">
                                    <span>
                                        Dark theme
                                    </span>
                                    <Switch />
                                </DropdownMenuItem>
                                <DropdownMenuItem>Help</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                    client.authStore.clear();
                                }}>
                                    Sign out
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuLabel>Not signed in</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/login">
                                        Sign in
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/register">
                                        Sign up
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav >
    );
}


const LoadingSkeleton = () => {
    return (
        <>
            <Skeleton className="w-28 h-10" style={{
                clipPath: 'polygon(0 0, 93% 0, 100% 30%, 100% 100%, 80% 100%, 7% 100%, 0 78%, 0% 30%)',
            }} />
            <Skeleton className="w-10 h-10" />
        </>
    )
}

export default dynamic(() => Promise.resolve(CreatorNavigationBar), {
    ssr: false
})