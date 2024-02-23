"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type FollowingStreamersSidebarProps = {
    collapsed?: boolean;
}

export default function FollowingStreamersSidebar({ collapsed }: FollowingStreamersSidebarProps) {
    const client = createBrowserClient();
    const [followingUsers, setFollowingUsers] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const fetchFollowingUsers = async () => {
            const user_id = client.authStore.model?.id;
            if (!user_id) return;

            const following = await client.collection('followers').getList(1, 3, { filter: `follower="${user_id}"`, expand: 'following' });
            const followingUsers = following.items.map((item: any) => item.expand.following);
            setFollowingUsers(followingUsers);

            setIsFetching(false);

            const updatedUsersWithAvatar = await Promise.all(
                followingUsers.map(async (user: { id: any; avatar: any; }) => {
                    const avatar = client.files.getUrl(user, user?.avatar);
                    user.avatar = avatar;
                    return user;
                })
            );

            setFollowingUsers(updatedUsersWithAvatar);

            const updatedUsers = await Promise.all(
                followingUsers.map(async (user: { id: any; stream: any; }) => {
                    const stream = await client.collection('streams').getList(1, 3, { filter: `user = "${user.id}"` });
                    user.stream = stream.items[0] ?? null;
                    return user;
                })
            );

            setFollowingUsers(updatedUsers);
        }

        fetchFollowingUsers();
    }, []);

    return (
        <>
            {!isClient || isFetching && (
                <LoadingSkeleton />
            )}

            {isClient && !isFetching && followingUsers.map((user, i) => (
                <Link key={i} className="flex items-center space-x-2" href={`/user/${user?.username}`}>
                    <Avatar>
                        <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                        <AvatarImage src={user?.avatar} />
                    </Avatar>
                    {!collapsed && (
                        <>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-card-foreground">
                                    {user.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {user.stream && user.stream.is_live ? (user.stream.title as string).slice(0, 20) : "Offline"}
                                </span>
                            </div>
                            {user.stream && user.stream.is_live && (
                                <span className="!ml-4 text-xs font-semibold text-card-foreground flex items-center">
                                    <span className="w-2 h-2 ml-1 rounded-full bg-accent mr-2"></span>
                                    <span>{user.stream.viewers ?? 0}</span>
                                </span>
                            )}
                        </>
                    )}
                </Link>
            ))}
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