// pages/profile/onboarding.tsx
"use client"
// pages/profile/onboarding.tsx
// pages/profile/onboarding.tsx
// pages/profile/onboarding.tsx
import React from "react";

const Onboarding = () => {
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
                        <h2 className="text-2xl font-bold mb-2">Your CADA identity 😎</h2>
                        <p className="text-gray-600 mb-4">
                            Create a unique nickname that represents you. It’s how others will know and remember you.
                        </p>
                        <input
                            type="text"
                            placeholder="Andrew"
                            className="w-full p-3 border border-gray-300 rounded-xl"
                        />
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Be true to yourself ✨</h2>
                        <p className="text-gray-600 mb-4">
                            Choose the gender that best represents you.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button className="rounded-full px-4 py-2 bg-purple-500 text-white font-semibold">
                                Man
                            </button>
                            <button className="rounded-full px-4 py-2 border">Woman</button>
                            <button className="rounded-full px-4 py-2 border">More</button>
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
                            <input type="text" placeholder="MM" className="w-1/3 p-3 border border-gray-300 rounded-xl" />
                            <input type="text" placeholder="DD" className="w-1/3 p-3 border border-gray-300 rounded-xl" />
                            <input type="text" placeholder="YYYY" className="w-1/3 p-3 border border-gray-300 rounded-xl" />
                        </div>
                    </div>

                    {/* Orientation */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Sexual Orientation</h2>
                        <div className="flex flex-col gap-4">
                            {["Gay", "Lesbian", "Pansexual", "Demisexual", "Bisexual"].map((label) => (
                                <button
                                    key={label}
                                    className="rounded-full px-4 py-2 border"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <div className="mt-20 w-full max-w-md">
                <button className="w-full bg-purple-600 text-white rounded-full py-3 font-semibold">
                    Continue
                </button>
            </div>
        </div>
        </main>
    );
};

export default Onboarding;



// import React, { useState } from 'react';
//
// export default function Onboarding() {
//     const [nickname, setNickname] = useState('');
//     const [birthdate, setBirthdate] = useState({ mm: '', dd: '', yyyy: '' });
//     const [gender, setGender] = useState('');
//     const [orientation, setOrientation] = useState('');
//
//     const handleContinue = () => {
//         console.log({ nickname, birthdate, gender, orientation });
//         // eventually make a POST request to backend
//     };
//
//     return (
//         <div className="min-h-screen px-8 py-12 flex flex-col items-center space-y-8 overflow-y-scroll bg-white">
//             <div className="text-center">
//                 <h2 className="text-3xl font-bold">Your CADA identity 😎</h2>
//                 <p className="text-gray-600">Create a unique nickname that represents you.</p>
//                 <input
//                     type="text"
//                     value={nickname}
//                     onChange={(e) => setNickname(e.target.value)}
//                     placeholder="Enter your nickname"
//                     className="mt-4 w-full border border-gray-300 rounded-lg p-3 text-center font-semibold text-lg"
//                 />
//             </div>
//
//             <div className="text-center">
//                 <h2 className="text-3xl font-bold">Lets celebrate you 🎂</h2>
//                 <p className="text-gray-600">We only use this to calculate your age.</p>
//                 <div className="flex justify-center space-x-4 mt-4">
//                     <input
//                         type="text"
//                         maxLength={2}
//                         placeholder="MM"
//                         value={birthdate.mm}
//                         onChange={(e) => setBirthdate({ ...birthdate, mm: e.target.value })}
//                         className="w-16 border-b border-gray-400 text-center"
//                     />
//                     <input
//                         type="text"
//                         maxLength={2}
//                         placeholder="DD"
//                         value={birthdate.dd}
//                         onChange={(e) => setBirthdate({ ...birthdate, dd: e.target.value })}
//                         className="w-16 border-b border-gray-400 text-center"
//                     />
//                     <input
//                         type="text"
//                         maxLength={4}
//                         placeholder="YYYY"
//                         value={birthdate.yyyy}
//                         onChange={(e) => setBirthdate({ ...birthdate, yyyy: e.target.value })}
//                         className="w-20 border-b border-gray-400 text-center"
//                     />
//                 </div>
//             </div>
//
//             <div className="w-full">
//                 <h2 className="text-2xl font-bold">Be true to yourself ✨</h2>
//                 <p className="text-gray-600">Choose the gender that best represents you.</p>
//                 <div className="flex flex-col mt-4 space-y-3">
//                     {['Man', 'Woman', 'More'].map((option) => (
//                         <button
//                             key={option}
//                             onClick={() => setGender(option)}
//                             className={`p-3 rounded-full border ${gender === option ? 'bg-purple-600 text-white' : 'bg-white text-black border-gray-300'}`}
//                         >
//                             {option}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//
//             <div className="w-full">
//                 <h2 className="text-2xl font-bold mt-6">Sexual Orientation</h2>
//                 <div className="grid grid-cols-2 gap-3 mt-4">
//                     {['Gay', 'Lesbian', 'Pansexual', 'Demisexual', 'Bisexual'].map((opt) => (
//                         <button
//                             key={opt}
//                             onClick={() => setOrientation(opt)}
//                             className={`p-3 rounded-full border ${orientation === opt ? 'bg-purple-600 text-white' : 'bg-white text-black border-gray-300'}`}
//                         >
//                             {opt}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//
//             <button
//                 onClick={handleContinue}
//                 className="mt-8 w-full bg-purple-600 text-white font-semibold py-3 rounded-full"
//             >
//                 Continue
//             </button>
//         </div>
//     );
// }
