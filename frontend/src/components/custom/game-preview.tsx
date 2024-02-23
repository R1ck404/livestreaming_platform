import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { Eye, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';

type StreamPreviewProps = {
    title: string;
    image: string;
    tags: string[];
    id: string;
}

export default function GamePreview(
    { title, image, tags, id }: StreamPreviewProps
) {
    const [viewers, setViewers] = useState(0);
    const client = createBrowserClient();
    useEffect(() => {
        async function fetchViewers() {
            const streamers = await client.collection('streams').getFullList({ filter: `tags:isset ~ "${title}" && is_live=true` });
            const viewers = streamers.reduce((acc: number, stream: any) => {
                return acc + stream.viewers;
            }, 0);

            setViewers(viewers);
        }

        fetchViewers();
    }, []);

    return (
        <div className="flex flex-col overflow-hidden shadow-md space-y-1 rounded-lg w-full hover:border-accent hover:border cursor-pointer bg-blend-saturation">
            <div className="h-96 w-full relative">
                <Image src={image} alt={''} layout="fill" objectFit="cover" className='rounded-lg' />
                <div className="absolute top-2 left-0 w-full flex justify-between">
                    <Badge className="text-white bg-black/30 backdrop-blur-md hover:bg-slate-500 ml-2">
                        <Eye size={22} />
                        <span className="ml-1 uppercase font-bold">
                            {viewers > 1000 ? `${(viewers / 1000).toFixed(1)}k` : `${viewers} Viewers`}
                        </span>
                    </Badge>
                </div>

                <div className="absolute bottom-2 left-0 w-full flex flex-col">
                    <h2 className='font-semibold text-lg text-white w-full ml-2'>
                        {title}
                    </h2>
                    <div className="flex space-x-2">
                        {tags.map((tag, index) => (
                            <Badge key={index} className="text-white bg-black/30 backdrop-blur-md hover:bg-slate-500 ml-2">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}