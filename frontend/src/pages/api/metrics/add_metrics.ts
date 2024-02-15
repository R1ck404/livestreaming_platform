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

    const { user_id, stream_key, type } = _req.body;

    if (!user_id || !stream_key || !type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const types = ["chat", "view", "follow", "share", "like"];
    if (!types.includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
    }

    console.log(user_id, stream_key, type);

    try {
        await limiter.check(res, 25, "CACHE_TOKEN");

        const stream = await pocketbaseClient.collection("streams").getFirstListItem(`stream_key="${stream_key}"`).catch((e) => console.log(e));

        if (!stream) {
            return res.status(404).json({ error: "Stream not found" });
        }

        console.log(stream?.id, stream?.tags, type, user_id)

        await pocketbaseClient.collection("user_metrics").create({
            user: user_id,
            stream: stream?.id,
            interaction_type: type,
            stream_tags: stream?.tags,
        }).catch((e) => console.log(e));

        res.status(200).json({ success: true });

    } catch {
        res.status(429).json({ error: "Rate limit exceeded" });
    }
}
