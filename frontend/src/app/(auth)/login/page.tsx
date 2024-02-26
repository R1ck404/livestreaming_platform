import ClientPage from "./page.client";
import type { Metadata } from 'next';

export default function Page() {
    return (
        <ClientPage />
    )
}

export const metadata: Metadata = {
    title: "Login"
};