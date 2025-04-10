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


// Profile schema validation
export const profileSchema = z.object({
    gender: GenderEnum.optional(),
    hobbies: z.array(z.string()).optional(),
    description: z.string().optional(),
    yearBorn: z.number().int().min(CURRENT_YEAR - 100).max(CURRENT_YEAR).optional(),
    sexualOrientation: SexualOrientationEnum.optional(),
    dateOfBirth: z.union([   // auto transform to a Date object from request
        z.string().transform((val) => new Date(val)),
        z.date()
    ]).optional(),
    photos: z.array(z.string()).optional(),
}).transform((data) => {
    let age: number | undefined = undefined;
    if (data.dateOfBirth) {
        const today = new Date();
        const dob = new Date(data.dateOfBirth);
        let calcAge = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            calcAge--;
        }
        age = calcAge;
    }

    return { ...data, age };
})
    .refine((data) => {
        if (data.age === undefined) return true; // allow age to be optional
        return data.age >= MIN_AGE && data.age <= MAX_AGE;
    }, {
        message: `Age must be between ${MIN_AGE} and ${MAX_AGE}, you might be too young or too old to be using this app!`,
        path: ["dateOfBirth"],
    });;

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