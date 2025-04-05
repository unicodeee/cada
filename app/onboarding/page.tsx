// pages/profile/onboarding.tsx
"use client"

import React, { useState } from 'react';

export default function Onboarding() {
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState({ mm: '', dd: '', yyyy: '' });
    const [gender, setGender] = useState('');
    const [orientation, setOrientation] = useState('');

    const handleContinue = () => {
        console.log({ nickname, birthdate, gender, orientation });
        // eventually make a POST request to backend
    };

    return (
        <div className="min-h-screen px-8 py-12 flex flex-col items-center space-y-8 overflow-y-scroll bg-white">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Your CADA identity 😎</h2>
                <p className="text-gray-600">Create a unique nickname that represents you.</p>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="mt-4 w-full border border-gray-300 rounded-lg p-3 text-center font-semibold text-lg"
                />
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-bold">Lets celebrate you 🎂</h2>
                <p className="text-gray-600">We only use this to calculate your age.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        value={birthdate.mm}
                        onChange={(e) => setBirthdate({ ...birthdate, mm: e.target.value })}
                        className="w-16 border-b border-gray-400 text-center"
                    />
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="DD"
                        value={birthdate.dd}
                        onChange={(e) => setBirthdate({ ...birthdate, dd: e.target.value })}
                        className="w-16 border-b border-gray-400 text-center"
                    />
                    <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        value={birthdate.yyyy}
                        onChange={(e) => setBirthdate({ ...birthdate, yyyy: e.target.value })}
                        className="w-20 border-b border-gray-400 text-center"
                    />
                </div>
            </div>

            <div className="w-full">
                <h2 className="text-2xl font-bold">Be true to yourself ✨</h2>
                <p className="text-gray-600">Choose the gender that best represents you.</p>
                <div className="flex flex-col mt-4 space-y-3">
                    {['Man', 'Woman', 'More'].map((option) => (
                        <button
                            key={option}
                            onClick={() => setGender(option)}
                            className={`p-3 rounded-full border ${gender === option ? 'bg-purple-600 text-white' : 'bg-white text-black border-gray-300'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <h2 className="text-2xl font-bold mt-6">Sexual Orientation</h2>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {['Gay', 'Lesbian', 'Pansexual', 'Demisexual', 'Bisexual'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setOrientation(opt)}
                            className={`p-3 rounded-full border ${orientation === opt ? 'bg-purple-600 text-white' : 'bg-white text-black border-gray-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="mt-8 w-full bg-purple-600 text-white font-semibold py-3 rounded-full"
            >
                Continue
            </button>
        </div>
    );
}
