// pages/profile/about.tsx
"use client"
import React from "react";

export default function AboutPage() {
    return (
        <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
        <div className="min-h-screen bg-white px-6 py-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <img src="/cada_heart.png" alt="Heart" className="w-20 h-20"/>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-screen-2xl w-full mx-auto px-16 py-20">
                {/* Left Side */}
                <div>
                    <h2 className="text-3xl font-bold mb-3">Discover like-minded people 🫂</h2>
                    <p className="text-gray-600 mb-6 text-lg">
                        Share your interests, passions, and hobbies. We will connect you with people who share your
                        enthusiasm.
                    </p>

                    <input
                        type="text"
                        placeholder="🔍 Search interest"
                        className="w-full p-4 text-lg border rounded-xl mb-6"
                    />

                    <div className="flex flex-wrap gap-3 max-h-72 overflow-y-auto">
                        {[
                            "Travel", "Cooking", "Gaming", "Movies", "Photography", "Technology", "Art", "Yoga", "Music", "Fitness",
                            "Fashion", "Hiking", "Pets", "Painting", "Reading", "Dancing"
                        ].map((interest, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 px-4 py-2 rounded-full text-base hover:bg-purple-100 cursor-pointer"
                            >
                {interest}
              </span>
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div>
                    <h2 className="text-3xl font-bold mb-3">About Me</h2>
                    <textarea
                        placeholder="I'm an adventurous soul who loves exploring new places..."
                        className="w-full h-60 p-4 border rounded-xl bg-gray-50 text-lg resize-none"
                    />
                </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center mt-36">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-4 px-12 rounded-full">
                    Continue (5/5)
                </button>
            </div>
        </div>
        </main>
    );
}
