import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "@/lib/rate-limit";
import { createServerClient } from "@/lib/pocketbase/createServerClient";
import { recommendStreams } from "@/lib/algorithms/RecommendedStreams";

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
) {
    const pocketbaseClient = createServerClient();

    const { user_id } = _req.body;
    if (!user_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await limiter.check(res, 50, "CACHE_TOKEN"); // 5 requests per minute

        const user_metrics = await pocketbaseClient.collection("user_metrics").getList(1, 50, { filter: `user="${user_id}"` });
        console.log(user_metrics);
        const streams = await pocketbaseClient.collection("streams").getList(1, 25);
        const recommended_streams = recommendStreams(user_metrics.items as any, streams.items as any, 3);

        res.status(200).json({ streams: recommended_streams });

    } catch {
        res.status(429).json({ error: "Rate limit exceeded" });
    }
}
