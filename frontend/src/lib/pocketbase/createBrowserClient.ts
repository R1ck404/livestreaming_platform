// import { TypedPocketBase } from "@/types/pocketbase-types";
import PocketBase from "pocketbase";

// let singletonClient: TypedPocketBase | null = null;
let singletonClient: PocketBase | null = null;

export function createBrowserClient() {
    if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
        throw new Error("Pocketbase API url not defined !");
    }

    const createNewClient = () => {
        return new PocketBase(
            process.env.NEXT_PUBLIC_POCKETBASE_API_URL
        );// as TypedPocketBase;
    };

    const _singletonClient = singletonClient ?? createNewClient();

    if (typeof window === "undefined") return _singletonClient;

    if (!singletonClient) singletonClient = _singletonClient;

    // singletonClient.autoCancellation(false);
    return singletonClient;
}