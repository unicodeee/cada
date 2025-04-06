"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

// Fallback placeholder images (public images that actually work)
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=2034&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3"
];

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileComplete, setProfileComplete] = useState(false);
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

                    // Replace example.com URLs with actual working image URLs
                    if (profileData.photos && profileData.photos.length > 0) {
                        // Check if the URLs are example.com placeholders and replace them
                        const areUrlsPlaceholders = profileData.photos.some(url => url.includes('example.com'));

                        if (areUrlsPlaceholders) {
                            // Set fallback images
                            profileData.photos = FALLBACK_IMAGES.slice(0, profileData.photos.length);
                        }
                    }

                    setProfile(profileData);

                    // Check if profile is complete
                    const requiredFields = ['preferredName', 'gender', 'description', 'yearBorn'];
                    const hasPhotos = profileData.photos && profileData.photos.length > 0;
                    const hasRequiredFields = requiredFields.every(field => !!profileData[field]);

                    setProfileComplete(hasRequiredFields && hasPhotos);
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
        router.push('/profile/edit');
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Loading profile...</p>
            </div>
        );
    }

    // No session state
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-semibold text-center flex-1">Profile</h1>
                <button className="p-2" onClick={() => router.push('/settings')}>
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

            {/* Profile photo */}
            <div className="relative mx-auto w-full max-w-md my-4">
                <div className="aspect-square rounded-lg overflow-hidden">
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
            <div className="px-4 py-2">
                <h2 className="text-2xl font-bold">
                    {profile.preferredName || session?.user?.name || "User"}
                    {profile.yearBorn && ` (${calculateAge(profile.yearBorn)})`}
                </h2>

                <div className="space-y-4 mt-4">
                    {profile.gender && (
                        <div className="flex items-start gap-2">
                            <span className="mt-1">👤</span>
                            <span>{profile.gender} {profile.sexualOrientation && `• ${profile.sexualOrientation}`}</span>
                        </div>
                    )}

                    {profile.hobbies && profile.hobbies.length > 0 && (
                        <div className="flex items-start gap-2">
                            <span className="mt-1">👾</span>
                            <span>{profile.hobbies.join(', ')}</span>
                        </div>
                    )}

                    {profile.description && (
                        <div className="flex items-start gap-2">
                            <span className="mt-1">✌️</span>
                            <span className="whitespace-pre-line">{profile.description}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit profile button */}
            <div className="fixed bottom-20 right-4">
                <button
                    onClick={handleEditProfile}
                    className="bg-purple-600 text-white p-4 rounded-full shadow-lg"
                >
                    ✏️
                </button>
            </div>
        </div>
    );
}