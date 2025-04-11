"use server"

import {Storage} from "@google-cloud/storage";
import process from "node:process";
import {prisma} from "@/prisma/prisma";


export const getSignedUrl = async (fileName: string, fileType: string) => {
    // I am not including the key in the github repo, but this key goes in the root of the project.
    const storage = new Storage({
        credentials: {
            project_id: process.env.GC_PROJECT_ID,
            private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newline issue
            client_email: process.env.GC_CLIENT_EMAIL,
        },
    });


    const bucket = storage.bucket(process.env.GC_BUCKET!);

    const [url] = await bucket // TO DO: fix
        .file(`${fileName}`)
        .getSignedUrl(
            {
                action: 'write',
                version: 'v4',
                expires: Date.now() + 15 * 60 * 1000,
                contentType: fileType,
            }
        );

    return url;
}





export const getImageUrl = async (fileName: string): Promise<string> => {
    const storage = new Storage({
        credentials: {
            project_id: process.env.GC_PROJECT_ID,
            private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.GC_CLIENT_EMAIL,
        },
    });

    const bucket = storage.bucket(process.env.GC_BUCKET!);

    const [url] = await bucket
        .file(fileName)
        .getSignedUrl({
            action: "read", // CHANGE HERE: 'read' instead of 'write'
            version: "v4",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

    return url;
};


export async function getUserIdByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) throw new Error('User not found');
    return user.id;
}


export async function countObjectsInFolder(userId: string) {
    const storage = new Storage({
        credentials: {
            project_id: process.env.GC_PROJECT_ID,
            private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.GC_CLIENT_EMAIL,
        },
    });

    const bucket = storage.bucket(process.env.GC_BUCKET!);

    try {
        // List files in the folder named after userId
        const [files] = await bucket.getFiles({
            prefix: `${userId}/`,
        });
        //
        // // Filter out the folder placeholder and any subfolder placeholders
        // const objects = files.filter(file => {
        //     // Exclude the folder itself and empty "directory markers"
        //     return file.name !== `${userId}/` && !file.name.endsWith('/');
        // });

        return files.length;
    } catch (error) {
        console.error('Error counting objects in GCS folder:', error);
        throw error;
    }
}
