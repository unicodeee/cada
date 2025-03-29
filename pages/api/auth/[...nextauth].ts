import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {prisma} from "@/prisma/prisma";
import {NextApiRequest, NextApiResponse} from "next";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({user, profile}) {
            // Check if the profile email exists
            console.log("Profile:", profile);
            console.log("User:", user);
            if (!user?.email) {

                throw new Error("User doesn't exist!");
            }
            if (!profile?.email) {
                throw new Error("User doesn't exist!");
            }

            // Use Prisma `upsert` to create or update the user
            await prisma.user.upsert({
                where: {email: profile.email},
                update: {
                    name: profile.name,   // Update user's name if they already exist
                    // image: profile.picture, // Update user's profile picture
                },
                create: {
                    email: profile.email, // Create user if they don't exist
                    name: profile.name!,
                    // image: profile.picture,
                },
            });

            return true; // Allow sign-in
        },
        async jwt({token, account}) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({session}) {
            // if (token) {
            //     session.accessToken = token.accessToken;
            // }
            return session;
        },
    },
};

// Default export as Next.js API route handler

const auth  = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
export default auth;
