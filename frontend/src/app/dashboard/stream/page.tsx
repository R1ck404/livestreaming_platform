"use client"

import CreatorLayout from "@/components/custom/creator-layout";
import FLVPlayer from "@/components/custom/flv-player";
import FollowerGraph from "@/components/custom/follower-graph";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { Activity, Gift, Loader2, MessageSquareMore, Radio, SendHorizontal, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useLocalStorage } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard() {
    const client = createBrowserClient();
    const [stream, setStream] = useState<any>(null);
    const [streamChat, setStreamChat] = useState<any>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [matchingCommands, setMatchingCommands] = useState<StreamCommand[]>([]);
    const commands = stream?.settings?.commands ?? [];
    const stream_settings = stream?.settings as StreamSettings;
    const inputRef = useRef<HTMLInputElement>(null);

    const [layout_settings, setLayoutSettings] = useLocalStorage("layout_setting", {
        stream_enabled: true,
        chat_enabled: true,
        quick_actions_enabled: true,
        session_info_enabled: true,
        activity_enabled: true,
        layout: [
            { i: 'session_info', x: 0, y: 0, w: 12, h: 4 },
            { i: 'stream', x: 0, y: 4, w: 9, h: 17 },
            { i: 'chat', x: 9, y: 4, w: 3, h: 17 },
            { i: 'quick_actions', x: 0, y: 5, w: 12, h: 4 },
            { i: 'activity', x: 0, y: 5, w: 6, h: 4 }
        ]
    });

    const getProperties = (layout: any, id: string) => {
        if (!layout) return null;
        const item = layout.find((l: any) => l.i === id);
        return item;
    }

    useEffect(() => {
        const user_id = client.authStore.model?.id;

        if (!user_id) return;
        const fetch = async () => {
            try {
                const stream = await client.collection("streams").getFirstListItem(`user="${user_id}"`);
                setStream(stream as any);
            } catch (error) {
                setStream({
                    exists: false
                });
            }
        }

        fetch();
    }, []);

    useEffect(() => {
        const stream_id = stream?.id;
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
                setStreamChat((prev: any) => [...prev, record]);
            }

            if (action === 'delete') {
                setStreamChat((prev: any[]) => prev.filter((item) => item.id !== record.id));

            }
        });

        fetchStreamChat();

        return () => {
            client.collection('stream_messages').unsubscribe(`*`);
        }
    }, [stream?.id]);

    const sendMessage = async () => {
        if (isFetching) return;

        const user_id = client.authStore.model?.id;
        const message = inputRef.current?.value;

        if (message === '') {
            inputRef.current?.focus();
            return;
        }

        if (user_id && user_id !== '' && stream?.id && stream?.id !== '') {
            if (message?.startsWith(stream_settings.command_prefix)) {
                const command = message.split(' ')[0].replace(stream_settings.command_prefix, '');
                const commandExists = commands.find((c: StreamCommand) => c.name === command);

                if (commandExists && commandExists.is_enabled) {
                    if (!commandExists.is_public) {
                        setStreamChat((prev: any) => [...prev, { content: commandExists.response, stream: stream?.id, user: 'system', expand: { user: { username: 'system', avatar: null } } }]);

                        inputRef.current!.value = '';
                        setMatchingCommands([]);
                        return;
                    }

                    if (commandExists.is_public) {
                        await client.collection('stream_messages').create({ content: commandExists.response, stream: stream?.id, user: 'system' });

                        inputRef.current!.value = '';
                        setMatchingCommands([]);
                        return;
                    }

                }
            }

            await client.collection('stream_messages').create({ content: message, stream: stream?.id, user: user_id });

            inputRef.current!.value = '';
        }
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <CreatorLayout className="p-2 overflow-x-hidden relative">
            {!stream && <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/60 backdrop-blur-lg z-[1001]">
                <span className="text-3xl">
                    <Loader2 className="animate-spin w-12 h-12" />
                </span>
            </div>}

            {stream?.exists === false && <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/60 backdrop-blur-lg z-[1001]">
                <span className="text-3xl">
                    You don't have any active stream
                </span>
            </div>}

            {stream?.exists !== false &&
                <ResponsiveGridLayout
                    className="z-10"
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={30}
                    isDraggable={true}
                    isResizable={true}
                    compactType="vertical"
                    onLayoutChange={(layout, layouts) => {
                        setLayoutSettings({ ...layout_settings, layout });
                    }}
                >
                    {layout_settings.session_info_enabled &&
                        <div className="bg-muted rounded-lg w-full overflow-scroll" key="session_info" data-grid={
                            getProperties(layout_settings.layout, 'session_info') ?? { x: 0, y: 0, w: 12, h: 4 }
                        }>
                            <div className="w-full h-fit bg-background/45 p-2">
                                <div className="flex space-x-2 items-center">
                                    <Radio />
                                    <span className="text-lg">Session info</span>
                                </div>
                            </div>

                            <div className="flex justify-between p-2">
                                <div className="flex flex-col">
                                    <Badge className="bg-primary w-min">Live</Badge>
                                    <span className="text-lg">{stream?.title}</span>
                                    <span className="text-lg">{stream?.description}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-lg">{stream?.viewers}</span>
                                    <span className="text-lg text-gray-300">Viewers</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-lg">Start time</span>
                                    <span className="text-lg">End time</span>
                                </div>
                            </div>
                        </div>
                    }

                    {layout_settings.stream_enabled &&
                        <div className="bg-muted rounded-lg w-full overflow-hidden" key="stream" data-grid={
                            getProperties(layout_settings.layout, 'stream') ?? { x: 0, y: 4, w: 9, h: 17 }
                        }>
                            <div className="w-full h-10 bg-background/45 p-2 flex space-x-2 items-center">
                                <Radio />
                                <span className="text-lg">Stream preview</span>
                            </div>

                            {stream?.is_live &&
                                <div className="w-full h-full flex justify-center items-center my-2">
                                    <FLVPlayer url={`http://localhost:8000/live/${stream?.stream_key}.flv`} className="rounded-b-xl" />
                                </div>
                            }

                            {!stream?.is_live && <div className="w-full h-full flex justify-center items-center">
                                <span className="text-lg text-gray-300">Stream is offline</span>
                            </div>}
                        </div>
                    }

                    {layout_settings.chat_enabled &&
                        <div className="bg-muted rounded-lg overflow-hidden relative pb-24" key="chat" data-grid={
                            getProperties(layout_settings.layout, 'chat') ?? { x: 9, y: 4, w: 3, h: 17 }
                        }>
                            <div className="w-full h-10 bg-background/45 p-2 flex space-x-2 items-center">
                                <MessageSquareMore />
                                <span className="text-lg">Chat</span>
                            </div>
                            {streamChat.length === 0 && <div className="w-full h-full flex justify-center items-center">
                                <span className="text-lg text-gray-300">No messages yet</span>
                            </div>}

                            {streamChat.length > 0 && <div className="w-full h-full overflow-scroll">
                                {streamChat.map((message: any) => {
                                    return (
                                        <div key={message.id} className="flex space-x-2 p-2">
                                            <div className="w-10 h-10 rounded-full bg-primary"></div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold">{message.expand.user.username}</span>
                                                <span className="text-lg">{message.content}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>}

                            {matchingCommands.length > 0 && (
                                <div className="flex flex-col absolute bottom-14 w-full">
                                    {matchingCommands.map((command, index) => (
                                        <div key={index} className="bg-muted hover:bg-muted p-2 text-white font-bold first:rounded-t-xl first:border-t w-full px-4 cursor-pointer" onClick={
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
                            <div className="w-full p-4 absolute bottom-0 left-0">
                                <Input placeholder="Send a message..." className="bg-muted placeholder:text-stone-400 focus-visible:ring-accent" required ref={inputRef} onKeyDown={handleKeyDown} disabled={isFetching} onChange={
                                    (e) => {
                                        const value = e.target.value;
                                        if (value.startsWith(stream?.settings?.command_prefix)) {
                                            const command = value.split(' ')[0].replace(stream?.settings?.command_prefix, '');
                                            const matching = commands.filter((c: StreamCommand) => c.name.includes(command));
                                            setMatchingCommands(matching);
                                        } else {
                                            setMatchingCommands([]);
                                        }
                                    }
                                } />
                                <div className={`absolute right-5 top-1/2 transform -translate-y-1/2 flex space-x-1 ${isFetching ? 'text-gray-500 cursor-not-allowed' : ''}`}>
                                    <div className={`rounded-full transition-all p-1 cursor-pointer ${isFetching ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`}>
                                        <Gift />
                                    </div>
                                    <div className={`rounded-full transition-all p-1 cursor-pointer ${isFetching ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`}>
                                        <Smile />
                                    </div>
                                    <div className={`rounded-xl transition-all p-1 cursor-pointer ${isFetching ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-background/80 hover:text-accent'}`} onClick={sendMessage}>
                                        <SendHorizontal />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {layout_settings.quick_actions_enabled &&
                        <div className="bg-muted rounded-lg w-full" key="quick_actions" data-grid={
                            getProperties(layout_settings.layout, 'quick_actions') ?? { x: 0, y: 5, w: 12, h: 4 }
                        }>
                            <div className="w-full h-10 bg-background/45 p-2">
                                <div className="flex space-x-2 items-center">
                                    <Radio />
                                    <span className="text-lg">Quick actions</span>
                                </div>
                            </div>
                        </div>
                    }

                    {layout_settings.activity_enabled &&
                        <div className="bg-muted rounded-lg w-full" key="activity" data-grid={
                            getProperties(layout_settings.layout, 'activity') ?? { x: 0, y: 5, w: 6, h: 4 }
                        }>
                            <div className="w-full h-10 bg-background/45 p-2">
                                <div className="flex space-x-2 items-center">
                                    <Activity />
                                    <span className="text-lg">Activity Feed</span>
                                </div>
                            </div>
                        </div>
                    }
                </ResponsiveGridLayout>
            }
        </CreatorLayout>
    )
}

// the useLocalStorage hook is not supported by SSR, so we need to render the full page clientside
export default dynamic(() => Promise.resolve(Dashboard), {
    ssr: false
})