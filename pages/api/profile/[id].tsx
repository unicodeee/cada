// pages/api/profile/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { z } from "zod";

// Define schema for profile data validation with our new fields
const profileSchema = z.object({
    preferredName: z.string().optional(),
    gender: z.enum(["male", "female", "gay", "lesbian", "transman", "transwoman"]).optional(),
    hobbies: z.array(z.string()).default([]),
    description: z.string().optional(),
    yearBorn: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    dayBorn: z.number().int().min(1).max(31).optional(),
    monthBorn: z.number().int().min(1).max(12).optional(),
    sexualOrientation: z.enum(["heterosexual", "homosexual", "bisexual", "pansexual", "asexual", "queer"]).optional(),
    photos: z.array(z.string()).default([]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Log incoming request for debugging
    console.log(`API Request: ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', req.body);
    }

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

        console.log("Retrieved profile data:", profile);
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}

async function createOrUpdateProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ensure hobbies is an array
        if (req.body.hobbies && !Array.isArray(req.body.hobbies)) {
            console.warn("Hobbies is not an array, converting:", req.body.hobbies);
            req.body.hobbies = req.body.hobbies ? [req.body.hobbies] : [];
        }

        // Validate the request body
        const validationResult = profileSchema.safeParse(req.body);

        if (!validationResult.success) {
            console.error("Validation errors:", validationResult.error.format());
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
            dayBorn,
            monthBorn,
            sexualOrientation,
            photos
        } = validationResult.data;

        // Ensure hobbies is an array (double-check after validation)
        const safeHobbies = Array.isArray(hobbies) ? hobbies : [];

        console.log("Processing profile update with data:", {
            preferredName,
            gender,
            hobbies: safeHobbies,
            description,
            yearBorn,
            dayBorn,
            monthBorn,
            sexualOrientation
        });

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({ where: { userId } });

        if (existingProfile) {
            // Update existing profile - explicitly include each field
            const updatedProfile = await prisma.profile.update({
                where: { userId },
                data: {
                    preferredName: preferredName !== undefined ? preferredName : existingProfile.preferredName,
                    gender: gender !== undefined ? gender : existingProfile.gender,
                    hobbies: safeHobbies, // Always use the safe version
                    description: description !== undefined ? description : existingProfile.description,
                    yearBorn: yearBorn !== undefined ? yearBorn : existingProfile.yearBorn,
                    dayBorn: dayBorn !== undefined ? dayBorn : existingProfile.dayBorn,
                    monthBorn: monthBorn !== undefined ? monthBorn : existingProfile.monthBorn,
                    sexualOrientation: sexualOrientation !== undefined ? sexualOrientation : existingProfile.sexualOrientation,
                    photos: Array.isArray(photos) ? photos : existingProfile.photos || []
                },
            });

            console.log("Updated profile:", updatedProfile);
            return res.status(200).json(updatedProfile);
        } else {
            // Create new profile
            const newProfile = await prisma.profile.create({
                data: {
                    userId,
                    preferredName,
                    gender,
                    hobbies: safeHobbies,
                    description,
                    yearBorn,
                    dayBorn,
                    monthBorn,
                    sexualOrientation,
                    photos: Array.isArray(photos) ? photos : []
                },
            });

            console.log("Created new profile:", newProfile);
            return res.status(201).json(newProfile);
        }
    } catch (error) {
        console.error("Error creating/updating profile:", error);
        return res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
    }
}