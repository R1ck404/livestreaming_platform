"use client"

import DefaultLayout from "@/components/custom/default-layout";
import PopularStreamersExplore from "@/components/custom/popular-streamers-explore";
import RecentlyWatched from "@/components/custom/recently-watched";

import RecommendedStreamers from '@/components/custom/recommended-streamers';
export default function Explore() {
    return (
        <DefaultLayout>
            <section className='h-full relative rounded-lg flex flex-col px-6 mt-8 space-y-16'>
                <PopularStreamersExplore />
                <RecommendedStreamers />
                <RecentlyWatched />
            </section>
        </DefaultLayout>
    )
}