"use client";

import {signIn, useSession} from "next-auth/react";
import UserProfile from "@components/UserProfilePage";
import SignInButton from "@components/SignInButton";

export default function HomePage() {
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
                <main className="flex flex-col gap-6 items-center sm:items-start">
                    <h1 className="text-2xl font-bold text-center sm:text-left">Welcome</h1>
                    <SignInButton onClick={() => signIn("google")} />
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <UserProfile
                name={session.user?.name || "User"}
                email={session.user?.email || "No email"}
                // image={session.user?.image}
            />
        </div>
    );
}
