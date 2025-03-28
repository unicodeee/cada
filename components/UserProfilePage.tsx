"use client";

import { signOut } from "next-auth/react";
import SignOutButton from "@components/SignOutButton";

interface UserProfileProps {
    name: string;
    email: string;
    image?: string;
}

const UserProfile = ({ name, email, image }: UserProfileProps) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-white">
            <div className="flex flex-col items-center gap-4">
                <img
                    src={image || "/default-avatar.png"} // fallback to a default image if no image is provided
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover"
                />
                <h2 className="text-2xl font-bold">{name}</h2>
                <h2 className="text-2xl font-bold">Log in</h2>
                <p className="text-sm text-gray-500">{email}</p>
            </div>
            <button
                onClick={() => signOut()}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
            >
                Sign Out
            </button>

            <SignOutButton/>
        </div>
    );
};

export default UserProfile;
