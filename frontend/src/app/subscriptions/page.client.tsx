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
            <div className="w-3/5 flex flex-col space-y-20 mt-8">
                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Subscriptions
                    </h1>

                    <div className="flex space-x-4">
                        <SubscriptionCard title="Basic" price="10" description=" " features={["Enhanced Chat Features", "Standard Video Quality", "40% less ads"]} />
                        <SubscriptionCard title="Pro" price="20" description="Includes everything in Basic, plus:" features={["Customizable profile", "60% less ads", "Priority Support"]} />
                        <SubscriptionCard title="Enterprise" price="30" description="Includes everything in Pro, plus:" features={["Higher Video Quality", "Enhanced Analytics", "Customizable Stream Overlays and Graphics", "Customizable Embeds and Widgets"]} />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

function SubscriptionCard({ title, price, description, features }: any) {
    return (
        <div className="rounded-xl w-1/3 min-h-[28rem] relative" style={{ backgroundImage: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)" }}>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center">
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <h1 className="text-white font-bold text-2xl mb-3">
                        {title}
                    </h1>
                    <h1 className="text-white font-bold text-4xl mb-3">
                        ${price}
                    </h1>
                    <p className="text-white text-center">
                        {description}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    {features.map((feature: string, index: number) => (
                        <p key={index} className="text-white text-center">
                            {feature}
                        </p>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <Button className="bg-white text-black">
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    )
}