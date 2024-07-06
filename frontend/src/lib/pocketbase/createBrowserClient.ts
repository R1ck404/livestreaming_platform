import PocketBase from "pocketbase";

// let singletonClient: PocketBase | null = null;
// const cache: Map<string, any> = new Map();

// function objectToUrlParams(obj: any) {
//     return Object.keys(obj).reduce((acc, key, index) => {
//         const value = obj[key];
//         const prefix = index === 0 ? "?" : "&";
//         return `${acc}${prefix}${key}=${encodeURIComponent(value)}`;
//     }, "");
// }

// export function createBrowserClient() {
//     if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
//         throw new Error("Pocketbase API url not defined !");
//     }

//     const createNewClient = () => {
//         console.log("Creating new client");
//         const pb = new PocketBase(
//             process.env.NEXT_PUBLIC_POCKETBASE_API_URL
//         );

//         pb.authStore.loadFromCookie("pb_auth");
//         return pb;
//     };

//     const _singletonClient = singletonClient ?? createNewClient()
//     console.log("Singleton client", _singletonClient);
//     if (typeof window === "undefined") return _singletonClient;

//     if (!singletonClient) singletonClient = _singletonClient;

//     singletonClient.autoCancellation(false);

//     singletonClient.beforeSend = function (url, options) {
//         const query = objectToUrlParams(options.query);
//         const cacheKey = `${url}${query}`;

//         if (cache.has(cacheKey)) {
//             const response = new Response(JSON.stringify(cache.get(cacheKey)), {});

//             options.fetch = (url: RequestInfo | URL, config?: RequestInit | undefined) =>
//                 new Promise((resolve, reject) => {
//                     resolve(response);
//                 });
//         }

//         return { url, options };
//     };

//     singletonClient.afterSend = function (response, data) {
//         const cacheKey = response.url;
//         if (response.status === 200 && response.ok && !cache.has(cacheKey) && cacheKey.includes("/api/")) {
//             cache.set(cacheKey, data);
//         }
//         return data;
//     };

//     return singletonClient;
// }

let singletonClient: PocketBase | null = null;

export function createBrowserClient() {
    if (!process.env.NEXT_PUBLIC_POCKETBASE_API_URL) {
        throw new Error("Pocketbase API url not defined !");
    }

    const createNewClient = () => {
        return new PocketBase(
            process.env.NEXT_PUBLIC_POCKETBASE_API_URL
        );
    };

    const _singletonClient = singletonClient ?? createNewClient();

    if (typeof window === "undefined") return _singletonClient;

    if (!singletonClient) singletonClient = _singletonClient;

    singletonClient.authStore.onChange(() => {
        document.cookie = singletonClient!.authStore.exportToCookie({
            httpOnly: false,
        });
    });

    return singletonClient;
}