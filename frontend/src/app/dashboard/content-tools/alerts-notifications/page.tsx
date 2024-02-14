import CreatorLayout from "@/components/custom/creator-layout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { Slider } from "@/components/ui/slider"


export default function AlertsAndNotifications() {
    const client = createBrowserClient();

    return (
        <CreatorLayout className="p-6 w-full items-center">
            <div className="w-3/5 flex flex-col space-y-20">
                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Follower Alerts
                    </h1>

                    <div className="flex flex-col bg-muted border-border border rounded-xl overflow-hidden w-full">
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

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Alert Message Template
                                </p>

                                <p>
                                    Customize the message sent to followers
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input defaultValue="Hey, thanks for following me! I appreciate it." />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Duration of Alert
                                </p>

                                <p>
                                    Set the duration of the alert
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Slider defaultValue={[5]} max={30} step={1} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Donation Alerts
                    </h1>

                    <div className="flex flex-col bg-muted border-border border rounded-xl overflow-hidden w-full">
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Donation Alerts
                                </p>

                                <p>
                                    Notify me when someone donates to me
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Switch />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Alert Message Template
                                </p>

                                <p>
                                    Customize the message sent to followers
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input defaultValue="Hey, thanks for following me! I appreciate it." />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Duration of Alert
                                </p>

                                <p>
                                    Set the duration of the alert
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Slider defaultValue={[5]} max={30} step={1} />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Host & Raid Alerts
                    </h1>

                    <div className="flex flex-col bg-muted border-border border rounded-xl overflow-hidden w-full">
                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Host & Raid Alerts
                                </p>

                                <p>
                                    Notify me when someone hosts or raids me
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Switch />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Alert Message Template
                                </p>

                                <p>
                                    Customize the message sent to followers
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Input defaultValue="Hey, thanks for following me! I appreciate it." />
                            </div>
                        </div>

                        <div className="min-h-24 w-full border-b border-border flex p-4">
                            <div className="min-w-80 flex flex-col">
                                <p className="font-bold">
                                    Duration of Alert
                                </p>

                                <p>
                                    Set the duration of the alert
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <Slider defaultValue={[5]} max={30} step={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CreatorLayout >
    )
}