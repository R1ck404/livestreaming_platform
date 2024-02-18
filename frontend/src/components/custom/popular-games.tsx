import { ScrollArea } from "@radix-ui/react-scroll-area";
import GamePreview from "./game-preview";
import { ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { SelectValue } from "./multi-select";
import { Skeleton } from "../ui/skeleton";

export default function PopularGames() {
    const client = createBrowserClient();
    const [isClient, setIsClient] = useState(false);
    const [availableGames, setAvailableGames] = useState<any[]>([]);

    useEffect(() => {

        const fetchGames = async () => {
            const res = await client.collection('games').getList(1, 6, { filter: "is_disabled=false" });

            const data = res.items.map((item: any) => {
                return { value: item.value, label: item.label, thumbnail: client.files.getUrl(item, item.thumbnail), tags: item.tags };
            });

            setAvailableGames(data);
        };

        fetchGames();
        setIsClient(true);
    }, []);

    return (
        <section className='h-full relative rounded-lg flex flex-col px-6'>
            <h1 className='font-bold text-2xl'>Popular Games</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-2">
                {isClient ? (
                    <>
                        {availableGames?.length === 0 && (
                            <div className="w-full h-64">
                                <h1>
                                    No games found.
                                </h1>
                            </div>
                        )}
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
                    <LoadingSkeleton />
                )}
            </div>
        </section>
    );
}

const LoadingSkeleton = ({ amount }: { amount?: number }) => {
    return (
        <>
            {Array.from({ length: amount ?? 6 }).map((_, i) => (
                <Skeleton className="w-full h-96 relative" key={i}>
                </Skeleton>
            ))}
        </>
    );
}

export { LoadingSkeleton as PopularGamesLoadingSkeleton }