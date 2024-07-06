// import { TypedPocketBase } from "pocketbase-typegen/dist/index";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import PocketBase from "pocketbase";

export function createServerClient(cookieStore?: ReadonlyRequestCookies) {
    if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
        throw new Error("Pocketbase API url not defined !");
    }

    if (typeof window !== "undefined") {
        throw new Error(
            "This method is only supposed to call from the Server environment"
        );
    }

    const client = new PocketBase(
        process.env.NEXT_PUBLIC_POCKETBASE_API_URL
    );

    if (cookieStore) {
        const authCookie = cookieStore.get("pb_auth");

        if (authCookie) {
            client.authStore.loadFromCookie(`${authCookie.name}=${authCookie.value}`);
        }
    }

    return client;
}