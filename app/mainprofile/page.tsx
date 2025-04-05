// app/profile/page.tsx
"use client";

import { useState } from 'react';

export default function ProfilePage() {
    const [profileComplete, setProfileComplete] = useState(true);

    // Mock user data
    const user = {
        name: "Andrew",
        age: 27,
        gender: "Man",
        pronouns: "(he/him/his)",
        height: "185 cm",
        weight: "76 kg",
        occupation: "Software Engineer at San Jose States",
        education: "San Jose States University",
        location: "Live in San Jose ",
        image: "/avatars/monica.jpg" // Assuming you have this in your public folder
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-semibold text-center flex-1">Profile</h1>
                <button className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </header>

            {/* Profile completion notification */}
            {profileComplete && (
                <div className="bg-purple-600 text-white p-4 m-4 rounded-lg flex items-start">
                    <div className="relative mr-4">
                        <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold">100%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Your profile is complete!</h3>
                        <p>Enjoy the best experience of dating and better matches!</p>
                    </div>
                    <button onClick={() => setProfileComplete(false)} className="text-white">
                        ×
                    </button>
                </div>
            )}

            {/* Profile photo - THIS IS WHERE YOU ADD THE IMAGE */}
            <div className="relative mx-auto w-full max-w-md my-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1531891570158-e71b35a485bc?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3"
                        alt="Profile photo"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Carousel indicators (simplified) */}
                <div className="flex justify-center mt-2 space-x-1">
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full ${index === 0 ? 'bg-purple-600 w-8' : 'bg-gray-300 w-1'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Profile info */}
            <div className="px-4 py-2">
                <h2 className="text-2xl font-bold">{user.name} ({user.age})</h2>

                <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{user.gender} {user.pronouns}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>📏</span>
                        <span>{user.height}, {user.weight}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>💼</span>
                        <span>{user.occupation}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>🎓</span>
                        <span>{user.education}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{user.location}</span>
                    </div>
                </div>
            </div>


            {/* Edit profile button */}
            <div className="fixed bottom-20 right-4">
                <button className="bg-purple-600 text-white p-4 rounded-full shadow-lg">
                    ✏️
                </button>
            </div>
        </div>
    );
}