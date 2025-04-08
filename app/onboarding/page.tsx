
"use client"
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {Label} from "@components/ui/label";
import {Input} from "@components/ui/input";
import {Button1, Button2} from "@components/ui/button";
import {allGenders, allSexualOrientations} from "@lib/data";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Onboarding(){
    const { data: session } = useSession();
    return (
        <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
        <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8 overflow-y-auto">
            {/* Heart Progress */}
            <div className="mb-12 text-center">
                <img src="/cada_heart.png" alt="Heart" className="w-20 h-20"/>
            </div>

            {/* Content */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24">
                {/* Left Column */}
                <div>
                    {/* CADA Identity */}
                    <div className="mb-28">
                        <h2 className="text-2xl font-bold mb-2">Hi {session?.user?.name? session.user.name: "CADA identity 😎"} </h2>
                        <p className="text-gray-600 mb-4">
                            Create a unique nickname that represents you. It’s how others will know and remember you.
                        </p>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="preferredName">Preferred Name</Label>
                            <Input id="preferredName" placeholder="Your preferred name"/>
                        </div>
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Be true to yourself ✨</h2>
                        <p className="text-gray-600 mb-4">
                            Choose the gender that best represents you.
                        </p>
                        <div className="flex flex-col gap-4">
                            {Object.entries(allGenders()).map(([key, value]) => (
                            <Button2 key={key} value={key}>{value}</Button2>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Birthday */}
                    <div className="mb-28">
                        <h2 className="text-2xl font-bold mb-2">Let’s celebrate you 🎂</h2>
                        <p className="text-gray-600 mb-4">
                            Tell us your birthdate. Your profile doesn’t display your birthdate, only your age.
                        </p>
                        <div className="flex gap-4">
                            <Input id="preferreDate" placeholder="DD"/>
                            <Input id="preferreMonth" placeholder="MM"/>
                            <Input id="preferredYear" placeholder="YYYY"/>
                        </div>
                    </div>

                    {/* Orientation */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Sexual Orientation</h2>
                        <div className="flex flex-col gap-4">
                            {Object.entries(allSexualOrientations()).map(([key, value]) => (
                                <Button2 key={key} value={key}>{value}</Button2>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>

            {/* Continue Button */}
            <div className="mt-20 w-full max-w-md">
                <Link href="/aboutme">
                <Button2 className="w-full bg-purple-600 text-white rounded-full py-3 font-semibold">
                    Continue
                </Button2>
                </Link>
            </div>
        </div>
        </main>
    );
};



