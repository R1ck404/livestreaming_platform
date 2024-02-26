import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "@/lib/rate-limit";
import { createServerClient } from "@/lib/pocketbase/createServerClient";
import { recommendStreams } from "@/lib/algorithms/RecommendedStreams";

const limiter = rateLimit({
    interval: 30 * 1000,
    uniqueTokenPerInterval: 500,
});

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
) {
    const pocketbaseClient = createServerClient();

    const { user_id, should_be_live } = _req.body;

    if (!user_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await limiter.check(res, 2, "token");

        if (limiter.responseSent()) {
            return;
        }

        console.log("Fetching recommended streams");

        const fetch_live_or_all = should_be_live !== undefined ? `is_live=${should_be_live}` : "(is_live=false || is_live=true)";
        const user_metrics = await pocketbaseClient.collection("user_metrics").getList(1, 50, { filter: `user="${user_id}"` }).catch(() => null);
        const streams = await pocketbaseClient.collection("streams").getList(1, 25, { filter: fetch_live_or_all }).catch((e) => console.log(e));

        if (!user_metrics || !streams) {
            return res.status(404).json({ error: "Not found" });
        }

        const recommended_streams = await recommendStreams(user_metrics.items as any, streams.items as any, 3);

        res.status(200).json({ streams: recommended_streams });
        limiter.setLastResponse(200, { streams: recommended_streams });

    } catch (e) {
        console.log(e);
        res.status(429).json({ error: "Rate limit exceeded" });
    }
}
