"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface ProfileData {
    preferredName?: string;
    gender?: string;
    yearBorn?: number;
    hobbies: string[];
    description?: string;
    photos: string[];
}

export default function FooterNavigation() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [profileComplete, setProfileComplete] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const pathname = usePathname();

    // Get user identifier
    const getUserId = () => {
        if (!session?.user) return null;
        return session.user.userId || session.user.email;
    };

    // Check if profile is complete
    useEffect(() => {
        const checkProfileStatus = async () => {
            if (status !== "authenticated") {
                setProfileLoading(false);
                return;
            }

            const userId = getUserId();
            if (!userId) {
                setProfileLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/profiles`);

                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);

                    // Check if all required fields are present
                    const requiredFields = ['preferredName', 'gender', 'description', 'yearBorn'];
                    const hasRequiredFields = requiredFields.every(field => !!profileData[field]);
                    const hasHobbies = profileData.hobbies && profileData.hobbies.length > 0;
                    const hasPhotos = profileData.photos && profileData.photos.length > 0;

                    // Profile is complete if all required fields and at least one photo are present
                    setProfileComplete(hasRequiredFields && hasHobbies && hasPhotos);
                } else if (response.status !== 404) {
                    console.error("Failed to fetch profile data:", response.status);
                }
            } catch (error) {
                console.error('Error checking profile status:', error);
            } finally {
                setProfileLoading(false);
            }
        };

        checkProfileStatus();
    }, [status, session]);

    // Determine profile link target based on completion status
    const getProfileLink = () => {
        // If profile is complete, go to main profile
        if (profileComplete) {
            return "/mainprofile";
        }

        // If profile doesn't exist or is incomplete
        if (profile === null) {
            return "/onboarding";
        }

        // Check which step they need to complete
        const hasBasicInfo = profile.preferredName && profile.gender && profile.yearBorn;
        if (!hasBasicInfo) {
            return "/onboarding";
        }

        const hasAboutInfo = profile.description && profile.hobbies && profile.hobbies.length > 0;
        if (!hasAboutInfo) {
            return "/aboutme";
        }

        const hasPhotos = profile.photos && profile.photos.length > 0;
        if (!hasPhotos) {
            return "/images";
        }

        // Default to main profile
        return "/mainprofile";
    };

    // Active link style helper
    const isActive = (path: string): string => {
        const isActivePath = pathname === path ||
            (path === getProfileLink() && pathname === "/profile");
        return isActivePath ? "text-purple-600 font-bold" : "";
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white py-3 flex justify-around items-center text-xs z-50">
            {/* Home */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`${navigationMenuTriggerStyle()} ${isActive('/')}`}
                            >
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Matches */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/matches" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`${navigationMenuTriggerStyle()} ${isActive('/matches')}`}
                            >
                                Matches
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Chats */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/chats" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`${navigationMenuTriggerStyle()} ${isActive('/chats')}`}
                            >
                                Chats
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Profile - dynamically routes based on profile completion */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href={profileLoading ? "#" : getProfileLink()} legacyBehavior passHref>
                            <NavigationMenuLink
                                className={`${navigationMenuTriggerStyle()} ${isActive('/profile')}`}
                            >
                                Profile
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </footer>
    );
}