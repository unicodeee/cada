// pages/api/users/[id].ts
import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });

    // Authentication check
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }



    try {
        return res.status(200).json({
           gender1: "Male",
            // matches: uniqueMatches,
            gender2: "Female",

        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


