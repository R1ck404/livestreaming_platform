import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "@/lib/rate-limit";
import { createServerClient } from "@/lib/pocketbase/createServerClient";

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse,
) {
    const pocketbaseClient = createServerClient();
    const { email, password, passwordConfirm, username, biography } = _req.body;
    if (!email || !password || !passwordConfirm || !username || !biography) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        await limiter.check(res, 5, "register_token" as string);

        await pocketbaseClient.collection("users").create({
            email,
            password,
            passwordConfirm,
            username,
            biography,
        }).catch((error) => {
            console.error(error);
            return res.status(400).json({ error: "Error creating user" });
        });

        res.status(200).json({ message: "User created successfully" });
    } catch {
        res.status(429).json({ error: "Rate limit exceeded" });
    }
}
