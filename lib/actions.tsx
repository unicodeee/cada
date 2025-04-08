"use server"

import {Storage} from "@google-cloud/storage";
import process from "node:process";
import {prisma} from "@/prisma/prisma";



export const GetSignedUrl = async (fileName: string, fileType: string) => {
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

export async function getUserIdByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) throw new Error('User not found');
    return user.id;
}