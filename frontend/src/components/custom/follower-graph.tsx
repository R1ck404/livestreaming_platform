"use client";

import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { useEffect, useState } from "react";

export default function FollowerGraph() {
    const client = createBrowserClient();
    const [followers, setFollowers] = useState<any[]>([]);
    const [dayData, setDayData] = useState<any[]>([]);

    function getDateSevenDaysAgo(): string {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7);

        let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} 00:00:00`;

        return formattedDate;
    }

    function generatePastSevenDays(): string[] {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    useEffect(() => {
        const user_id = client.authStore.model?.id;

        if (!user_id) return;

        const getFollowers = async () => {
            const filteredFollowers = await client.collection("followers").getFullList({ filter: `following="${user_id}" && created >= "${getDateSevenDaysAgo()}"` });

            setFollowers(filteredFollowers);

            const groupedFollowers: any = {};
            filteredFollowers.forEach((follower: any) => {
                const createdDate = new Date(follower.created).toISOString().split('T')[0];
                if (!groupedFollowers[createdDate]) {
                    groupedFollowers[createdDate] = 1;
                } else {
                    groupedFollowers[createdDate]++;
                }
            });

            const pastSevenDays = generatePastSevenDays();
            const dayDataArray = pastSevenDays.map(date => ({ date, count: groupedFollowers[date] || 0 }));
            setDayData(dayDataArray);
        };

        getFollowers();
    }, [client.authStore.model?.id]);

    return (
        <div>
            <div className="flex justify-between items-end">
                <div className="flex flex-row space-x-4">
                    {dayData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center mb-2">
                            <div className="bg-muted w-8 h-48 flex items-end rounded-t-xl rounded-b">
                                <div className="bg-accent rounded-b" style={{ height: `${(data.count / 10) * 100}%`, width: '100%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
