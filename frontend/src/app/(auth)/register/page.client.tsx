"use client"

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function ClientPage() {
    const [currentPage, setCurrentPage] = useState("step_1");
    const [firstForm, setFirstForm] = useState({ email: "", password: "", confirm_password: "" });
    const [secondForm, setSecondForm] = useState({ username: "", biography: "" } as any);
    const { push, replace } = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;

        const email = firstForm.email;
        const password = firstForm.password;
        const confirm_password = firstForm.confirm_password;

        const username = form.username.value;
        const biography = form.biography.value;

        const promise = fetch("/api/authentication/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                passwordConfirm: confirm_password,
                username: username,
                biography: biography
            })
        });

        toast.promise(promise, {
            loading: "Registering account...",
            success: "Account registered successfully",
            error: "Failed to register account"
        });

        promise.then((res) => {
            console.log(res);

            if (res.ok) {
                replace("/login");
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Tabs defaultValue="step_1" className="w-[400px]" value={currentPage}>
                    <TabsList className='w-full'>
                        <TabsTrigger value="step_1" className='w-full' onClick={() => {
                            const form = document.querySelector("form") as HTMLFormElement;
                            const username = form.username.value;
                            const biography = form.biography.value;
                            setSecondForm({ username, biography });
                            setCurrentPage('step_1');
                        }}>Registration</TabsTrigger>
                        <TabsTrigger value="step_2" className='w-full' disabled={currentPage === "step_1"}>About you</TabsTrigger>
                    </TabsList>
                    <TabsContent value="step_1">
                        <div className="w-full rounded-xl shadow-lg bg-muted p-4 space-y-3">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="johndoe@example.com" required name='email' type="email" defaultValue={firstForm?.email ?? ""} />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="password" required name='password' type="password" defaultValue={firstForm?.password ?? ""} />
                            </div>
                            <div>
                                <Label htmlFor="confirm_password">Confirm password</Label>
                                <Input id="confirm_password" placeholder="password" name='confirm_password' required type="password" defaultValue={firstForm?.confirm_password ?? ""} />
                            </div>
                            <Button type="button" variant="accent" className="w-full" onClick={() => {
                                const form = document.querySelector("form") as HTMLFormElement;
                                const email = form.email.value;
                                const password = form.password.value;
                                const confirm_password = form.confirm_password.value;
                                if (password === confirm_password) {
                                    setFirstForm({ email, password, confirm_password });
                                    setCurrentPage('step_2');
                                } else {
                                    toast.error("Passwords do not match");
                                }

                            }}>Continue</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="step_2">
                        <div className="w-full rounded-xl shadow-lg bg-muted p-4 space-y-3">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="your username" name='username' required type="text" defaultValue={secondForm?.username ?? ""} />
                            </div>
                            <div>
                                <Label htmlFor="biography">Biography</Label>
                                <Textarea id="biography" placeholder="Information about you" name='biography' required defaultValue={secondForm?.biography ?? ""} />
                            </div>
                            <div className="space-x-2 flex">
                                <Button type="button" variant="accent" className="w-full" onClick={() => {
                                    const form = document.querySelector("form") as HTMLFormElement;
                                    const username = form.username.value;
                                    const biography = form.biography.value;
                                    setSecondForm({ username, biography });
                                    setCurrentPage('step_1');
                                }}>Back</Button>
                                <Button type="submit" variant="accent" className="w-full">Register</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    )
}