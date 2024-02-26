import { Metadata } from "next";
import ClientPage from "./page.client"

export default function Explore() {
    return (
        <ClientPage />
    )
}

export const metadata: Metadata = {
    title: "Explore"
};