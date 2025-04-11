"use client"
import React, {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {Label} from "@components/ui/label";
import {Input} from "@components/ui/input";
import {Button1} from "@components/ui/button";
import {allGenders, allSexualOrientations} from "@lib/data";
import {useRouter} from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Heading, SectionHeading } from "@/components/ui/heading";

export default function Onboarding(){
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        preferredName: "",
        gender: "",
        dayBorn: "",
        monthBorn: "",
        yearBorn: "",
        sexualOrientation: ""
    });

    // Error states
    const [errors, setErrors] = useState({
        preferredName: false,
        gender: false,
        birthday: false
    });

    // Get user identifier
    const getUserId = () => {
        if (!session?.user) return null;
        return session.user.userId || session.user.id || session.user.email;
    };

    // Fetch existing profile data when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            if (status !== "authenticated") return;

            const userId = getUserId();
            if (!userId) {
                console.error("No user identifier found in session");
                return;
            }

            try {
                const response = await fetch(`/api/profiles/`);

                if (response.ok) {
                    const profileData = await response.json();
                    setFormData({
                        preferredName: profileData.preferredName || "",
                        gender: profileData.gender || "",
                        dayBorn: profileData.dayBorn ? profileData.dayBorn.toString() : "",
                        monthBorn: profileData.monthBorn ? profileData.monthBorn.toString() : "",
                        yearBorn: profileData.yearBorn ? profileData.yearBorn.toString() : "",
                        sexualOrientation: profileData.sexualOrientation || ""
                    });
                } else {
                    // If 404, it's a new user without a profile yet - this is normal
                    if (response.status !== 404) {
                        // Only log as error for non-404 responses
                        console.warn("Profile fetch warning:", response.status);
                        // Don't try to parse JSON for error responses
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [status, session]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Clear errors as user types
        if (id === "preferredName" && value.trim()) {
            setErrors(prev => ({ ...prev, preferredName: false }));
        }

        if (["dayBorn", "monthBorn", "yearBorn"].includes(id)) {
            validateBirthday(id, value);
        }
    };

    // Validate birthday fields
    const validateBirthday = (field: string, value: string) => {
        const day = field === "dayBorn" ? value : formData.dayBorn;
        const month = field === "monthBorn" ? value : formData.monthBorn;
        const year = field === "yearBorn" ? value : formData.yearBorn;

        // Only validate if at least one field has a value
        if (day || month || year) {
            const dayValid = day ? (parseInt(day) >= 1 && parseInt(day) <= 31) : true;
            const monthValid = month ? (parseInt(month) >= 1 && parseInt(month) <= 12) : true;
            const yearValid = year ? (parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear()) : true;

            // Check if all fields are provided when at least one is given
            const allFieldsProvided = day && month && year;
            const fieldsValid = dayValid && monthValid && yearValid;

            // Error if not all fields provided or any field is invalid
            setErrors(prev => ({ ...prev, birthday: !allFieldsProvided || !fieldsValid }));
        } else {
            // All fields empty - no error
            setErrors(prev => ({ ...prev, birthday: false }));
        }
    };

    // Handle button selection (for gender and orientation)
    const handleButtonSelection = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear gender error when selected
        if (field === "gender") {
            setErrors(prev => ({ ...prev, gender: false }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {
            preferredName: !formData.preferredName.trim(),
            gender: !formData.gender,
            birthday: false
        };

        // Validate birthday if any fields are filled
        if (formData.dayBorn || formData.monthBorn || formData.yearBorn) {
            const day = parseInt(formData.dayBorn);
            const month = parseInt(formData.monthBorn);
            const year = parseInt(formData.yearBorn);

            const dayValid = formData.dayBorn ? !isNaN(day) && day >= 1 && day <= 31 : false;
            const monthValid = formData.monthBorn ? !isNaN(month) && month >= 1 && month <= 12 : false;
            const yearValid = formData.yearBorn ? !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() : false;

            // Error if not all fields provided or any field is invalid
            const allFieldsProvided = formData.dayBorn && formData.monthBorn && formData.yearBorn;
            const fieldsValid = dayValid && monthValid && yearValid;

            newErrors.birthday = !allFieldsProvided || !fieldsValid;
        } else {
            // All fields empty - no error (birthday is optional)
            newErrors.birthday = false;
        }

        setErrors(newErrors);

        // Show toasts for each error
        if (newErrors.preferredName) {
            toast({
                title: "Missing Information",
                description: "Please enter your preferred name",
                variant: "destructive"
            });
        }

        if (newErrors.gender) {
            toast({
                title: "Missing Information",
                description: "Please select your gender",
                variant: "destructive"
            });
        }

        if (newErrors.birthday) {
            toast({
                title: "Invalid Date",
                description: "Please enter a complete and valid birthdate or leave all fields empty",
                variant: "destructive"
            });
        }

        return !newErrors.preferredName && !newErrors.gender && !newErrors.birthday;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Focus on the first input with an error
            if (errors.preferredName) {
                document.getElementById('preferredName')?.focus();
            } else if (errors.birthday) {
                document.getElementById('dayBorn')?.focus();
            }
            return;
        }

        if (status !== "authenticated") {
            toast({
                title: "Error",
                description: "You must be logged in to save your profile",
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
                preferredName: formData.preferredName,
                gender: formData.gender,
                sexualOrientation: formData.sexualOrientation || null,
                hobbies: [], // Will be filled on the about page
                photos: []  // Will be handled separately
            };

            console.log("Submitting profile data:", profileData);

            // Send data to API
            const response = await fetch(`/api/profiles/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            // Check response status first
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", response.status, errorText);

                let errorMessage = "Failed to save profile";
                try {
                    // Try to parse error as JSON, but don't rely on it
                    const errorData = JSON.parse(errorText);
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // If parsing fails, use status text
                    errorMessage = `Server error: ${response.statusText || response.status}`;
                }

                throw new Error(errorMessage);
            }

            // If response is OK, then parse JSON
            const responseData = await response.json();
            console.log("Response data:", responseData);

            toast({
                title: "Success",
                description: "Your information has been saved!"
            });

            // Navigate to the next page
            console.log("Navigating to aboutme page...");
            router.push('/aboutme');

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

    // Custom style for button components that mimics the screenshot
    const buttonStyle = (isSelected: boolean) => {
        return `w-full py-3 font-medium rounded-full transition-colors ${
            isSelected
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:border-purple-300"
        }`;
    };

    return (
        <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
            <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8 overflow-y-auto">
                {/* Heart Progress */}
                <div className="mb-12 text-center">
                    <img src="/cada_heart.png" alt="Heart" className="w-20 h-20"/>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24">
                    {/* Left Column */}
                    <div>
                        {/* CADA Identity */}
                        <div className="mb-28">
                            <SectionHeading>
                                Hi {session?.user?.name ? session.user.name : "CADA identity 😎"}
                            </SectionHeading>

                            <p className="text-gray-600 mb-4">
                                Create a unique nickname that represents you. It's how others will know and remember you.
                            </p>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    size="lg"
                                    id="preferredName"
                                    placeholder="Your preferred name"
                                    value={formData.preferredName}
                                    onChange={handleInputChange}
                                    className={errors.preferredName ? "border-red-500 focus:ring-red-500" : ""}
                                />
                                {errors.preferredName && (
                                    <p className="text-sm text-red-500 mt-1">Please enter your preferred name</p>
                                )}
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                            <SectionHeading
                                emoji="✨"
                                error={errors.gender}
                                errorMessage="Required"
                                required={true}
                            >
                                Be true to yourself
                            </SectionHeading>

                            <p className="text-gray-600 mb-4">
                                Choose the gender that best represents you.
                            </p>
                            <div className="flex flex-col gap-4">
                                {Object.entries(allGenders()).map(([key, value]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleButtonSelection("gender", key)}
                                        className={buttonStyle(formData.gender === key)}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                            {errors.gender && (
                                <p className="text-sm text-red-500 mt-2">Please select your gender</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Birthday */}
                        <div className="mb-28">
                            <SectionHeading
                                emoji="🎂"
                                error={errors.birthday}
                                errorMessage="Invalid date"
                            >
                                Let's celebrate you
                            </SectionHeading>

                            <p className="text-gray-600 mb-4">
                                Tell us your birthdate. Your profile doesn't display your birthdate, only your age.
                            </p>
                            <div className="flex gap-4">
                                <Input
                                    size="lg"
                                    id="dayBorn"
                                    placeholder="DD"
                                    value={formData.dayBorn}
                                    onChange={handleInputChange}
                                    maxLength={2}
                                    className={`text-center ${errors.birthday ? "border-red-500 focus:ring-red-500" : ""}`}
                                />
                                <Input
                                    size="lg"
                                    id="monthBorn"
                                    placeholder="MM"
                                    value={formData.monthBorn}
                                    onChange={handleInputChange}
                                    maxLength={2}
                                    className={`text-center ${errors.birthday ? "border-red-500 focus:ring-red-500" : ""}`}
                                />
                                <Input
                                    size="lg"
                                    id="yearBorn"
                                    placeholder="YYYY"
                                    value={formData.yearBorn}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    className={`text-center ${errors.birthday ? "border-red-500 focus:ring-red-500" : ""}`}
                                />
                            </div>
                            {errors.birthday && (
                                <p className="text-sm text-red-500 mt-2">
                                    Please enter all date fields or leave them all empty
                                </p>
                            )}
                        </div>

                        {/* Orientation - ADJUSTED TO MATCH GENDER SECTION */}
                        <div>
                            <SectionHeading>
                                Sexual Orientation
                            </SectionHeading>

                            <p className="text-gray-600 mb-4">
                                Choose the orientation that best describes you.
                            </p>
                            <div className="flex flex-col gap-4">
                                {Object.entries(allSexualOrientations()).map(([key, value]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleButtonSelection("sexualOrientation", key)}
                                        className={buttonStyle(formData.sexualOrientation === key)}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="md:col-span-2 mt-20 w-full flex justify-center">
                        <Button1
                            type="submit"
                            className={`w-full max-w-md text-lg font-semibold py-3 rounded-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Continue (1/3)"}
                        </Button1>
                    </div>
                </form>
            </div>
        </main>
    );
};