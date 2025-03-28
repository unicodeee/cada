// pages/api/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma'; // Make sure to import the prisma client
import { getSession } from 'next-auth/react'; // If you use NextAuth to authenticate users

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.email!; // Get the logged-in user's ID from session

    if (req.method === 'GET') {
        // Get the profile of the logged-in user
        try {
            const profile = await prisma.profile.findUnique({
                where: { userId },
            });

            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }

            return res.status(200).json(profile);
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    } else if (req.method === 'POST') {
        // Create or update the profile for the logged-in user
        const { gender, hobbies, description, yearBorn, sexualOrientation, photos } = req.body;

        try {
            const existingProfile = await prisma.profile.findUnique({
                where: { userId },
            });

            if (existingProfile) {
                // Update existing profile
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
                // Create new profile
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
    } else {
        // Method not allowed
        return res.status(405).json({ message: "Method not allowed" });
    }
}
