import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { Gift, MoreVertical, SendHorizontal, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StreamChatProps = {
    stream_key: string | null;
    stream_id: string | null;
    stream_settings: any;
};

export default function StreamChat({ stream_key, stream_id, stream_settings }: StreamChatProps) {
    const client = createBrowserClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollableRef = useRef<HTMLDivElement>(null);
    const [streamChat, setStreamChat] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [chat_delay, setChatDelay] = useState<number>(0);
    const [matchingCommands, setMatchingCommands] = useState<StreamCommand[]>([]);
    const { chat_enabled, slow_mode_enabled, slow_mode_delay } = stream_settings as StreamSettings;
    const commands = stream_settings?.commands ?? [];

    useEffect(() => {
        if (!chat_enabled) return;

        if (scrollableRef.current) {
            const scroll = scrollableRef.current;
            scroll.scrollTop = scroll.scrollHeight;
        }
    }, [streamChat]);

    useEffect(() => {
        if (!chat_enabled) return;
        if (stream_id === null || stream_id === undefined || !stream_id) return;

        const fetchStreamChat = async () => {
            const streamChat = await client.collection('stream_messages').getList(1, 50, { sort: '-created', filter: `stream="${stream_id}"`, expand: 'user' })
            setStreamChat(streamChat.items.reverse());

            setIsFetching(false);
        }

        client.collection('stream_messages').subscribe(`*`, async (e) => {
            const record = e.record;
            const action = e.action;

            if (action === 'create' && record.stream === stream_id) {
                const user = await client.collection('users').getOne(record.user);
                record.expand = { user };
                setStreamChat((prev) => [...prev, record]);
            }

            if (action === 'delete') {
                setStreamChat((prev) => prev.filter((item) => item.id !== record.id));

            }
        });

        fetchStreamChat();

        return () => {
            client.collection('stream_messages').unsubscribe(`*`);
        }
    }, [stream_id]);

    const sendMessage = async () => {
        if (isFetching) return;
        if (!chat_enabled) return;
        if (chat_delay > 0) return;

        const user_id = client.authStore.model?.id;
        const message = inputRef.current?.value;

        if (message === '') {
            inputRef.current?.focus();
            return;
        }

        if (user_id && user_id !== '' && stream_id && stream_id !== '') {
            if (message?.startsWith(stream_settings.command_prefix)) {
                const command = message.split(' ')[0].replace(stream_settings.command_prefix, '');
                const commandExists = commands.find((c: StreamCommand) => c.name === command);

                if (commandExists && commandExists.is_enabled) {
                    if (!commandExists.is_public) {
                        setStreamChat((prev) => [...prev, { content: commandExists.response, stream: stream_id, user: 'system', expand: { user: { username: 'system', avatar: null } } }]);

                        inputRef.current!.value = '';
                        setMatchingCommands([]);
                        return;
                    }

                    if (commandExists.is_public) {
                        await client.collection('stream_messages').create({ content: commandExists.response, stream: stream_id, user: 'system' });

                        inputRef.current!.value = '';
                        setMatchingCommands([]);
                        return;
                    }

                }
            }

            await client.collection('stream_messages').create({ content: message, stream: stream_id, user: user_id });

            inputRef.current!.value = '';
        }

        if (slow_mode_enabled) {
            setChatDelay(slow_mode_delay);
        }
    }

    useEffect(() => {
        if (chat_delay > 0) {
            const interval = setInterval(() => {
                setChatDelay((prev) => prev - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [chat_delay]);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div className="flex flex-col w-full rounded-xl bg-transparent border border-border h-80 sm:h-96 md:h-[35rem] xl:h-[50rem]">
            <div className="w-full h-12 bg-muted rounded-t-xl flex items-center pl-4 pr-2 justify-between">
                <h1 className="font-bold text-xl">Live chat</h1>
                <div className="rounded-full hover:bg-background/40 transition-all p-2 cursor-pointer my-1">
                    <MoreVertical />
                </div>
            </div>
            <div className="h-full overflow-y-scroll relative" ref={scrollableRef}>
                {!chat_enabled && <div className="flex justify-center items-center h-full"><h1 className="text-4xl font-bold text-white/80">Chat is disabled</h1></div>}
                {chat_enabled && isFetching && <LoadingSkeleton />}
                {chat_enabled && streamChat.map((message: any, index: number) => (
                    <div key={index} className="flex items-center px-4 py-2 space-x-4 w-full hover:bg-muted/80">
                        <Avatar>
                            <AvatarImage src={message?.expand?.user?.avatar} />
                            <AvatarFallback className="bg-accent text-accent-content">{message?.expand?.user?.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="font-bold">{message?.expand?.user?.username}</h1>
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            {chat_enabled && (
                <div className="flex mt-auto flex-col">
                    <div className="chat-delay px-4">
                        {chat_delay > 0 && <p className="text-white text-sm mb-2">Slow mode enabled. You can send a message in {chat_delay} seconds.</p>}
                    </div>
                    {matchingCommands.length > 0 && (
                        <div className="flex flex-col ">
                            {matchingCommands.map((command, index) => (
                                <div key={index} className="bg-background/80 hover:bg-muted p-2 text-white font-bold first:rounded-t-xl first:border-t w-full px-4 cursor-pointer" onClick={
                                    () => {
                                        const input = inputRef.current;
                                        if (input) {
                                            input.value = "/" + command.name;
                                            input.focus();
                                        }
                                    }
                                }>{command.name}</div>
                            ))}
                        </div>
                    )}
                    <div className="w-full relative p-4">
                        <Input placeholder="Send a message..." className="bg-muted placeholder:text-stone-400 focus-visible:ring-accent" required ref={inputRef} onKeyDown={handleKeyDown} disabled={isFetching || chat_delay > 0} onChange={
                            (e) => {
                                const value = e.target.value;
                                if (value.startsWith(stream_settings.command_prefix)) {
                                    const command = value.split(' ')[0].replace(stream_settings.command_prefix, '');
                                    const matching = commands.filter((c: StreamCommand) => c.name.includes(command));
                                    setMatchingCommands(matching);
                                } else {
                                    setMatchingCommands([]);
                                }
                            }
                        } />
                        <div className={`absolute right-5 top-1/2 transform -translate-y-1/2 flex space-x-1 ${isFetching || chat_delay > 0 ? 'text-gray-500 cursor-not-allowed' : ''}`}>
                            <div className={`rounded-full transition-all p-1 cursor-pointer ${isFetching || chat_delay > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`}>
                                <Gift />
                            </div>
                            <div className={`rounded-full transition-all p-1 cursor-pointer ${isFetching || chat_delay > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`}>
                                <Smile />
                            </div>
                            <div className={`rounded-xl transition-all p-1 cursor-pointer ${isFetching || chat_delay > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`} onClick={sendMessage}>
                                <SendHorizontal />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const LoadingSkeleton = () => {
    return (
        <>
            {[...Array(10)].map((_, index) => (
                <div key={index} className="flex items-center px-4 py-2 space-x-4 w-full min-h-12">
                    <Skeleton className="rounded-full h-10 w-10" />
                    <div className="flex flex-col space-y-1">
                        <Skeleton className="w-20 h-5" />
                        <Skeleton className="w-40 h-5" />
                    </div>
                </div>
            ))}
        </>
    );
}

export { LoadingSkeleton as StreamChatSkeleton };