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

export default function PollsAndVotes() {
    return (
        <CreatorLayout className="p-6 w-full items-center">
            <div className="w-3/5 flex flex-col space-y-20 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-md z-0">
                    <h1 className="text-3xl font-bold text-center">
                        This page is under construction
                    </h1>
                </div>
            </div>
        </CreatorLayout >
    )
}