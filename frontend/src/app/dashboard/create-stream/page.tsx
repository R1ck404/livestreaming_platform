"use client";

import { generateJWTToken } from "@/actions/stream_actions";
import DefaultLayout from "@/components/custom/default-layout";
import { MultiSelect, SelectValue } from "@/components/custom/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { ArrowRight, ArrowUpRightFromSquare, FileUp, Loader, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { uuid } from 'uuidv4';
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import CreatorLayout from "@/components/custom/creator-layout";

export default function Page() {
    const client = createBrowserClient();
    const [currentStream, setCurrentStream] = useState<any | null>(null);
    const [saveImage, setSaveImage] = useState<any | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isStreamkeyRevealed, setIsStreamkeyRevealed] = useState<boolean>(false);
    const [jwt, setJwt] = useState<string | null>(null);
    const [isLive, setIsLive] = useState<boolean>(false);
    const [selectedGames, setSelectedGames] = useState<SelectValue[]>([]);
    const [availableGames, setAvailableGames] = useState<SelectValue[]>([]);

    const [streamSettings, setStreamSettings] = useState<StreamSettings | null>(
        {
            chat_enabled: false,
            slow_mode_enabled: false,
            slow_mode_delay: 0,
            command_prefix: "/",
            commands: [],
        }
    );

    useEffect(() => {
        const fetchGames = async () => {
            const res = await client.collection('games').getFullList({ filter: "is_disabled=false" });

            const data = res.map((item: any) => {
                return { value: item.value, label: item.label };
            });

            setAvailableGames(data);
        };

        const fetchStream = async () => {
            const user_id = client.authStore.model?.id;
            if (user_id) {
                try {
                    const res = await client.collection('streams').getFirstListItem(`user.id="${user_id}"`);
                    const test = await client.files.getUrl(res, res.thumbnail);
                    setCurrentStream(res);
                    setSaveImage(test);

                    const payload = {
                        user_id: user_id,
                        stream_id: res.id,
                        stream_key: res.stream_key,
                    };

                    const jwt = await generateJWTToken(payload);
                    setJwt(jwt);

                    const tags = res?.tags;

                    if (tags) {
                        setSelectedGames(tags);
                    }

                    client.collection('streams').subscribe(`${res.id}`, (data) => {
                        const record = data.record;

                        if (record) {
                            setIsLive(record.is_live);
                        }
                    });

                    console.log(res.settings);
                    setStreamSettings(res.settings);
                } catch (error) {
                    console.error("Failed to fetch stream", error);
                }
            }
        };

        fetchGames();
        fetchStream();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputFormdata = new FormData(e.currentTarget);
        const user_id = client.authStore.model?.id;

        if (!user_id) {
            toast.error("User ID is undefined");
            return;
        }

        // const name = saveImage?.split("/").pop();
        const name = image ? image.name : saveImage?.split("/").pop();
        const existingStreamData = {
            title: inputFormdata.get('title'),
            description: inputFormdata.get('description'),
            user: user_id,
            thumbnail: image ? image : name,
            tags: JSON.stringify(selectedGames),
            settings: JSON.stringify(streamSettings),
        };

        const newStreamData = {
            title: inputFormdata.get('title'),
            description: inputFormdata.get('description'),
            user: user_id,
            thumbnail: image,
            stream_key: uuid(),
            tags: JSON.stringify(selectedGames),
            settings: JSON.stringify(streamSettings),
        };

        try {
            const result = currentStream
                ? await client.collection('streams').update("" + currentStream.id, existingStreamData)
                : await client.collection('streams').create(newStreamData);

            if (!currentStream) {
                setCurrentStream(result);
                const test = await client.files.getUrl(result, result.thumbnail);
                setSaveImage(test);

                const payload = {
                    user_id: user_id,
                    stream_id: result.id,
                    stream_key: result.stream_key,
                };

                const jwt = await generateJWTToken(payload);
                setJwt(jwt);
            }

            toast.success(`Stream ${currentStream ? 'updated' : 'created'}!`);
        } catch (error) {
            toast.error('Failed to update or create stream');
        }
    };

    const uploadThumbnails = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (isStreamkeyRevealed) {
            const timer = setTimeout(() => {
                setIsStreamkeyRevealed(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isStreamkeyRevealed]);

    return (
        <CreatorLayout className="overflow-hidden">
            <div className="p-6 flex flex-col">
                <form className="flex space-x-4 h-[36rem]" onSubmit={handleSubmit}>
                    <div className="w-3/4 h-full bg-muted rounded-xl group relative">
                        <Image src={
                            currentStream?.thumbnail ? saveImage : image ? URL.createObjectURL(image) : '/images/dota_2.jpg'
                        } layout="fill" className="rounded-xl object-cover" alt={''} />

                        <div>
                            <div className="absolute top-0 left-0 w-full h-full opacity-0 bg-black group-hover:opacity-50 transition-all flex items-center justify-center">

                            </div>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">

                                <div className="relative">
                                    <Input type="file" onChange={uploadThumbnails} />
                                </div>
                            </div>
                        </div>

                        {currentStream && (
                            <div className="absolute flex w-fit left-1 top-1">
                                <div className="bg-card backdrop-blur-lg text-white p-1 rounded-xl">
                                    {isLive ? (
                                        <div className="flex space-x-2 items-center justify-center px-3 py-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span>Connected</span>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2 items-center justify-center px-3 py-1">
                                            <Loader2 className="animate-spin" />
                                            <span>
                                                Waiting for a connection
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-2/4 bg-muted rounded-xl p-4">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" type="text" name="title" defaultValue={currentStream?.title} />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" defaultValue={currentStream?.description ?? ""} name="description" className="bg-background text-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:bg-background border-[1px] border-muted shadow-md w-full h-52" />
                            </div>

                            <div>
                                <Label htmlFor="games">Which games are you going to play?</Label>
                                <MultiSelect label="Select games..." options={availableGames} setSelected={setSelectedGames} selected={selectedGames} />
                            </div>

                            <div>
                                <Label htmlFor="stream_key">Stream Key (DO NOT SHARE)</Label>
                                <div className="w-full h-fit rounded-xl bg-background relative">
                                    <div className={`absolute w-full h-full bg-background border rounded-xl opacity-0 z-10 flex justify-center items-center transition-all ${isStreamkeyRevealed ? "hidden" : "opacity-100"}`}>
                                        <Button variant="outline" type="button" className="rounded-xl h-fit py-1" onClick={
                                            () => {
                                                setIsStreamkeyRevealed(!isStreamkeyRevealed);
                                            }
                                        }>Reveal</Button>
                                    </div>
                                    <div className="p-3 truncate">
                                        <span >{currentStream?.stream_key && jwt !== null ? currentStream?.stream_key + "?token=" + jwt : "Stream key unavailable"}</span>
                                        <Button variant="accent" className="absolute top-1 right-1" type="button" onClick={
                                            () => {
                                                toast.success("Stream key copied to clipboard");

                                                navigator.clipboard.writeText(currentStream?.stream_key && jwt !== null ? currentStream?.stream_key + "?token=" + jwt : "Stream key unavailable");
                                            }
                                        }>Copy</Button>
                                    </div>

                                </div>
                            </div>
                            <Button variant="accent">Save stream data</Button>
                        </div>
                    </div>
                </form>
                <div className="flex space-x-4 mt-4 h-[15.5rem]">
                    <div className="w-3/4 bg-muted rounded-xl p-2 flex">
                        {/* Chat */}
                        <div className="w-1/3 h-full">
                            <h1 className="text-2xl font-bold">
                                Chat
                            </h1>

                            <ul className="space-y-2 mt-2 pr-2">
                                <li className="w-full rounded-xl border bg-card p-2 flex items-center justify-between">
                                    <Label htmlFor="chat_enabled" className="text-md">Enable chat</Label>
                                    <Switch id="chat_enabled" className="h-5" onCheckedChange={
                                        () => {
                                            if (currentStream) {
                                                setStreamSettings({
                                                    ...streamSettings,
                                                    chat_enabled: !streamSettings?.chat_enabled,
                                                } as StreamSettings);
                                            }
                                        }
                                    } checked={streamSettings?.chat_enabled} />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between">
                                    <Label htmlFor="slow_mode_switch" className="text-md">Slow mode</Label>
                                    <div className="flex space-x-2 items-center">
                                        <div className="relative">
                                            <Input id="slow_mode" type="text" className={`w-14 h-5 hidden ${streamSettings?.slow_mode_enabled && "block"} `} autoFocus pattern="[0-9]" onBlur={
                                                (e) => {
                                                    setStreamSettings({
                                                        ...streamSettings,
                                                        slow_mode_delay: parseInt(e.currentTarget.value),
                                                    } as StreamSettings);
                                                }
                                            } value={streamSettings?.slow_mode_delay} />
                                        </div>
                                        <Switch id="slow_mode_switch" className="h-5" checked={streamSettings?.slow_mode_enabled} onCheckedChange={
                                            () => {
                                                if (currentStream) {
                                                    setStreamSettings({
                                                        ...streamSettings,
                                                        slow_mode_enabled: !streamSettings?.slow_mode_enabled,
                                                    } as StreamSettings);
                                                }
                                            }
                                        } />
                                    </div>
                                </li>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">
                                            <Label htmlFor="chat_enabled" className="text-md">Commands</Label>
                                            <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                        </li>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Commands</DialogTitle>
                                            <DialogDescription>
                                                Add commands to your chat
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div>
                                            <form className="flex space-x-2 items-center" onSubmit={
                                                (e) => {
                                                    e.preventDefault();

                                                    const form = e.currentTarget;
                                                    const command_name = form.command_name.value;
                                                    const command_response = form.command_response.value;

                                                    if (command_name === "" || command_response === "") {
                                                        toast.error("Command name and response cannot be empty");
                                                        return;
                                                    }

                                                    const newCommand = {
                                                        name: command_name,
                                                        response: command_response,
                                                        is_enabled: true,
                                                        is_public: false,
                                                    } as StreamCommand;

                                                    setStreamSettings({
                                                        ...streamSettings,
                                                        commands: [...streamSettings?.commands as StreamCommand[], newCommand],
                                                    } as StreamSettings);
                                                }
                                            }>
                                                <Input type="text" placeholder="Command name" id="command_name" name="command_name" />
                                                <Input type="text" placeholder="Command response" id="command_response" name="command_response" />
                                                <Button variant="accent">Add</Button>
                                            </form>

                                            <ul className="mt-6">
                                                {streamSettings?.commands?.map((command: StreamCommand, index: number) => {
                                                    return (
                                                        <>
                                                            <Accordion type="single" collapsible key={index} className="first:rounded-t-xl last:rounded-b-xl first:border-t border-b border-r border-l px-4">
                                                                <AccordionItem value={command.name} className="border-none">
                                                                    <AccordionTrigger className="py-3">
                                                                        <span>{command.name}</span>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="">
                                                                        <form className="flex flex-col space-x-2 space-y-2" onSubmit={
                                                                            (e) => {
                                                                                e.preventDefault();
                                                                                const form = e.currentTarget;

                                                                                const command_enabled = form.command_enabled.dataset.state === "checked";
                                                                                const command_public = form.command_public.dataset.state === "checked";

                                                                                console.log(form);

                                                                                const updatedCommand = {
                                                                                    ...command,
                                                                                    is_enabled: command_enabled,
                                                                                    is_public: command_public,
                                                                                } as StreamCommand;

                                                                                const updatedCommands = streamSettings?.commands?.map((item, i) => {
                                                                                    if (i === index) {
                                                                                        return updatedCommand;
                                                                                    }

                                                                                    return item;
                                                                                });

                                                                                setStreamSettings({
                                                                                    ...streamSettings,
                                                                                    commands: updatedCommands,
                                                                                } as StreamSettings);

                                                                                toast.success("Command updated");
                                                                                console.log(updatedCommands);
                                                                            }
                                                                        }>
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center space-x-4">
                                                                                    <Label htmlFor="command_enabled" className="text-md">Enable command</Label>
                                                                                    <Switch id="command_enabled" className="h-5" defaultChecked={command.is_enabled} />
                                                                                </div>

                                                                                <div className="flex items-center space-x-4">
                                                                                    <Label htmlFor="command_public" className="text-md">Public command</Label>
                                                                                    <Switch id="command_public" className="h-5" defaultChecked={command.is_public} />
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex space-x-2 !ml-0">
                                                                                <Button variant="accent" className="h-8" id="save">Save</Button>
                                                                                <Button variant="destructive" className="h-8" id="delete">Delete</Button>
                                                                            </div>
                                                                        </form>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </ul>
                        </div>

                        {/* Customizations */}
                        <div className="w-1/3 h-full border-l border-r px-2">
                            <h1 className="text-2xl font-bold">
                                Customizations
                            </h1>

                            <ul className="space-y-2 mt-2">
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Emotes</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Alerts</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Notifications</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Bots</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                            </ul>
                        </div>

                        {/* Customizations */}
                        <div className="w-1/3 h-full px-2">
                            <h1 className="text-2xl font-bold">
                                Goals
                            </h1>

                            <ul className="space-y-2 mt-2">
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">
                                    <Label htmlFor="chat_enabled" className="text-md">View goals</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Subscription goals</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </li>
                                <li className="w-full rounded-xl border bg-card p-2 min-h-8 flex items-center justify-between hover:bg-card/40 cursor-pointer transition-all group">

                                    <Label htmlFor="chat_enabled" className="text-md">Gift goals</Label>
                                    <ArrowUpRightFromSquare className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-all" />

                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-1/4 bg-muted rounded-xl">
                        <h1 className="text-2xl font-bold p-2">
                            Previous goals
                        </h1>

                        <ul className="space-y-2 mt-2 mx-2">
                            <li className="w-full rounded-xl border bg-card p-2 min-h-8">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="chat_enabled" className="text-md">View goals</Label>
                                    <span>300 / 500</span>
                                </div>
                                <progress className="w-full h-2 rounded-xl [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent" value={50} max={100}></progress>
                            </li>
                            <li className="w-full rounded-xl border bg-card p-2 min-h-8">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="chat_enabled" className="text-md">Subscription goals</Label>
                                    <span>300 / 500</span>
                                </div>
                                <progress className="w-full h-2 rounded-xl [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent" value={50} max={100}></progress>
                            </li>
                            {/* <li className="w-full rounded-xl border bg-card p-2 min-h-8">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="chat_enabled" className="text-md">Gift goals</Label>
                                    <span>300 / 500</span>
                                </div>
                                <progress className="w-full h-2 rounded-xl [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent" value={50} max={100}></progress>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </CreatorLayout>
    )
}