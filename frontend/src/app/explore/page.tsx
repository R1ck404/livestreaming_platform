"use client"

import DefaultLayout from "@/components/custom/default-layout";
import RecentlyWatched from "@/components/custom/recent-views";

import RecommendedStreamers from '@/components/custom/recommended-streamers';
export default function Explore() {
    return (
        <DefaultLayout>
            <section className='h-full relative rounded-lg flex flex-col px-6 mt-8 space-y-16'>
                <RecommendedStreamers />
                <RecentlyWatched />
            </section>
        </DefaultLayout>
    )
}