"use server";

import jwt from "jsonwebtoken";

type Payload = {
    [key: string]: any;
};

export async function generateJWTToken(payload: Payload) {
    const expiresIn = '1h';

    const secret = process.env.JWT_SECRET || "default_secret";

    return jwt.sign(payload, secret, { expiresIn });
}