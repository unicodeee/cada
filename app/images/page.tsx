"use client";
import * as React from "react";
import { FormEvent, useEffect, useState } from "react";
import { ImageUploader } from "@components/ui/image-uploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSignedUrl, getUserIdByEmail, getImageUrl } from "@lib/actions";
import { useSession } from "next-auth/react";

export default function ImageUploadPage() {
    const [images, setImages] = useState<(File | null)[]>(Array(6).fill(null));
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(Array(6).fill(null));

    const { data: session } = useSession();

    useEffect(() => {
        const loadImages = async () => {
            if (!session?.user?.email) return;
            try {
                const userId = await getUserIdByEmail(session.user.email);
                const urls = await Promise.all(
                    Array(6).fill(null).map((_, index) =>
                        getImageUrl(`${userId}/${index}`).catch(() => null) // catch if file doesn't exist
                    )
                );
                setPreviewUrls(urls);
            } catch (error) {
                console.error("Error loading image URLs", error);
            }
        };

        loadImages();
    }, [session]);

    const handleFileUpload = (file: File, index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });

        // Immediately update preview for UX
        setPreviewUrls(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = URL.createObjectURL(file);
            return newPreviews;
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const filesToUpload = images.map((img, idx) => ({ file: img, index: idx })).filter(({ file }) => file !== null) as { file: File, index: number }[];

        if (filesToUpload.length === 0) {
            toast.error("No images to upload!");
            return;
        }

        for (const { file, index } of filesToUpload) {
            try {
                const userId = await getUserIdByEmail(session!.user.email!);
                const url = await getSignedUrl(`${userId}/${index}`, file.type);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    },
                });

                if (response.ok) {
                    toast.success(`Image ${index} uploaded!`);
                } else {
                    toast.error(`Failed to upload image: ${index}`);
                }
            } catch (error) {
                toast.error(`Upload error: index ${index}`);
                console.error("Upload error", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <main className="flex flex-col gap-6 items-center">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-3xl font-bold">Upload your profile pictures</h1>
                    <div className="grid grid-cols-2 gap-4">
                        {Array(6).fill(null).map((_, index) => (
                            <ImageUploader
                                key={index}
                                onUpload={(file) => handleFileUpload(file, index)}
                                hideLabel={true}
                                hideSubmitButton={true}
                                preloadedImage={previewUrls[index]}
                            />
                        ))}
                    </div>
                    <Button type="submit" className="mt-4">
                        Save All Images
                    </Button>
                </form>
            </main>
        </div>
    );
}
