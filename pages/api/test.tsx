import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from "next-auth/jwt";
import { countObjectsInFolder } from "@lib/actions"; // Renamed from countImages

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const token = await getToken({ req });

    // Ensure token and user ID exist
    if (!token || !token.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = token.userId;

    try {
        // Await the count operation since it's async
        const count = await countObjectsInFolder(userId);

        return res.status(200).json({
            success: true,
            count: count
        });

    } catch (error) {
        console.error('Error counting objects:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}