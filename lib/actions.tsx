"use server"

import {Storage} from "@google-cloud/storage";
import process from "node:process";
import {prisma} from "@/prisma/prisma";


const storage = new Storage({
    credentials: {
        project_id: process.env.GC_PROJECT_ID,
        private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GC_CLIENT_EMAIL,
    },
});

const bucket = storage.bucket(process.env.GC_BUCKET!);



export const getProfile = async (userId: string) => {
    const profile = await prisma.profile.findUnique({
        where: { userId }
    });

    if (!profile) {
        throw new Error("profile bad")
    }
    const result = await loadFirstImageFromStorage(userId);
    if (!result) {
        throw new Error("Avatar not found for user: ")
    }
   return {
        ...profile,
       avatar: result || null
   };
}


export const getProfilesForMatching = async (userId: string) => {
    const myProfile = await prisma.profile.findUnique({
        where: { userId },
    });

    if (!myProfile || !myProfile.genderPreference) {
        throw new Error("No profile found or gender preference is not set");
    }

// Get the list of user IDs the current user has swiped
    const swipedUsers = await prisma.swipe.findMany({
        where: { swiperId: userId },
        select: { swipedId: true },
    });
    const swipedIds = swipedUsers.map((s) => s.swipedId);

// Get the list of user IDs the current user has matched with
    const matchedUsers = await prisma.match.findMany({
        where: {
            OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
        select: {
            firstUserId: true,
            secondUserId: true,
        },
    });
    const matchedIds = matchedUsers.flatMap((m) =>
        m.firstUserId === userId ? [m.secondUserId] : [m.firstUserId]
    );

    const excludeIds = [...new Set([...swipedIds, ...matchedIds, userId])];

// Get profiles based on gender preference
    const profiles = await prisma.profile.findMany({
        where: {
            gender: myProfile.genderPreference,
            userId: {
                notIn: excludeIds,
            },
        },
        include: {
            user: true,
        },
    });

// Load avatars for each profile
    const profilesWithAvatar = await Promise.all(
        profiles.map(async (profile) => {

            let avatar: string | null;
            if (process.env.NODE_ENV == "development" ) {
                avatar = await loadFirstImageFromStorage(userId);
            }
            else {
                avatar = await loadFirstImageFromStorage(profile.userId);
            }

            return {
                ...profile,
                avatar: avatar || null,
            };
        })
    );

    return profilesWithAvatar;
}


const loadFirstImageFromStorage = async (userId: string): Promise<string | null> => {
    try {
        const images = await loadImagesFromStorage(userId);
        return images ? images[0] : null;
    } catch (error) {
        console.error("Error loading images:", error);
        throw error;
    }
};

const loadImagesFromStorage = async (userId: string) => {
    try {
        // Try to load 6 images (indexes 0-5)
        const urls = await Promise.all(
            Array(6).fill(null).map((_, index) =>
                getImageUrl(`${userId}/${index}`)
                    .then(url => url)
                    .catch(() => null) // Return null if image doesn't exist
            )
        );
        // Filter out any null values (images that couldn't be loaded)
        const validUrls = urls.filter(url => url !== null) as string[];
        if (validUrls.length > 0) {
            return validUrls; // first url only for avatar
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error loading images:", error);
        throw error;
    }
};



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
    const [url] = await bucket
        .file(fileName)
        .getSignedUrl({
            action: "read", // CHANGE HERE: 'read' instead of 'write'
            version: "v4",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

    return url;
};


export const get6ImageUrls = async (userId: string) => {
    const urls = [];
    for (let i = 0; i < 6; i++) {
        const [url] = await bucket
            .file(`${userId}/${i}`)
            .getSignedUrl({
                action: "read", // CHANGE HERE: 'read' instead of 'write'
                version: "v4",
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            });
        urls.push(url);
    }
    return urls;
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
