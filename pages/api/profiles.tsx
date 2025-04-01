// pages/api/profile.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/prisma/prisma';
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions) // to allow only valid session (authenticated users)

    // if (!session || !session.user) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }

    // const userId = req.query.userId as string;
    //
    console.log("userId: ");

    switch (req.method) {
        case 'GET':
            return getAllProfile(res);
            // return getProfile(userId, res);
        case 'POST':
            console.log("asdasdasd: ");

            return res.status(200).json({
                session: session
            });
        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}

async function getAllProfile( res: NextApiResponse) {
    try {
        const profiles = await prisma.profile.findMany({take: 10});

        if (profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" });
        }
        return res.status(200).json(profiles);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

async function createOrUpdateProfile(userId: string, data: any, res: NextApiResponse) {
    const { gender, hobbies, description, yearBorn, sexualOrientation, photos } = data;



    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (existingProfile) {
            const updatedProfile = await prisma.profile.update({
                where: { userId },
                data: {
                    gender,
                    hobbies,
                    description,
                    yearBorn,
                    sexualOrientation,
                    photos,
                },
            });

            return res.status(200).json(updatedProfile);
        } else {
            const newProfile = await prisma.profile.create({
                data: {
                    userId,
                    gender,
                    hobbies,
                    description,
                    yearBorn,
                    sexualOrientation,
                    photos,
                },
            });

            return res.status(201).json(newProfile);
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
