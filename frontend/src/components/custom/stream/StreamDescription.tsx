type StreamDescriptionProps = {
    stream_key: string | null;
    username: string;
    description: string;
};

export default function StreamDescription({ stream_key, description, username }: StreamDescriptionProps) {
    console.log(`rerendering StreamDescription at date: [${new Date()}] with stream_key: [${stream_key}`)
    return (
        <div className="flex flex-col w-full bg-muted rounded-xl p-3 h-full">
            <h1 className="font-bold text-lg">About {username}</h1>
            <p>{description}</p>
        </div>
    );
}