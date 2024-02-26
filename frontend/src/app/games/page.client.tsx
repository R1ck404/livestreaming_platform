"use client"

import DefaultLayout from "@/components/custom/default-layout";
import GamePreview from "@/components/custom/game-preview";
import PopularGames, { PopularGamesLoadingSkeleton } from "@/components/custom/popular-games";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { useState, useEffect } from "react";

export default function ClientPage() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [availableGames, setAvailableGames] = useState<any[]>([]);

    useEffect(() => {

        const fetchGames = async () => {
            const res = await client.collection('games').getList(1, 12, { filter: "is_disabled=false" });

            const data = res.items.map((item: any) => {
                return { value: item.value, label: item.label, thumbnail: client.files.getUrl(item, item.thumbnail), tags: item.tags };
            });

            setAvailableGames(data);
        };

        fetchGames();
        setIsClient(true);
    }, []);
    return (
        <DefaultLayout>
            <section className='h-full relative rounded-lg flex flex-col px-6 mt-8'>
                <h1 className='font-bold text-2xl'>Popular Games</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
                    {isClient ? (
                        <>
                            {availableGames.map((game, i) => (
                                <GamePreview
                                    key={i}
                                    title={game.label}
                                    image={game.thumbnail}
                                    tags={game.tags}
                                    id={game.id}
                                />
                            ))}
                        </>
                    ) : (
                        <PopularGamesLoadingSkeleton amount={12} />
                    )}
                </div>
            </section>
        </DefaultLayout>
    )
}
