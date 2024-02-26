"use client"

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/pocketbase/createBrowserClient";
import { toast } from "sonner";
import Link from "next/link";

export default function ClientPage() {
    const { push, replace } = useRouter();
    const pocketbase = createBrowserClient();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const email = form.email.value;
        const password = form.password.value;

        const promise = pocketbase.collection("users").authWithPassword(email, password);

        toast.promise(promise, {
            loading: "Logging in...",
            success: "Logged in successfully",
            error: "Failed to login"
        });

        promise.then((user) => {
            replace("/");
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-sm rounded-xl shadow-lg bg-muted p-4">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        By logging in, you accept our Terms of Service and Privacy Policy
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="johndoe@example.com" required type="email" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="password" required type="password" />
                    </div>
                    <Button type="submit" variant="accent" className="w-full">Login</Button>
                </form>

                <div className="mt-2 mx-2 text-accent flex justify-between">
                    <Link href="/register">
                        Register
                    </Link>
                    <Link href="/forgot-password">
                        Forgot password
                    </Link>
                </div>
            </div>
        </div>
    )
}