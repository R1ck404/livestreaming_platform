"use client";

import Sidebar from '@/components/custom/sidebar'
import NavigationBar from '@/components/custom/navigation-bar'
import MainHero from '@/components/custom/main-hero'
import { usePageUserContext } from '@/context/PageUserContext';
import Footer from '@/components/custom/footer';
import PopularStreamers from '@/components/custom/popular-streamers';
import PopularGames from '@/components/custom/popular-games';
import DefaultLayout from '@/components/custom/default-layout';
import { fetchMostPopularStream, fetchStreams } from '@/lib/nms/NMSHelper';
import { createBrowserClient } from '@/lib/pocketbase/createBrowserClient';
import { useEffect, useState } from 'react';
import RecommendedStreamers from '@/components/custom/recommended-streamers';

export default function Index() {
    return (
        <DefaultLayout className='space-y-8'>
            <MainHero />
            <PopularStreamers />
            <PopularGames />
            <RecommendedStreamers />
        </DefaultLayout>
    )
}
