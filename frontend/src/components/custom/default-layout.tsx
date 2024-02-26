"use client"

import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import Footer from "./footer";
import NavigationBar from "./navigation-bar";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";

type DefaultLayoutProps = {
    children: React.ReactNode;
    className?: string;
}

const client = createBrowserClient();

export default function DefaultLayout({ children, className }: DefaultLayoutProps) {
    return (
        <div className="flex overflow-hidden w-screen h-screen" suppressHydrationWarning>
            <Sidebar isUserAuthenticated={client.authStore.isValid} />

            <main className='w-full overflow-hidden'>
                <NavigationBar isUserAuthenticated={client.authStore.isValid} />
                <section className={
                    cn(
                        "w-full overflow-scroll flex flex-col h-full !pb-24",
                        className
                    )
                }>
                    {children}
                    <Footer />
                </section>
            </main>
        </div>
    )
}