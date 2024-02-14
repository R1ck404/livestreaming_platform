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
        title: "First Goal",
        description: "This is the first goal",
        type: "followers",
        progress: 23,
        target: 100
    },
    {
        title: "Second Goal",
        description: "This is the second goal",
        type: "donations",
        progress: 72,
        target: 100
    },
    {
        title: "Third Goal",
        description: "This is the third goal",
        type: "chat_messages",
        progress: 44,
        target: 100
    }
]

export default function GoalsAndMilestones() {
    return (
        <CreatorLayout className="p-6 w-full items-center">
            <div className="w-3/5 flex flex-col space-y-20">
                <div>
                    <h1 className="font-bold text-2xl mb-3">
                        Goals and Milestones
                    </h1>


                    <div className="flex flex-row justify-between bg-muted border-border border rounded-xl overflow-hidden w-full h-fit mb-4 p-2 space-x-2">
                        <Input placeholder="Find goal" />
                        <Button className="w-24">Add</Button>
                    </div>


                    <div className="flex flex-col bg-muted border-border border rounded-xl overflow-hidden w-full">
                        {temporaryData.length <= 0 && (
                            <div className="flex justify-center items-center p-4">
                                <p className="text-lg font-bold">
                                    No goals or milestones set
                                </p>
                            </div>
                        )}

                        <Accordion type="single" collapsible>
                            {temporaryData.map((goal, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="flex justify-between pr-4">
                                        <div className="flex justify-between items-center p-4">
                                            <p className="font-bold">
                                                {goal.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4 min-w-56 w-full">
                                                <Progress value={goal.progress} className="w-full" />
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4">
                                            <div className="flex flex-col space-y-4">
                                                <div>
                                                    <p className="font-bold">
                                                        Goal Title
                                                    </p>
                                                    <Input defaultValue={goal.title} />
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Goal Description
                                                    </p>
                                                    <Input defaultValue={goal.description} />
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Goal Type
                                                    </p>
                                                    <Input defaultValue={goal.type} />
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Goal Target
                                                    </p>
                                                    <Input defaultValue={goal.target} />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                    </div>
                </div>
            </div>
        </CreatorLayout >
    )
}