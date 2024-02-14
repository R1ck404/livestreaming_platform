import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { Eye, Radio } from 'lucide-react';
import { useRouter } from 'next/navigation';

type StreamPreviewProps = {
    title: string;
    viewers: number;
    isLive: boolean;
    streamer: string;
    game: string;
    image: string;
    stream_id: string;
}

export default function StreamPreview(
    { title, viewers, isLive, streamer, game, image, stream_id }: StreamPreviewProps
) {

    const { push, replace } = useRouter();
    return (
        <div className="flex flex-col overflow-hidden shadow-md space-y-1 w-full cursor-pointer group" onClick={
            () => {
                replace(`/stream/${stream_id}`);
            }
        }>
            <div className="w-full h-48 relative">
                <Image src={image} alt={''} layout="fill" objectFit="cover" className='rounded-lg group-hover:border border-accent' />
                <div className="absolute top-2 left-0 w-full flex justify-between">
                    <Badge className="text-white bg-black/30 backdrop-blur-md hover:bg-slate-500 ml-2">
                        <Eye size={22} />
                        <span className="ml-1 uppercase font-bold">
                            {viewers > 1000 ? `${(viewers / 1000).toFixed(1)}k` : `${viewers} Viewers`}
                        </span>
                    </Badge>
                    <Badge className="text-white bg-red-500 mr-2">
                        <Radio size={22} />
                        <span className="ml-1 uppercase font-bold">{isLive ? 'Live' : 'Offline'}</span>
                    </Badge>
                </div>
            </div>

            <h2 className='font-semibold text-xl text-white w-full'>
                {title}
            </h2>

            <div className="flex items-center space-x-2">
                <Avatar>
                    <AvatarFallback>XD</AvatarFallback>
                    <AvatarImage src="" />
                </Avatar>
                <div className="flex flex-col">
                    <span className='font-semibold text-white'>
                        {streamer}
                    </span>
                    <span className="text-gray-400 text-sm">
                        {game}
                    </span>
                </div>
            </div>
        </div>
    );
}