'use client'

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MAX_PHOTOS = 6;

export default function PhotoUploadPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);

        // Limit total number of photos
        if (photos.length + newFiles.length > MAX_PHOTOS) {
            toast({
                title: "Too many photos",
                description: `You can upload a maximum of ${MAX_PHOTOS} photos.`,
                variant: "destructive"
            });
            return;
        }

        // Create preview URLs for the selected files
        const newPhotos = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPhotos([...photos, ...newPhotos]);
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        // Release the object URL to prevent memory leaks
        URL.revokeObjectURL(newPhotos[index].preview);
        newPhotos.splice(index, 1); // Fixed: This was removing incorrectly before
        setPhotos(newPhotos);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (photos.length === 0) {
            toast({
                title: "No photos selected",
                description: "Please select at least one photo to continue.",
                variant: "destructive"
            });
            return;
        }

        // Check if user is logged in
        if (!session?.user) {
            toast({
                title: "Not authenticated",
                description: "You must be logged in to upload photos.",
                variant: "destructive"
            });
            return;
        }

        // Get the user ID
        const userId = session.user.userId || session.user.id || session.user.email;

        if (!userId) {
            toast({
                title: "User ID not found",
                description: "Unable to identify your account. Please log out and log back in.",
                variant: "destructive"
            });
            return;
        }

        setUploading(true);

        try {
            // Simulate photo upload for now
            // In a real implementation, you would upload the files to your server

            // For demonstration purposes, we'll create dummy URLs
            const mockPhotoUrls = photos.map((photo, index) =>
                `https://example.com/photos/${userId}/${index}-${Date.now()}.jpg`
            );

            // Update the user's profile with the "uploaded" photo URLs
            const response = await fetch(`/api/profile/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photos: mockPhotoUrls
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile with new photos');
            }

            toast({
                title: "Success",
                description: "Your photos have been uploaded successfully!",
            });

            // Navigate back to the profile page
            router.push('/profile');

        } catch (error) {
            console.error('Error uploading photos:', error);
            toast({
                title: "Upload failed",
                description: "There was an error uploading your photos. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="py-4 px-4 text-center border-b bg-white dark:bg-gray-800">
                <h1 className="text-xl font-semibold">Show your best self 📸</h1>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 flex flex-col items-center">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Upload up to six of your best photos to make a fantastic first impression. Let your personality shine.
                        </p>
                    </div>

                    {/* Photo grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={photo.preview}
                                    alt={`Uploaded photo ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}

                        {photos.length < MAX_PHOTOS && (
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="aspect-[3/4] flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                            >
                                <Plus size={24} className="text-gray-400" />
                            </button>
                        )}

                        {/* Add empty divs to maintain grid layout if needed */}
                        {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length - 1) }).map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                        ))}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                        multiple
                    />
                </div>
            </div>

            {/* Footer with buttons */}
            <div className="p-4 border-t bg-white dark:bg-gray-800">
                <div className="max-w-md mx-auto">
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
}