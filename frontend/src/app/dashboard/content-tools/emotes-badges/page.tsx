import CreatorLayout from "@/components/custom/creator-layout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { Slider } from "@/components/ui/slider"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";


const temporaryData = [
    {
        title: "First Emote",
        description: "This is the first emote",
        type: "emote",
    },
    {
        title: "Second Emote",
        description: "This is the second emote",
        type: "emote",
    },
    {
        title: "Third Emote",
        description: "This is the third emote",
        type: "emote",
    }

]

export default function EmotesAndBadges() {
    return (
        <CreatorLayout className="p-6 w-full items-center">
            <div className="w-3/5 flex flex-col space-y-20">
                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Emotes And Badges
                    </h1>


                    <div className="flex flex-row justify-between bg-muted border-border border rounded-xl overflow-hidden w-full h-fit mb-4 p-2 space-x-2">
                        <Input placeholder="Find Emote" />
                        <Button className="w-24">
                            Add
                        </Button>
                    </div>


                    <div className="flex flex-col bg-muted border-border border rounded-xl overflow-hidden w-full">
                        {temporaryData.length <= 0 && (
                            <div className="flex justify-center items-center p-4">
                                <p className="text-lg font-bold">
                                    No emotes or badges set
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap">
                            {temporaryData.map((emote, index) => (
                                <div key={index} className="w-1/3 p-4">
                                    <div className="flex flex-col bg-background rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">
                                                {emote.title}
                                            </p>
                                            <Switch />
                                        </div>
                                        <div className="flex flex-col space-y-2 mt-2">
                                            <Input
                                                defaultValue={emote.title}
                                            />
                                            <Input
                                                defaultValue={emote.title}
                                            />
                                            <Input
                                                defaultValue={emote.title}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CreatorLayout >
    )
}