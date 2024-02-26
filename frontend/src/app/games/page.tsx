import ClientPage from "./page.client";
import type { Metadata } from 'next';

export default function Index() {
    return (
        <ClientPage />
    )
}

export const metadata: Metadata = {
    title: "Games"
};