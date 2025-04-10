"use client"

import { z } from "zod"

// export const profilePostSchema = z.object({
//     gender: z.string().optional(),
//     hobbies: z.string().optional(),
//     description: z.string().optional(),
//     yearBorn: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
//     sexualOrientation: z.string().optional(),
//     photos: z.string().optional(),
// });


const CURRENTYEAR = new Date().getFullYear();

// Enum validation for Gender
const GenderEnum = z.enum([
    "male",
    "female",
    "gay",
    "lesbian",
    "transman",
    "transwoman",
]);

// Enum validation for Sexual Orientation
const SexualOrientationEnum = z.enum([
    "heterosexual",
    "homosexual",
    "bisexual",
    "pansexual",
    "asexual",
    "queer",
]);


// Profile schema validation
export const profileSchema = z.object({
    gender: GenderEnum.optional(),
    hobbies: z.array(z.string()).optional(),
    description: z.string().optional(),
    yearBorn: z.number().int().min(CURRENTYEAR - 100).max(CURRENTYEAR).optional(),
    sexualOrientation: SexualOrientationEnum.optional(),
    photos: z.array(z.string()).optional(),
});

// Define the Zod schema for the file structure
export const formidableFileSchema = z.object({
    originalFilename: z.string(),
    filepath: z.string(),
    mimetype: z.string(),
    size: z.number(),
    // Add any other properties you expect the file to have
});


export const swipeSchema = z.object({
    swiperId: z.string().uuid(),
    swipedId: z.string().uuid(),
    swipeRight: z.boolean(),
})