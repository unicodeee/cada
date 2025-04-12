'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileRouter() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            // Wait for session
            if (status === "loading") return;

            // Redirect to home if not authenticated
            if (status !== "authenticated") {
                router.push('/');
                return;
            }

            try {
                // Check if user has a profile
                const response = await fetch(`/api/profiles/`);

                // User has a profile - redirect to matches page
                if (response.ok) {
                    // Ensure we mark tutorial as seen
                    localStorage.setItem('cada_tutorial_seen', 'true');
                    router.push('/matches');
                    return;
                }

                // User doesn't have a profile (404)
                if (response.status === 404) {
                    // Check if tutorial has been seen
                    const hasSeenTutorial = localStorage.getItem('cada_tutorial_seen') === 'true';

                    if (hasSeenTutorial) {
                        // User has seen tutorial but no profile - go to onboarding
                        router.push('/onboarding');
                    } else {
                        // First-time user - show tutorial
                        router.push('/tutorial');
                    }
                    return;
                }

                // Handle other error cases
                console.error("Error checking profile status:", response.status);
                router.push('/tutorial'); // Default to tutorial as a fallback

            } catch (error) {
                console.error("Error in profile router:", error);
                router.push('/tutorial'); // Default to tutorial on error
            } finally {
                setLoading(false);
            }
        };

        checkUserStatus();
    }, [status, session, router]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600 mr-3"></div>
                <p className="text-xl text-gray-700">Getting things ready...</p>
            </div>
        );
    }

    // This component always redirects
    return null;
}