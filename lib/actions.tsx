"use server"

import {Storage} from "@google-cloud/storage";
import process from "node:process";

export const GetSignedUrl1 = async (fileName: string) => {

    const storage = new Storage({
        credentials: {
            project_id: process.env.GC_PROJECT_ID,
            private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newline issue
            client_email: process.env.GC_CLIENT_EMAIL,
        },
    });

    const bucketName = process.env.GC_BUCKET!;
    const bucket = storage.bucket(bucketName);

    const file = bucket.file(fileName as string);  // file name passed via query
    // const file = bucket.file("abc");  // file name passed via query
    // const options = {
    //     expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    //     fields: { "x-goog-meta-source": "nextjs-project" },
    // };

    try {
        const [response] = await file.getSignedUrl(
            {
                action: 'write',
                version: 'v4',
                expires: Date.now() + 15 * 60 * 1000,
                contentType: 'application/octet-stream',
            }
        );
        console.log("response", response);
        return response // Respond with the signed URL and fields
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return null
    }
}




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
        .file(`{}/${fileName}`)
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