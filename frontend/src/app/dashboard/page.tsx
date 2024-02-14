import CreatorLayout from "@/components/custom/creator-layout";
import FollowerGraph from "@/components/custom/follower-graph";
import { Meteors } from "@/components/custom/meteors";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";

export default function Dashboard() {
    const client = createBrowserClient();

    return (
        <CreatorLayout className="p-6">
            <div className="w-full h-[35rem] bg-accent relative flex flex-col items-center justify-center overflow-hidden space-y-8 z-0 rounded-xl">
                <div className="space-y-8 w-5/6">
                    <h1 className="text-3xl font-bold text-center">Welcome back, {client.authStore.model?.username}</h1>
                    <Meteors />
                    <div className="space-x-8 flex min-h-64">
                        <div className="w-full h-full backdrop-blur-md bg-black/40 rounded-xl shadow-lg shadow-black/40 p-3 space-y-2">
                            <h2 className="font-bold text-lg">Follower graph</h2>
                            <span className="text-gray-300">
                                A graph of followers
                            </span>
                            <hr />
                            <FollowerGraph />
                        </div>
                        <div className="w-full h-full backdrop-blur-md bg-black/40 rounded-xl shadow-lg shadow-black/40"></div>
                    </div>
                </div>
            </div>
        </CreatorLayout>
    )
}