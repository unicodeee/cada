// pages/api/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import {profileSchema} from "@lib/formdata";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    // Ensure token and user ID exist
    if (!token || !token.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = token.userId; // NextAuth stores user ID in 'sub'

    switch (req.method) {
        case 'GET':
            return getProfile(userId, res);
        case 'POST':
            return setProfile(userId, req, res);

            // return res.status(200).json({ session });
        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}

async function getProfile(userId: string, res: NextApiResponse) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId }, // Ensure 'userId' is a unique field in your Prisma schema
        });

        if (!profile) {
            return res.status(404).json({ message: "No profile found" });
        }
        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}


async function setProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        // Validate request body
        const validationResult = profileSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Invalid profile data",
                errors: JSON.parse(validationResult.error.message),
                body: (req.body) });
        }

        const profileData = validationResult.data;

        // Upsert profile: Update if exists, otherwise create new
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: profileData,
            create: { ...profileData, userId },
        });

        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
