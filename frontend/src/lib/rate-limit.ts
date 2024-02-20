import type { NextApiResponse } from "next";
import { LRUCache } from "lru-cache";

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export default function rateLimit(options?: Options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    let lastResponse: { statusCode: number, data: any } | null = null;
    let responseSent = false;

    return {
        check: (res: NextApiResponse, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;
                res.setHeader("X-RateLimit-Limit", limit);
                res.setHeader(
                    "X-RateLimit-Remaining",
                    isRateLimited ? 0 : limit - currentUsage,
                );

                if (isRateLimited && lastResponse) {
                    res.status(lastResponse.statusCode).json(lastResponse.data);
                    responseSent = true;
                    return resolve();
                }

                return isRateLimited ? reject() : resolve();
            }),
        setLastResponse: (statusCode: number, data: any) => {
            lastResponse = { statusCode, data };
        },
        responseSent: () => responseSent,
    };
}
