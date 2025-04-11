"use client"

import { z } from "zod"

const MIN_AGE = 13;
const MAX_AGE = 100;

const CURRENT_YEAR = new Date().getFullYear();

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

export const profileSchemaOnboardingStage = z.object({
    preferedName: z.string(),
    gender: GenderEnum,
    hobbies: z.array(z.string()),
    description: z.string(),
})

export const profileSchemaAboutMe = z.object({
    preferedName: z.string(),
    gender: GenderEnum,
    hobbies: z.array(z.string()),
    description: z.string(),
})


// Profile schema validation
export const profileSchema = z.object({
    gender: GenderEnum.optional(),
    hobbies: z.array(z.string()).optional(),
    description: z.string().optional(),
    sexualOrientation: SexualOrientationEnum.optional(),
    dateOfBirth: z.union([   // auto transform to a Date object from request
        z.string().transform((val) => new Date(val)),
        z.date()
    ]).optional(),
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