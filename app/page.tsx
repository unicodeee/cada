'use client'
import * as React from "react"

import {Button} from "@/components/ui/button"
import {signIn, useSession} from "next-auth/react";
import UserCard from "@components/usercard";


export default function CardWithForm() {

    const { data: session, status } = useSession();


    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
                <main className="flex flex-col gap-6 items-center text-center">
                    <h1 className="text-5xl font-bold">Welcome to CADA: Campus Dating</h1>
                    <Button className="px-6 py-3 text-lg sm:text-xl font-semibold" onClick={() => signIn("google")}>
                        Sign in
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <UserCard
                name={session.user?.name || "User"}
                email={session.user?.email || "No email"}
                image={session.user?.image || undefined}
            />
        </div>
    );

}
