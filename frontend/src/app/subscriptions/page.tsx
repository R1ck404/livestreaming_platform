import ClientPage from "./page.client";
import type { Metadata } from "next";

export default function Settings() {
    return (
        <ClientPage />
    )
}

export const metadata: Metadata = {
    title: "Settings"
}