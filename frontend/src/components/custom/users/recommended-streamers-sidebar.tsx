import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

type RecommendedStreamersSidebarProps = {
    collapsed?: boolean;
}

export default function RecommendedStreamersSidebar({ collapsed }: RecommendedStreamersSidebarProps) {
    const client = createBrowserClient();
    const [streams, setStreams] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const fetchRecommendedUsers = useCallback(async () => {
        console.log(`refetching recommended users  [${new Date().toLocaleTimeString()}]`);
        setIsClient(true);
        const user_id = client.authStore.model?.id;
        if (!user_id) return;

        const response = await fetch("/api/metrics/recommended_streams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id })
        });

        const res = await response.json();
        const fetchedStreams = res.streams;
        setIsFetching(false);

        const updatedStreams = fetchedStreams && await Promise.all(fetchedStreams?.map(async (stream: any) => {
            const userResponse = await client.collection('users').getOne(stream.user).catch(() => null);
                stream.expand = { user: userResponse ?? null };
                return stream;
        }));

        setStreams(updatedStreams);
    }, []);

    useEffect(() => {
        fetchRecommendedUsers();
    }, [fetchRecommendedUsers]);

    return (
        <>
            {!isClient || isFetching && (
                <LoadingSkeleton />
            )}

            {isClient && !isFetching && streams?.length > 0 && streams?.map((stream, i) => {
                const user = stream.expand?.user;
                const avatar = client.files.getUrl(user, user?.avatar);
                return (
                    <Link key={i} className="flex items-center space-x-2" href={`/user/${user?.username}`}>
                        <Avatar className={`${stream?.is_live ? "p-[2px] ring-2 ring-accent" : ""}`}>
                            <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                            <AvatarImage src={avatar} />
                        </Avatar>

                        {!collapsed && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-card-foreground">
                                        {user?.username}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {stream?.is_live ? (stream.title as string).slice(0, 20) : "Offline"}
                                    </span>
                                </div>
                                {stream?.is_live && (
                                    <span className="!ml-4 text-xs font-semibold text-card-foreground flex items-center">
                                        <span className="w-2 h-2 ml-1 rounded-full bg-accent mr-2"></span>
                                        <span>{stream.viewers ?? 0}</span>
                                    </span>
                                )}
                            </>
                        )}
                    </Link>
                )
            })}
        </>
    )
}

const LoadingSkeleton = () => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="w-10 h-4" />
                        <Skeleton className="w-20 h-3" />
                    </div>
                </div>
            ))}
        </>
    )
}
