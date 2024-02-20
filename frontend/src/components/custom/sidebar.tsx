"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Home, ArrowLeftToLine, Settings, Sparkles, Gamepad, PlaySquare, ArrowRightToLine } from 'lucide-react';
import { usePageUserContext } from "@/context/PageUserContext";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import FollowingStreamersSidebar from "./users/following-streamers-sidebar";
import RecommendedStreamersSidebar from "./users/recommended-streamers-sidebar";

type SidebarProps = {
    isUserAuthenticated: boolean;
}

export default function Sidebar({ isUserAuthenticated }: SidebarProps) {
    // const { sidebarCollapsed, setSidebarCollapsed } = usePageUserContext();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <aside className={`flex flex-col text-card-foreground ${sidebarCollapsed ? "w-[4.5rem]" : "w-72 fixed z-[1002] sm:relative"} transition-all ease-in-out bg-card`}>
            <div className="h-16 py-4 px-6 border-r border-b">
                <h1 className="text-2xl font-bold">Stream</h1>
            </div>
            {isClient ? (
                <>
                    <div className="flex flex-col space-y-4 h-screen py-12 !pt-4 border-r">
                        <div className="flex flex-col space-y-4 mx-4">
                            <Link href="/">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Home className="text-card-foreground group-hover:text-accent" />

                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-card-foreground group-hover:text-accent">
                                            Home
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            <Link href="/explore">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Sparkles className="text-card-foreground group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-card-foreground group-hover:text-accent">
                                            Explore
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            <Link href="/games">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Gamepad className="text-card-foreground group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-card-foreground group-hover:text-accent">
                                            Games
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                        <div className={`flex flex-col ${sidebarCollapsed ? "" : "mx-4"}`}>
                            {sidebarCollapsed && isUserAuthenticated ? (
                                <>

                                    <hr className="mx-4 mb-4" />
                                    <div className="px-4 space-y-2">
                                        <FollowingStreamersSidebar collapsed={true} />
                                    </div>
                                </>
                            ) : (
                                isUserAuthenticated ? (
                                    <>

                                        <hr className="mx-4 mb-4" />
                                        <div className="px-4">
                                                <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
                                                Following
                                            </h3>
                                            <div className="flex flex-col space-y-2 w-full mt-4">
                                                <FollowingStreamersSidebar />

                                                <Button variant="ghost" className="flex items-center justify-start p-0 hover:bg-transparent w-full">
                                                    {!sidebarCollapsed && (
                                                        <span className="text-sm font-semibold text-accent transition-all mt-2">
                                                            Show more
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )
                            )}

                            <hr className="mx-4 my-4" />

                            {sidebarCollapsed ? (
                                <div className="px-4">
                                    <div className="flex flex-col space-y-2 ">
                                        <RecommendedStreamersSidebar collapsed={true} />
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4">
                                        <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
                                        Recommended
                                    </h3>
                                    <div className="flex flex-col space-y-2 mt-4">
                                        <RecommendedStreamersSidebar />
                                        <Button variant="ghost" className="flex items-center justify-start p-0 hover:bg-transparent w-full">
                                            {!sidebarCollapsed && (
                                                <span className="text-sm font-semibold text-accent transition-all mt-2">
                                                    Show more
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`flex flex-col space-y-4 mx-4 !mt-auto ${sidebarCollapsed ? '' : '!mb-8 sm:!mb-0'}`}>
                            <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`} onClick={
                                () => setSidebarCollapsed(!sidebarCollapsed)
                            }>
                                {!sidebarCollapsed ? (
                                    <>
                                        <ArrowLeftToLine className="text-card-foreground group-hover:text-accent" />
                                        <span className="ml-2 text-sm font-semibold text-card-foreground group-hover:text-accent">
                                            Collapse
                                        </span>
                                    </>
                                ) : (
                                        <ArrowRightToLine className="text-card-foreground group-hover:text-accent" />
                                )}
                            </Button>

                            <Link href="/settings">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Settings className="text-card-foreground group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-card-foreground group-hover:text-accent">
                                            Settings
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col space-y-4 h-screen py-12 !pt-4 border-r">
                        <div className="flex flex-col space-y-4 mx-4">
                            <Skeleton className="w-full h-8" />
                            <Skeleton className="w-full h-8" />
                            <Skeleton className="w-full h-8" />
                        </div>

                        <hr className="mx-4 my-4" />
                        <div className="flex flex-col mx-4 space-y-2">
                            <Skeleton className="w-32 h-6" />

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>
                            <Skeleton className="w-24 h-6 !mt-4" />
                        </div>
                        <hr className="mx-4 my-4" />
                        <div className="flex flex-col mx-4 space-y-2">
                            <Skeleton className="w-32 h-6" />

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                            </div>
                            <Skeleton className="w-24 h-6 !mt-4" />
                        </div>
                        <div className="flex flex-col space-y-4 mx-4 !mt-auto">
                            <Skeleton className="w-full h-8" />
                            <Skeleton className="w-full h-8" />
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
}