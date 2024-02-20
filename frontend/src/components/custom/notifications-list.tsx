import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient"
import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type NotificationListProps = {
    trigger: React.ReactNode;
}

export function NotificationsListModal({ trigger }: NotificationListProps) {
    const client = createBrowserClient();
    const [notifications, setNotifications] = useState<any>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const user_id = client.authStore.model?.id;
            if (!user_id) return;

            const notifications_list = await client.collection('notifications').getList(1, 10, { filter: `(is_read=false && user="${user_id}")` });
            console.log(notifications_list);
            setNotifications(notifications_list.items);
        }

        fetchNotifications();
    }, []);

    return (
        <Popover>
            <PopoverTrigger>
                {trigger}
            </PopoverTrigger>
            <PopoverContent sideOffset={20} collisionPadding={60} className="shadow-lg" >
                <div className="w-full rounded-lg divide-y divide-dashed hover:divide-solid">
                    {notifications.length === 0 && (
                        <div className="flex items-center justify-center py-2">
                            <p className="text-sm font-semibold">No new notifications</p>
                        </div>
                    )}
                    {notifications.map((notification: any) => (
                        <div key={notification.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${notification.is_read ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div className="ml-2">
                                    <p className="text-sm font-semibold">{notification.title}</p>
                                    <p className="text-xs text-gray-500">{notification.message}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">{notification.created ? new Date(notification.created).toLocaleString() : ''
                            }</div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>

    )
}