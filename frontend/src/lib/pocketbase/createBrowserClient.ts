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

    singletonClient.autoCancellation(false);

    singletonClient.authStore.onChange((token, model) => {
        document.cookie = singletonClient!.authStore.exportToCookie({
            httpOnly: false,
        });

        try {
            // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
            singletonClient!.authStore.isValid && singletonClient!.collection('users').authRefresh();
        } catch (_) {
            // clear the auth store on failed refresh
            singletonClient!.authStore.clear();
        }

    });

    return singletonClient;
}