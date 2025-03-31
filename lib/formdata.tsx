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


// Enum validation for Gender
const GenderEnum = z.enum([
    "Male",
    "Female",
    "Gay",
    "Lesbian",
    "TransMan",
    "TransWoman",
]);

// Enum validation for Sexual Orientation
const SexualOrientationEnum = z.enum([
    "Heterosexual",
    "Homosexual",
    "Bisexual",
    "Pansexual",
    "Asexual",
    "Queer",
]);


// Profile schema validation
export const profileSchema = z.object({
    // userId: z.string().uuid(),
    gender: GenderEnum.optional(),
    hobbies: z.array(z.string()).optional(),
    description: z.string().optional(),
    yearBorn: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    sexualOrientation: SexualOrientationEnum.optional(),
    photos: z.array(z.string()).optional(),
});