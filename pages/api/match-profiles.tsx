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
            return getMatchProfiles(userId, res);
        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}

async function getMatchProfiles(userId: string, res: NextApiResponse) {
    try {
        const myProfile = await prisma.profile.findUnique({
            where: { userId }, // Ensure 'userId' is a unique field in your Prisma schema
        });
        if (!myProfile || !myProfile.genderPreference) {
            return res.status(404).json({ message: "No profile found or gender preference is not set1" });
        }

        // get prfiles that match my gender preference
        const profiles =
            await prisma.profile.findMany({
            where: { gender: myProfile.genderPreference }, // Ensure 'userId' is a unique field in your Prisma schema
        })



        return res.status(200).json(profiles);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

