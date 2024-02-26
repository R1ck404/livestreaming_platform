"use client"

import DefaultLayout from "@/components/custom/default-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ClientPage() {
    const client = createBrowserClient();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        console.log(client)
        const fetchUser = async () => {
            const user_object = await client.collection('users').getOne(client.authStore.model?.id);
            const profile_picture = client.files.getUrl(user_object, user_object.avatar);

            user_object.avatar = profile_picture;
            console.log(user_object);
            setUser(user_object);
        }

        fetchUser();
    }, [client]);

    const submitProfile = async (e: any) => {
        e.preventDefault()
        const form_data = new FormData(e.target);

        if ((form_data.get('avatar') as File).name === "") {
            form_data.delete('avatar');
        }

        try {
            await client.collection('users').update(client.authStore.model?.id, form_data);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('An error occurred while updating your profile');
        }
    }

    return (
        <DefaultLayout className="p-6 w-full items-center scroll-smooth">
            <div className="flex space-x-2 w-3/5 bg-muted rounded-lg p-1">
                <Link href="#profile" className="w-1/3 text-center font-bold text-lg">
                    <Button className="w-full" variant="outline">Profile</Button>
                </Link>
                <Link href="#alerts_and_notifications" className="w-1/3 text-center font-bold text-lg">
                    <Button className="w-full" variant="outline">Alerts & Notifications</Button>
                </Link>
                <Link href="#security_and_privacy" className="w-1/3 text-center font-bold text-lg">
                    <Button className="w-full" variant="outline">Security & Privacy</Button>
                </Link>
            </div>

            <div className="w-3/5 flex flex-col space-y-20 mt-8">
                <div id="profile">
                    <h1 className="font-bold text-2xl mb-3">
                        Profile
                    </h1>

                    <form className="flex flex-col bg-muted border-border border last:border-b-0 rounded-xl overflow-hidden w-full" onSubmit={submitProfile}>
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="flex flex-row min-w-80 items-center space-x-4">
                                <Avatar className="border border-border w-16 h-16">
                                    <AvatarFallback>U</AvatarFallback>
                                    <AvatarImage src={user?.avatar} />
                                </Avatar>

                                <div className="flex flex-col">
                                    <p className="font-bold">
                                        Profile picture
                                    </p>

                                    <p>
                                        Must be JPEG or PNG and cannot exceed 5MB.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input type="file" className=" file:text-white" name="avatar" />
                            </div>
                        </div>
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Username
                                </p>

                                <p>
                                    Change your username
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input defaultValue={user?.username} disabled />
                            </div>
                        </div>
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Biography
                                </p>

                                <p>
                                    Tell your viewers about yourself
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Textarea defaultValue={user?.biography} name="biography" />
                            </div>
                        </div>

                        <div className="flex justify-end p-4">
                            <Button type="submit" className="w-1/4" variant="outline">Save</Button>
                        </div>
                    </form>
                </div>
                <div id="alerts_and_notifications">
                    <h1 className="font-bold text-2xl mb-3">
                        Alerts & Notifications
                    </h1>

                    <div className="flex flex-col bg-muted border-border border last:border-b-0 rounded-xl overflow-hidden w-full">
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Follower Alerts
                                </p>

                                <p>
                                    Notify me when someone follows me
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Switch />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="security_and_privacy">
                    <h1 className="font-bold text-2xl mb-3">
                        Security & Privacy
                    </h1>

                    <div className="flex flex-col bg-muted border-border border last:border-b-0 rounded-xl overflow-hidden w-full">
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Two-factor Authentication
                                </p>

                                <p>
                                    Add an extra layer of security
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Switch />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Change Password
                                </p>

                                <p>
                                    Change your password
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input defaultValue="Pass" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}