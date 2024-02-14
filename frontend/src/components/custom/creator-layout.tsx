"use client"

import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import Footer from "./footer";
import NavigationBar from "./navigation-bar";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";
import CreatorSidebar from "./creator-sidebar";
import CreatorNavigationBar from "./creator-navigation-bar";
import { usePathname } from "next/navigation";

type CreatorLayoutProps = {
    children: React.ReactNode;
    className?: string;
}
const client = createBrowserClient();

export default function CreatorLayout({ children, className }: CreatorLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex overflow-hidden w-screen h-screen" suppressHydrationWarning>
            <CreatorSidebar isUserAuthenticated={client.authStore.isValid} />

            <main className='w-full overflow-hidden pb-16'>
                <CreatorNavigationBar isUserAuthenticated={client.authStore.isValid} layoutOptions={pathname?.split("/").pop() === "stream"} />
                <section className={
                    cn(
                        "w-full overflow-scroll flex flex-col h-full pb-16",
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