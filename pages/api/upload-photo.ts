// pages/api/upload-photo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import formidable from 'formidable';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Set formidable to not save to disk
export const config = {
    api: {
        bodyParser: false,
    },
};

// Initialize Google Cloud Storage (if you're using it)
const storage = new Storage({
    credentials: {
        project_id: process.env.GC_PROJECT_ID,
        private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GC_CLIENT_EMAIL,
    },
});

const bucketName = process.env.GC_BUCKET!;
const bucket = storage.bucket(bucketName);

// Parse the request with formidable
const parseForm = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        if (req.method === 'POST') {
            // Parse the multipart form data
            const { fields, files } = await parseForm(req);

            // Get the file and userId
            const file = files.file as formidable.File;
            const userId = fields.userId as string;

            if (!file || !userId) {
                return res.status(400).json({ message: 'Missing file or userId' });
            }

            // Generate a unique file name
            const fileName = `${userId}/${uuidv4()}-${file.originalFilename}`;

            // Upload the file to Google Cloud Storage
            await bucket.upload(file.filepath, {
                destination: fileName,
                metadata: {
                    contentType: file.mimetype || 'image/jpeg',
                },
            });

            // Make the file publicly accessible and get the URL
            await bucket.file(fileName).makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

            // Remove the temporary file
            fs.unlinkSync(file.filepath);

            // Return the public URL
            return res.status(200).json({ url: publicUrl });
        } else {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Error uploading file', error });
    }
}