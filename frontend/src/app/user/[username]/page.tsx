"use client"

import DefaultLayout from "@/components/custom/default-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Eye, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function Page() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [stream, setStream] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const pathname = usePathname();
    const username = pathname?.split("/").slice(-1)[0];
    const name = username?.toUpperCase() ?? "USERNAME";

    const rows = 3;
    const cols = 7;

    const repeatString = (str: string, n: number) => {
        return Array(n).fill(str).join(' ');
    };

    useEffect(() => {
        setIsClient(true);

        const fetchUser = async () => {
            try {

                const user = await client.collection('users').getFirstListItem(`username="${username}"`).then((usr) => {
                    console.log(usr);
                    return usr;
                }, (e) => {
                    console.log(e);
                    return null;
                });

                if (!user) return;

                const followers = await client.collection('followers').getFullList({ filter: `following.id="${user.id}"` }).catch(() => null);

                if (!followers) return;

                user.followers = followers.length;
                setUser(user);
            } catch (error) {

            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const stream = await client.collection('streams').getFirstListItem(`user="${user.id}"`);

                if (!stream) {
                    setStream({
                        exists: false
                    });
                    return;
                }

                const thumbnail = await client.files.getUrl(stream, stream.thumbnail);
                stream.thumbnail = thumbnail;
                setStream(stream);
            } catch (error) {
                setStream({
                    exists: false
                });
            }
        };

        if (user) fetchStream();
    }, [user]);

    // const getFollowing = async () => {
    //     const user_id = client.authStore.model?.id;
    //     if (!user_id) return;

    //     try {
    //         if (!user) return;
    //         console.log(user.id)
    //         console.log(user_id)

    //         const following = await client.collection('followers').getFirstListItem(`follower.id="${user_id}" && following.id="${user?.id}"`).finally(() => null);
    //         console.log(following);
    //         if (following) {
    //             setIsFollowing(true);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const followStreamer = async () => {
    //     const user_id = client.authStore.model?.id;
    //     if (!user_id) return;

    //     if (isFollowing) {
    //         if (!user) return;
    //         try {
    //             const following = await client.collection('followers').getFullList({ filter: `follower.id="${user_id}" && following.id="${user?.id}"` });
    //             await client.collection('followers').delete(following[0].id);
    //         } catch (error) {

    //         }
    //         setIsFollowing(false);
    //     } else {
    //         if (!user) return;
    //         try {
    //             await client.collection('followers').create({ follower: user_id, following: user?.id });
    //         } catch (error) {
    //             console.log(error);
    //         }
    //         setIsFollowing(true);
    //     }
    // }

    // useEffect(() => {
    //     getFollowing();
    // }, []);

    return (
        <DefaultLayout>
            <div className="relative w-full h-full">
                <div className="w-full h-96 bg-accent relative flex flex-col items-center justify-center overflow-hidden space-y-8 z-0">
                    {Array(rows).fill('').map((_, rowIndex) => (
                        <div key={rowIndex} className="overflow-hidden whitespace-nowrap font-extrabold text-8xl text-orange-400/60">
                            <p>{repeatString(name, cols)}</p>
                        </div>
                    ))}
                </div>

                <section className="w-full h-full z-10 relative px-10 py-6 flex flex-col space-y-12">
                    <div className="w-full justify-between flex">
                        {isClient && user ? (
                            <>
                                <div className="flex items-center justify-center w-fit space-x-2">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-200">{user.username}</h1>
                                        <p className="text-sm text-gray-400">{user.followers ?? 0} Followers</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row space-x-2">
                                    <div className="flex flex-row space-x-2 mb-2">
                                        <Button type="button" className="w-fit px-2" variant="outline">
                                            <Bell size={24} />
                                        </Button>
                                        <Button type="button" className="w-fit px-2" variant="outline">
                                            <Heart size={24} />
                                        </Button>
                                    </div>
                                    <Button type="button" variant="accent" onClick={() => { }}>
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <UserInfoSkeleton />
                        )}
                    </div>
                    <Tabs defaultValue="home" className="w-full">
                        <TabsList className="mb-0 rounded-b-none space-x-4">
                            <TabsTrigger value="home" >Home</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            {/* <TabsTrigger value="schedule">Schedule</TabsTrigger> */}
                        </TabsList>
                        <TabsContent value="home" className="mt-0">
                            <div className="flex flex-col bg-muted rounded-tl-none rounded-xl p-4">
                                <h1 className="font-bold text-xl text-white">Latest stream</h1>

                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 mt-2">
                                    {stream === null && <Skeleton className="w-full h-72" />}
                                    {stream && stream?.exists !== false ? (
                                        <div className="relative w-full h-72 flex flex-col">
                                            <Image src={stream.thumbnail} alt="stream" layout="fill" objectFit="cover" className="rounded-xl" />
                                            <div className="absolute top-0 left-0 w-full flex justify-between mt-2">

                                                <Badge variant={stream.is_live ? "destructive" : "secondary"} className="ml-2">
                                                    {stream.is_live ? "Live" : "Offline"}
                                                </Badge>
                                                <Badge variant="secondary" className="space-x-2 mr-2">
                                                    <Eye size={16} />
                                                    <span>{stream.viewers}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-72 flex flex-col items-center justify-center bg-muted rounded-xl">
                                            <p className="text-gray-400">No stream available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="about" className="mt-0">
                            <div className="flex flex-col bg-muted rounded-tl-none rounded-xl p-4">
                                <h1 className="font-bold text-xl text-white">About</h1>
                                <div className="flex justify-between w-full">
                                    <div className="w-2/3 mr-12">
                                        <p className="text-gray-400 mt-2">{user?.biography === "" ? "No biography set" : user?.biography}</p>
                                    </div>
                                    <div className="w-1/3 text-center ml-12">
                                        {/* <h1 className="font-bold text-xl text-white">Socials</h1> */}
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex space-x-2">
                                                <Button type="button" variant="outline" className="w-full">
                                                    Twitch
                                                </Button>
                                                <Button type="button" variant="outline" className="w-full">
                                                    Twitter
                                                </Button>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button type="button" variant="outline" className="w-full">
                                                    Instagram
                                                </Button>
                                                <Button type="button" variant="outline" className="w-full">
                                                    YouTube
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        {/* <TabsContent value="schedule">...</TabsContent> */}
                    </Tabs>

                </section>
            </div>
        </DefaultLayout>
    );
}

const UserInfoSkeleton = () => {
    return (
        <>
            <div className="flex items-center justify-center w-fit space-x-2">
                <Skeleton className="w-16 h-16" />
                <div>
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-16 h-4 mt-2" />
                </div>
            </div>
            <div className="flex space-x-2">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-16 h-8" />
            </div>
        </>
    )
}