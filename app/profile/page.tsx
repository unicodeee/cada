'use client'

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { allGenders, allSexualOrientations } from "@lib/data";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [newHobby, setNewHobby] = useState("");

    // Generate year options (from 1940 to current year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1939 }, (_, i) => (currentYear - i).toString());

    // Form state
    const [formData, setFormData] = useState({
        preferredName: "",
        gender: "",
        sexualOrientation: "",
        description: "",
        yearBorn: "",
        hobbies: [] as string[]
    });

    // Get user identifier - try email if userId not available
    const getUserId = () => {
        if (!session?.user) return null;
        return session.user.userId || session.user.id || session.user.email;
    };

    // Fetch existing profile data when the component mounts
    React.useEffect(() => {
        const fetchProfileData = async () => {
            if (status !== "authenticated") return;

            const userId = getUserId();
            if (!userId) {
                console.error("No user identifier found in session");
                return;
            }

            try {
                const response = await fetch(`/api/profile/${userId}`);

                if (response.ok) {
                    const profileData = await response.json();
                    console.log("Fetched profile data:", profileData);
                    setFormData({
                        preferredName: profileData.preferredName || "",
                        gender: profileData.gender || "",
                        sexualOrientation: profileData.sexualOrientation || "",
                        description: profileData.description || "",
                        yearBorn: profileData.yearBorn ? profileData.yearBorn.toString() : "",
                        hobbies: profileData.hobbies || []
                    });
                } else {
                    // If it's a 404, it's probably a new user without a profile yet
                    if (response.status !== 404) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error("Profile fetch error:", errorData);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [status, session]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle select change
    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Add a new hobby
    const addHobby = () => {
        if (newHobby.trim() === "") return;

        // Don't add duplicates
        if (formData.hobbies.includes(newHobby.trim())) {
            toast({
                title: "Duplicate Hobby",
                description: "This hobby is already in your list",
                variant: "destructive"
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            hobbies: [...prev.hobbies, newHobby.trim()]
        }));
        setNewHobby("");
    };

    // Handle Enter key press to add hobby
    const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHobby();
        }
    };

    // Remove a hobby
    const removeHobby = (hobby: string) => {
        setFormData(prev => ({
            ...prev,
            hobbies: prev.hobbies.filter(h => h !== hobby)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status !== "authenticated") {
            toast({
                title: "Error",
                description: "You must be logged in to update your profile",
                variant: "destructive"
            });
            return;
        }

        const userId = getUserId();
        if (!userId) {
            toast({
                title: "Error",
                description: "Unable to identify user. Please log out and log back in.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            // Prepare data for submission
            const profileData = {
                preferredName: formData.preferredName || undefined,
                gender: formData.gender || undefined,
                description: formData.description || undefined,
                sexualOrientation: formData.sexualOrientation || undefined,
                yearBorn: formData.yearBorn ? parseInt(formData.yearBorn) : undefined,
                hobbies: formData.hobbies,
                photos: [] // Add functionality for photos later
            };

            // Send data to API
            const response = await fetch(`/api/profile/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (error) {
                console.error("Error parsing response:", error);
            }

            if (!response.ok) {
                throw new Error(responseData?.message || "Failed to save profile");
            }

            toast({
                title: "Success",
                description: "Your profile has been updated successfully!"
            });

            // Refresh the page to show updated data
            router.refresh();

        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Loading profile...</p>
            </div>
        );
    }

    // Show login message if not authenticated
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>You need to be logged in to view and edit your profile.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/')}>Go to Login</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <main className="flex flex-col gap-6 items-center">
                <h1 className="text-5xl font-bold">♥ Dating Profile ♥</h1>
                <div>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Hi {session?.user?.name ? session.user.name : "User"}</CardTitle>
                            <CardDescription>Let us know more about you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="preferredName">Preferred Name</Label>
                                        <Input
                                            id="preferredName"
                                            placeholder="Your preferred name"
                                            value={formData.preferredName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(value) => handleSelectChange("gender", value)}
                                        >
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select Your Gender" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {Object.entries(allGenders()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="sexualOrientation">Sexual Orientation</Label>
                                        <Select
                                            value={formData.sexualOrientation}
                                            onValueChange={(value) => handleSelectChange("sexualOrientation", value)}
                                        >
                                            <SelectTrigger id="sexualOrientation">
                                                <SelectValue placeholder="Select Your Sexual Orientation" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {Object.entries(allSexualOrientations()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="yearBorn">Year Born</Label>
                                        <Select
                                            value={formData.yearBorn}
                                            onValueChange={(value) => handleSelectChange("yearBorn", value)}
                                        >
                                            <SelectTrigger id="yearBorn">
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="max-h-60 overflow-auto">
                                                {yearOptions.map((year) => (
                                                    <SelectItem key={year} value={year}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Hobbies & Interests</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newHobby}
                                                onChange={(e) => setNewHobby(e.target.value)}
                                                onKeyDown={handleHobbyKeyDown}
                                                placeholder="Add a hobby..."
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={addHobby}
                                                variant="outline"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        {formData.hobbies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.hobbies.map((hobby) => (
                                                    <div
                                                        key={hobby}
                                                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                                                    >
                                                        {hobby}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeHobby(hobby)}
                                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="description">About Me</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Tell us about yourself..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="photo">Profile Photos</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-20 flex flex-col items-center justify-center gap-2"
                                            onClick={() => router.push('/photo')}
                                        >
                                            <div className="text-lg">📸</div>
                                            <span>Upload Photos</span>
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            Upload up to 6 photos to showcase your best self.
                                        </p>
                                    </div>
                                </div>

                                <CardFooter className="flex justify-between mt-6 p-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}