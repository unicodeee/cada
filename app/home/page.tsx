"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heading, SectionHeading } from "@/components/ui/heading";
// Type definition for profile data
interface ProfileData {
    preferredName?: string;
    gender?: string;
    sexualOrientation?: string;
    yearBorn?: number;
    hobbies: string[];
    description?: string;
    photos: string[];
}


export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileComplete,setProfileComplete] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    // Get user identifier - try email if userId not available
    const getUserId = () => {
        if (!session?.user) return null;
        return session.user.userId || session.user.id || session.user.email;
    };

    // Calculate age from year born
    const calculateAge = (yearBorn?: number) => {
        if (!yearBorn) return null;
        const currentYear = new Date().getFullYear();
        return currentYear - yearBorn;
    };

    // Fetch profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            if (status !== "authenticated") {
                setLoading(false);
                return;
            }

            const userId = getUserId();
            if (!userId) {
                console.error("No user identifier found in session");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/profile/${userId}`);

                if (response.ok) {
                    const profileData = await response.json();

                     setProfile(profileData);

                    // Check if profile is complete
                    const requiredFields = ['preferredName', 'gender', 'description', 'yearBorn'];
                   // const hasPhotos = profileData.photos && profileData.photos.length > 0;
                    const hasRequiredFields = requiredFields.every(field => !!profileData[field]);

                    setProfileComplete(hasRequiredFields);
                } else {
                    console.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [status, session]);

    // Navigate to next photo
    const nextPhoto = () => {
        if (!profile?.photos?.length) return;
        setCurrentPhotoIndex((prev) => (prev === profile.photos.length - 1 ? 0 : prev + 1));
    };

    // Navigate to previous photo
    const prevPhoto = () => {
        if (!profile?.photos?.length) return;
        setCurrentPhotoIndex((prev) => (prev === 0 ? profile.photos.length - 1 : prev - 1));
    };

    // Handle navigation to edit profile
    const handleEditProfile = () => {
        router.push('/onboarding');
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading profile...</p>
            </div>
        );
    }

    // No session state
    if (status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-screen p-4">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
                    <p className="text-gray-500 mt-2">You need to be logged in to see your profile</p>
                </div>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                    onClick={() => router.push('/')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // No profile state
    if (!profile) {
        return (
            <div className="flex items-center justify-center h-screen p-4">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-2">You haven't created a profile yet</p>
                </div>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                    onClick={() => router.push('/profile/edit')}
                >
                    Create Profile
                </button>
            </div>
        );
    }

    return (

        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Header */}
            <header className="mb-4 border-b pb-4">
                <Heading>Profile</Heading>
            </header>
            {/* Edit profile button - bottom right, but not fixed */}
            <div className="sticky bottom-4 flex justify-end">
                <button
                    onClick={handleEditProfile}
                    className="bg-purple-600 text-white p-4 rounded-full shadow-lg"
                >
                    ✏️
                </button>
            </div>
            <div className="flex flex-col">
                {/* Profile photo */}
                <div className="w-full mb-6">
                    <div className="aspect-square rounded-lg overflow-hidden max-w-md mx-auto">
                        {profile.photos && profile.photos.length > 0 ? (
                            <>
                                <div className="relative w-full h-full">
                                    <img
                                        src={profile.photos[currentPhotoIndex]}
                                        alt={`Profile photo ${currentPhotoIndex + 1}`}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = 'https://via.placeholder.com/400x400?text=Image+Error';
                                        }}
                                    />
                                </div>

                                {/* Left/Right navigation for photos */}
                                {profile.photos.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevPhoto}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={nextPhoto}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <p className="text-gray-500">No photos uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Carousel indicators */}
                    {profile.photos && profile.photos.length > 1 && (
                        <div className="flex justify-center mt-2 space-x-1">
                            {profile.photos.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                    className={`h-1 rounded-full cursor-pointer ${
                                        index === currentPhotoIndex ? 'bg-purple-600 w-8' : 'bg-gray-300 w-1'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile info */}
                <div className="pb-16">
                    <h2 className="text-2xl font-bold mb-4">
                        {profile.preferredName || session?.user?.name || "User"}
                        {profile.yearBorn && ` (${calculateAge(profile.yearBorn)})`}
                    </h2>

                    <div className="space-y-4">
                        {profile.gender && (
                            <div className="flex items-center gap-2">
                                <span>👤</span>
                                <span className="capitalize">Gender and Sexual: {profile.gender} {profile.sexualOrientation && `• ${profile.sexualOrientation}`}</span>
                            </div>
                        )}

                        {profile.hobbies && profile.hobbies.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span>👾</span>
                                <span className="capitalize">Hobbies: {profile.hobbies.join(', ')}</span>
                            </div>
                        )}

                        {profile.description && (
                            <div className="flex items-start gap-2 mt-4">
                                <span className="mt-1">✌️</span>
                                <span className="whitespace-pre-line">{profile.description}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}