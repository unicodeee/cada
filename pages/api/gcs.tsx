import { Storage } from "@google-cloud/storage";
import {NextApiRequest, NextApiResponse} from "next";
import * as process from "node:process";

const storage = new Storage({
    credentials: {
        project_id: process.env.GC_PROJECT_ID,
        private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newline issue
        client_email: process.env.GC_CLIENT_EMAIL,
    },
});

const bucketName = process.env.GC_BUCKET!;
const bucket = storage.bucket(bucketName);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { fileName, fileData } = req.body;

            if (!fileName || !fileData) {
                return res.status(400).json({ message: "Missing fileName or fileData" });
            }

            const fileBuffer = Buffer.from(fileData, "base64");

            const file = bucket.file(fileName);
            await file.save(fileBuffer, { contentType: "auto" });

            res.status(200).json({ message: "File uploaded successfully", fileName });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error uploading file" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
