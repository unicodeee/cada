import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prisma";
import { profileSchema } from "@lib/formdata";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: userId } = req.query; // Extract userId from path parameters

    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Invalid userId" });
    }

    switch (req.method) {
        case "GET":
            return getProfileById(userId, res);
        case "POST":
            return createOrUpdateProfile(userId, req, res);
        case "PUT":
            return createOrUpdateProfile(userId, req, res);
        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}

async function getProfileById(userId: string, res: NextApiResponse) {
    try {
        const profile = await prisma.profile.findUnique({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function createOrUpdateProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const parsedData = profileSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({ message: "Invalid request data", errors: parsedData.error.format()});
        }

        const { gender, hobbies, description, yearBorn, sexualOrientation, photos } = parsedData.data;

        const existingProfile = await prisma.profile.findUnique({ where: { userId } });

        if (existingProfile) {
            const updatedProfile = await prisma.profile.update({
                where: { userId },
                data: { gender, hobbies, description, yearBorn, sexualOrientation, photos },
            });
            return res.status(200).json(updatedProfile);
        } else {
            const newProfile = await prisma.profile.create({
                data: { userId, gender, hobbies, description, yearBorn, sexualOrientation, photos },
            });
            return res.status(201).json(newProfile);
        }
    } catch (error) {
        console.error("Error creating/updating profile:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}
