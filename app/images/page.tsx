"use client";
import * as React from "react";
import {FormEvent} from "react";
import {ImageUploader} from "@components/ui/image-uploader";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {GetSignedUrl, getUserIdByEmail} from "@lib/actions";
import {useSession} from "next-auth/react";

export default function ImageUploadPage() {
    const [images, setImages] = React.useState<(File | null)[]>(Array(6).fill(null));

    const {data: session} = useSession();

    const handleFileUpload = (file: File, index: number) => {

        // Update our images array with the new file
        setImages(prev => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });
    };


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // Filter out null entries before submitting
        event.preventDefault()

        const filesToSubmit = images.filter(img => img !== null);

        if (filesToSubmit.length === 0) {
            toast.error("Please upload at least one image before submitting");
            return;
        }
        const filesToUpload = images.filter((img): img is File => img !== null);

        if (filesToUpload.length === 0) {
            toast.error("No images to upload!");
            return;
        }


        for (const image of filesToUpload) {
            const index = filesToUpload.indexOf(image);
            try {
                const userId = await getUserIdByEmail(session!.user.email!);
                // upload to gcs
                const url = await GetSignedUrl(`${userId}/${index}`, image.type);

                const response = await fetch(url, {
                    method: 'PUT',
                    body: image,
                    headers: {
                        'Content-Type': image.type
                    },

                })
                toast.info(response.toString());

            } catch (error) {
                toast.error(`Failed to upload image: index${index}`);
                console.error("Error uploading file:", error);
            }

        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
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



