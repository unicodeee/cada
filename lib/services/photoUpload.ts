// lib/services/photoUpload.ts

/**
 * Uploads a photo to the server
 * @param file The file to upload
 * @param userId The ID of the user
 * @returns Promise with the URL of the uploaded photo
 */
export async function uploadPhoto(file: File, userId: string): Promise<string> {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
        // In a real implementation, you would send this to your API endpoint
        // For example:
        const response = await fetch('/api/upload-photo', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload photo');
        }

        const data = await response.json();
        return data.url;

        // For now, we'll return a placeholder URL
        // return URL.createObjectURL(file);
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

/**
 * Uploads multiple photos and returns array of URLs
 * @param files Array of files to upload
 * @param userId The ID of the user
 * @returns Promise with array of uploaded photo URLs
 */
export async function uploadMultiplePhotos(files: File[], userId: string): Promise<string[]> {
    try {
        // Upload each photo individually
        const uploadPromises = files.map(file => uploadPhoto(file, userId));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading multiple photos:', error);
        throw error;
    }
}

/**
 * Updates the user's profile with the new photo URLs
 * @param userId The ID of the user
 * @param photoUrls Array of photo URLs
 * @returns Promise with the updated profile
 */
export async function updateProfilePhotos(userId: string, photoUrls: string[]): Promise<any> {
    try {
        const response = await fetch(`/api/profile/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                photos: photoUrls,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile photos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating profile photos:', error);
        throw error;
    }
}