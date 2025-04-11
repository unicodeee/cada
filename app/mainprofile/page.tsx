"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heading, SectionHeading } from "@/components/ui/heading";
import {countObjectsInFolder, getImageUrl, getUserIdByEmail} from "@lib/actions";
import {PROFILE_STEPS} from "@lib/data";


// Type definition for profile data
interface ProfileData {
    preferredName?: string;
    gender?: string;
    sexualOrientation?: string;
    hobbies: string[];
    description?: string;
    photos: string[];
}

// Define steps in the profile creation process


export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileComplete, setProfileComplete] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [redirecting, setRedirecting] = useState(false);

    // Get user identifier - try email if userId not available
    const getUserId = () => {
        if (!session?.user) return null;
        return session.user.userId || session.user.email;
    };

    // Calculate age from year born
    const calculateAge = (yearBorn?: number) => {
        if (!yearBorn) return null;
        const currentYear = new Date().getFullYear();
        return currentYear - yearBorn;
    };

    // Determine which step of the profile creation process the user needs to complete
    const determineProfileStep = (profileData: ProfileData | null, imgCount: number): string => {
        if (!profileData) {
            return PROFILE_STEPS.BASIC_INFO; // Start with basic info if no profile exists
        }

        // Check for basic info (step 1)
        const hasBasicInfo = profileData.preferredName &&
            profileData.gender
        if (!hasBasicInfo) {
            return PROFILE_STEPS.BASIC_INFO;
        }

        // Check for about me info (step 2)
        const hasAboutInfo = profileData.description &&
            profileData.hobbies &&
            profileData.hobbies.length > 0;
        if (!hasAboutInfo) {
            return PROFILE_STEPS.ABOUT_ME;
        }

        // Check for photos (step 3)
        // const hasPhotos = profileData.photos && profileData.photos.length > 0;

        const min_photos = 3;

        const hasPhotos = imgCount > min_photos;
        if (!hasPhotos) {
            return PROFILE_STEPS.PHOTOS;
        }

        // If all steps are completed
        return PROFILE_STEPS.COMPLETE;
    };

    // Fetch profile data and redirect if necessary
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
                const response = await fetch(`/api/profiles/}`);

                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);

                    // Determine which profile step the user should be on

                    const count = await countObjectsInFolder(getUserId()!);

                    const nextStep = determineProfileStep(profileData, count);

                    if (nextStep !== PROFILE_STEPS.COMPLETE && !redirecting) {
                        setRedirecting(true);
                        console.log(`Profile incomplete, redirecting to /${nextStep}`);
                        router.push(`/${nextStep}`);
                        return;
                    }

                    // If we get here, profile is complete
                    setProfileComplete(true);
                } else if (response.status === 404) {
                    // No profile found, redirect to first step
                    console.log("No profile found, redirecting to onboarding");
                    if (!redirecting) {
                        setRedirecting(true);
                        router.push('/onboarding');
                        return;
                    }
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
    }, [status, session, router, redirecting]);

    // Load images from Google Cloud
    useEffect(() => {
        const loadImagesFromCloud = async () => {
            if (!session?.user?.email || !profile) return;

            try {
                const userId = await getUserIdByEmail(session.user.email);

                // Try to load 6 images (indexes 0-5)
                const urls = await Promise.all(
                    Array(6).fill(null).map((_, index) =>
                        getImageUrl(`${userId}/${index}`)
                            .then(url => url)
                            .catch(() => null) // Return null if image doesn't exist
                    )
                );

                // Filter out any null values (images that couldn't be loaded)
                const validUrls = urls.filter(url => url !== null) as string[];

                // Update state with these images
                setImageUrls(validUrls);

                if (profile) {
                    setProfile({
                        ...profile,
                        photos: validUrls
                    });
                }
            } catch (error) {
                console.error("Error loading images from cloud:", error);
            }
        };

        if (session?.user?.email && profile) {
            loadImagesFromCloud();
        }
    }, [session, profile]);

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
                    onClick={() => router.push('/onboarding')}
                >
                    Create Profile
                </button>
            </div>
        );
    }

    // Determine which photos to show - use imageUrls if available, otherwise use profile.photos
    const displayPhotos = imageUrls.length > 0 ? imageUrls : (profile.photos || []);
    const hasPhotos = displayPhotos.length > 0;

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
                        {hasPhotos ? (
                            <>
                                <div className="relative w-full h-full">
                                    <img
                                        src={displayPhotos[currentPhotoIndex]}
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
                                {displayPhotos.length > 1 && (
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
                    {hasPhotos && displayPhotos.length > 1 && (
                        <div className="flex justify-center mt-2 space-x-1">
                            {displayPhotos.map((_, index) => (
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