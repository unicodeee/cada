// pages/api/profile/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prisma";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { z } from "zod";
import { v4 as uuidv4, validate as isValidUuid } from 'uuid';

// Define schema for profile data validation with our new fields
const profileSchema = z.object({
    preferredName: z.string().optional(),
    gender: z.string().optional(), // Accept any string for gender
    hobbies: z.array(z.string()).default([]),
    description: z.string().optional(),
    yearBorn: z.number().int().min(1900).max(new Date().getFullYear()).optional().nullable(),
    dayBorn: z.number().int().min(1).max(31).optional().nullable(),
    monthBorn: z.number().int().min(1).max(12).optional().nullable(),
    sexualOrientation: z.string().optional(), // Accept any string for orientation
    photos: z.array(z.string()).default([]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Log incoming request for debugging
    console.log(`API Request: ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body type:', typeof req.body);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }

    // Get the token directly, which should have the userId from our NextAuth setup
    const token = await getToken({ req });

    if (!token || !token.userId) {
        console.error("No valid token or userId found in token");
        return res.status(401).json({ message: "Unauthorized - No valid token" });
    }

    // Use the userId from the token - this should be a properly formatted UUID
    const userId = token.userId as string;

    console.log("User ID from token:", userId);

    if (!isValidUuid(userId)) {
        console.error(`User ID ${userId} is not a valid UUID`);
        return res.status(400).json({ message: "Invalid UUID in token" });
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
        console.log(`Looking for profile with userId: ${userId}`);

        // Try to find the profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            // If no profile found, we'll check if the user exists
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                console.error(`User with ID ${userId} not found in User table`);
                return res.status(404).json({ message: "User not found" });
            }

            // User exists but no profile
            return res.status(404).json({ message: "Profile not found" });
        }

        console.log("Retrieved profile data:", profile);
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function createOrUpdateProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ensure hobbies is an array
        if (req.body.hobbies && !Array.isArray(req.body.hobbies)) {
            console.warn("Hobbies is not an array, converting:", req.body.hobbies);
            req.body.hobbies = req.body.hobbies ? [req.body.hobbies] : [];
        }

        // Handle gender and sexualOrientation enum conversion
        // If strings are provided, try to convert them to the correct enum values
        // or use null if they don't match
        let processedBody = {
            ...req.body,
            yearBorn: req.body.yearBorn === null || req.body.yearBorn === undefined ? null : Number(req.body.yearBorn),
            dayBorn: req.body.dayBorn === null || req.body.dayBorn === undefined ? null : Number(req.body.dayBorn),
            monthBorn: req.body.monthBorn === null || req.body.monthBorn === undefined ? null : Number(req.body.monthBorn),
        };

        // Check if gender is a valid enum value
        if (processedBody.gender) {
            if (!['male', 'female', 'gay', 'lesbian', 'transman', 'transwoman'].includes(processedBody.gender)) {
                console.warn(`Invalid gender value: ${processedBody.gender}, using null instead`);
                processedBody.gender = null;
            }
        }

        // Check if sexualOrientation is a valid enum value
        if (processedBody.sexualOrientation) {
            if (!['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual', 'queer'].includes(processedBody.sexualOrientation)) {
                console.warn(`Invalid sexualOrientation value: ${processedBody.sexualOrientation}, using null instead`);
                processedBody.sexualOrientation = null;
            }
        }

        // Validate the request body
        const validationResult = profileSchema.safeParse(processedBody);

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
            userId,
            preferredName,
            gender,
            hobbies: safeHobbies.length,
            description: description ? `${description.substring(0, 20)}...` : null,
            yearBorn,
            dayBorn,
            monthBorn,
            sexualOrientation
        });

        // First check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error(`User with ID ${userId} not found in User table`);
            return res.status(400).json({ message: "User ID does not exist in User table" });
        }

        // Now try to upsert the profile (update if exists, create if not)
        try {
            const profile = await prisma.profile.upsert({
                where: { userId },
                update: {
                    preferredName: preferredName,
                    gender: gender,
                    hobbies: safeHobbies,
                    description: description,
                    yearBorn: yearBorn,
                    dayBorn: dayBorn,
                    monthBorn: monthBorn,
                    sexualOrientation: sexualOrientation,
                    photos: Array.isArray(photos) ? photos : []
                },
                create: {
                    id: uuidv4(), // Generate proper UUID for new profile
                    userId: userId,
                    preferredName: preferredName || null,
                    gender: gender,
                    hobbies: safeHobbies,
                    description: description || null,
                    yearBorn: yearBorn,
                    dayBorn: dayBorn,
                    monthBorn: monthBorn,
                    sexualOrientation: sexualOrientation,
                    photos: Array.isArray(photos) ? photos : []
                },
            });

            console.log("Upserted profile:", profile);
            return res.status(200).json(profile);
        } catch (error) {
            console.error("Error upserting profile:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error in createOrUpdateProfile:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Special handling for common Prisma errors
        if (errorMessage.includes("Foreign key constraint")) {
            return res.status(400).json({
                message: "User ID doesn't exist in the database",
                error: errorMessage
            });
        }

        if (errorMessage.includes("Invalid")) {
            return res.status(400).json({
                message: "Invalid data format",
                error: errorMessage
            });
        }

        return res.status(500).json({
            message: "Server error",
            error: errorMessage
        });
    }
}