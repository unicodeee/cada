import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { z } from "zod";

// Define schema for profile data validation
const profileSchema = z.object({
    preferredName: z.string().optional(),
    gender: z.enum(["male", "female", "gay", "lesbian", "transman", "transwoman"]).optional(),
    hobbies: z.array(z.string()).optional(),
    description: z.string().optional(),
    yearBorn: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    sexualOrientation: z.enum(["heterosexual", "homosexual", "bisexual", "pansexual", "asexual", "queer"]).optional(),
    photos: z.array(z.string()).optional(),
});

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
        const validationResult = profileSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: validationResult.error.format()
            });
        }

        const {
            preferredName,
            gender,
            hobbies,
            description,
            yearBorn,
            sexualOrientation,
            photos
        } = validationResult.data;

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({ where: { userId } });

        if (existingProfile) {
            // Update existing profile
            const updatedProfile = await prisma.profile.update({
                where: { userId },
                data: {
                    preferredName,
                    gender,
                    hobbies,
                    description,
                    yearBorn,
                    sexualOrientation,
                    photos
                },
            });
            return res.status(200).json(updatedProfile);
        } else {
            // Create new profile
            const newProfile = await prisma.profile.create({
                data: {
                    userId,
                    preferredName,
                    gender,
                    hobbies: hobbies || [],
                    description,
                    yearBorn,
                    sexualOrientation,
                    photos: photos || []
                },
            });
            return res.status(201).json(newProfile);
        }
    } catch (error) {
        console.error("Error creating/updating profile:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}