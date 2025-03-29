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
                    src={image || "/emptyAvatar.jpg"} // fallback to a default image if no image is provided
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover"
                />
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-sm text-gray-500">{email}</p>
            </div>

            <SignOutButton/>
        </div>
    );
};

export default UserProfile;
