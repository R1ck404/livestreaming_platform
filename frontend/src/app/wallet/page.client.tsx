"use client"

import DefaultLayout from "@/components/custom/default-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ClientPage() {
    const client = createBrowserClient();
    const [user, setUser] = useState<any>(null);

    return (
        <DefaultLayout className="p-6 w-full items-center scroll-smooth">
            <div className="w-3/5 flex flex-col space-y-20 mt-8">
                <Tabs defaultValue="wallet" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="wallet" className="w-full">Wallet</TabsTrigger>
                        <TabsTrigger value="payment_history" className="w-full">Payment History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallet">
                        <div className="flex flex-col bg-muted border-border border last:border-b-0 divide-y rounded-xl overflow-hidden w-full">
                            <div className="w-full p-4">
                                <h1 className="text-md">
                                    Gift Card Balance
                                </h1>
                                <p className="font-bold text-4xl mt-1">
                                    $0.00 Dollars
                                </p>

                                <div className="space-x-4 mt-5">
                                    <Link href="/wallet/add-funds">
                                        <Button variant="outline">Purchase Gift Card</Button>
                                    </Link>
                                    <Link href="/wallet/redeem-gift-card">

                                        <Button variant="outline">Redeem Gift Card</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full p-4">
                                <h1 className="text-md">
                                    Payment Methods
                                </h1>
                                <p className="font-bold text-4xl mt-1">
                                    You have no payment methods saved.
                                </p>
                                <div className="mt-5">
                                    <Link href="/wallet/payment-methods">
                                        <Button variant="outline">Manage Payment Methods</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="payment_history">
                        <div className="flex flex-col bg-muted border-border border last:border-b-0 divide-y rounded-xl overflow-hidden w-full">
                            <div className="w-full p-4">
                                <h1 className="text-md">
                                    Payment History
                                </h1>
                                <p className="font-bold text-4xl mt-1">
                                    No payment history available.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DefaultLayout>
    )
}