import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, LogIn, Search, Video } from "lucide-react";
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

type NavigationBarProps = {
    isUserAuthenticated: boolean;
};

export default function NavigationBar({ isUserAuthenticated }: NavigationBarProps) {
    const [isClient, setIsClient] = useState(false);
    const client = createBrowserClient();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <nav className="flex items-center justify-between w-full px-4 py-2 h-16 bg-card border-b">
            <span></span>
            <div className="flex items-center space-x-4 w-6/12">
                <SearchBar />
            </div>
            <div className="flex items-center space-x-4">
                {isClient ? (
                    <>
                        <div style={{
                            clipPath: 'polygon(0 0, 93% 0, 100% 30%, 100% 100%, 80% 100%, 7% 100%, 0 78%, 0% 30%)',
                            padding: '1px',
                            borderRadius: '.25rem',
                        }} className="bg-accent">
                            {isUserAuthenticated ? (
                                <Link href="/dashboard/create-stream" style={{ clipPath: 'polygon(0 0, 93% 0, 100% 30%, 100% 100%, 80% 100%, 7% 100%, 0 78%, 0% 30%)' }} className="flex items-center bg-card hover:bg-background/80 w-full justify-center transition-all overflow-hidden rounded py-2 px-4">
                                    <Video className="text-accent" />
                                    <span className="ml-2 text-sm font-semibold text-accent uppercase">
                                        Go live
                                    </span>
                                </Link>
                            ) : (
                                <Link href="/login" style={{ clipPath: 'polygon(0 0, 93% 0, 100% 30%, 100% 100%, 80% 100%, 7% 100%, 0 78%, 0% 30%)' }} className="flex items-center bg-card hover:bg-background/80 w-full justify-center transition-all overflow-hidden rounded py-2 px-4">
                                    <LogIn className="text-accent" />
                                    <span className="ml-2 text-sm font-semibold text-accent uppercase">
                                        Sign in
                                    </span>
                                </Link>
                            )}
                        </div>

                        {isUserAuthenticated && (
                            <button className="flex items-center relative">
                                <Bell size={20} />
                                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-accent ring ring-background"></span>
                            </button>
                        )}
                    </>
                ) : (
                    <LoadingSkeleton />
                )}

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
                                }} asChild>
                                    <Link href="/login">
                                        Sign out
                                    </Link>
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