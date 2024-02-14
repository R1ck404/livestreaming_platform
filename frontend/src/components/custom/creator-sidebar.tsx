"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Home, ArrowLeftToLine, Settings, Sparkles, Gamepad, PlaySquare, ArrowRightToLine, Radio, BarChartBig, Cog, DoorOpen } from 'lucide-react';
import { usePageUserContext } from "@/context/PageUserContext";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import FollowingStreamersSidebar from "./users/following-streamers-sidebar";
import RecommendedStreamersSidebar from "./users/recommended-streamers-sidebar";
import { usePathname } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Collapsible from "./collapsible";

type CreatorSidebarProps = {
    isUserAuthenticated: boolean;
}

export default function CreatorSidebar({ isUserAuthenticated }: CreatorSidebarProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isClient, setIsClient] = useState(false)
    const pathname = usePathname();
    const currentPath = pathname?.split("/").pop();

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <aside className={`flex flex-col ${sidebarCollapsed ? "w-[4.5rem]" : " w-72"} transition-all ease-in-out bg-card`}>
            <div className="h-16 py-4 px-6 border-r border-b">
                <h1 className="text-2xl font-bold">Stream</h1>
            </div>
            {isClient ? (
                <>
                    <div className="flex flex-col space-y-4 h-screen py-12 !pt-4 border-r">
                        <div className="flex flex-col space-y-4 mx-4">
                            <Link href="/dashboard/">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"} ${currentPath === "dashboard" ? "bg-accent" : ""}`}>
                                    <Home className="text-gray-200 group-hover:text-accent" />

                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Home
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            <Collapsible contentClassName="ml-4" trigger={
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Radio className="text-gray-200 group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Stream manager
                                        </span>
                                    )}
                                </Button>
                            }>
                                <Link href="/dashboard/stream">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "stream" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Your stream
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/create-stream">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "create-stream" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Stream settings
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </Collapsible>

                            <Collapsible trigger={
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "settings" ? "bg-accent" : ""}`}>
                                    <Cog className="text-gray-200 group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Content Tools
                                        </span>
                                    )}
                                </Button>
                            } contentClassName="ml-4">
                                {/* Alerts & notifications, goals & milestones, emotes & badges */}
                                <Link href="/dashboard/content-tools/alerts-notifications">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "alerts-notifications" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Alerts & notifications
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/content-tools/goals-milestones">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "goals-milestones" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Goals & milestones
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/content-tools/emotes-badges">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "emotes-badges" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Emotes & badges
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </Collapsible>

                            {/* Community: Moderation, Polls & votes, Viewer games & activities */}
                            <Collapsible trigger={
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <Sparkles className="text-gray-200 group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Community
                                        </span>
                                    )}
                                </Button>
                            } contentClassName="ml-4">
                                <Link href="/dashboard/community/moderation">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "moderation" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Moderation
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/community/polls-votes">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "polls-votes" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Polls & votes
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/dashboard/community/viewer-games-activities">
                                    <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "viewer-games-activities" ? "bg-accent" : ""}`}>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                                Viewer games & activities
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </Collapsible>
                            <Link href="/dashboard/insights">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}  ${currentPath === "insights" ? "bg-accent" : ""}`}>
                                    <BarChartBig className="text-gray-200 group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Insights
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-col space-y-4 mx-4 !mt-auto">
                            <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`} onClick={
                                () => setSidebarCollapsed(!sidebarCollapsed)
                            }>
                                {!sidebarCollapsed ? (
                                    <>
                                        <ArrowLeftToLine className="text-gray-200 group-hover:text-accent" />
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Collapse
                                        </span>
                                    </>
                                ) : (
                                    <ArrowRightToLine className="text-gray-200 group-hover:text-accent" />
                                )}
                            </Button>

                            <Link href="/">
                                <Button variant="ghost" className={`flex items-center hover:bg-border/20 w-full border border-transparent hover:border-accent group ${sidebarCollapsed ? "justify-center p-0" : "justify-start"}`}>
                                    <DoorOpen className="text-gray-200 group-hover:text-accent" />
                                    {!sidebarCollapsed && (
                                        <span className="ml-2 text-sm font-semibold text-gray-200 group-hover:text-accent">
                                            Back
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