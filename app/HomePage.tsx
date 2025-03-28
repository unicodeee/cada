"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const { data: session } = useSession();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login submitted:", { username, password, rememberMe });
    };

    const handleGoogleSignIn = () => {
        signIn("google"); // Trigger Google Sign-In
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <main className="flex flex-col gap-6 items-center sm:items-start">
                <div
                    className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
                />
                <h1 className="text-2xl font-bold text-center sm:text-left">Welcome</h1>
                {!session ? (
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                    >
                        Sign in with Google
                    </button>
                ) : (
                    <div>
                        <p>Signed in as {session.user?.email}</p>
                        <button
                            onClick={() => signOut()} // Sign out if already logged in
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                        >
                            Sign Out
                        </button>
                    </div>
                )}

                {!session && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center sm:items-start w-full max-w-md">
                        <label className="flex flex-col gap-1 w-full">
                            <span className="text-sm font-medium">Username</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username"
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-1 w-full">
                            <span className="text-sm font-medium">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </label>

                        <div className="flex justify-between w-full items-center">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="rounded"
                                />
                                Remember Me
                            </label>
                            <a href="#" className="text-blue-500 hover:underline text-sm">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        >
                            Login
                        </button>
                    </form>
                )}

                <div className="text-sm text-center sm:text-left">
                    Don’t have an account?{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </div>
            </main>
        </div>
    );
}
