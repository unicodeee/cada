// First, let's create a seed script to generate fake data for your database
// Save this as prisma/seed.ts

import { v4 as uuidv4 } from 'uuid';

import { prisma } from './prisma';

async function main() {
    // Clear existing data
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;

    // Create some users
    const users = [
        {
            id: uuidv4(),
            name: 'Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            phone: '555-123-4567',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
        {
            id: uuidv4(),
            name: 'Michael Chen',
            email: 'michael.chen@university.edu',
            phone: '555-234-5678',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
            id: uuidv4(),
            name: 'Jessica Rodriguez',
            email: 'jessica.rodriguez@university.edu',
            phone: '555-345-6789',
            avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
        },
        {
            id: uuidv4(),
            name: 'David Kim',
            email: 'david.kim@university.edu',
            phone: '555-456-7890',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        {
            id: uuidv4(),
            name: 'Emma Wilson',
            email: 'emma.wilson@university.edu',
            phone: '555-567-8901',
            avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        }
    ];

    for (const userData of users) {
        const user = await prisma.user.create({
            data: userData,
        });

        // Create profile for each user
        await prisma.profile.create({
            data: {
                id: uuidv4(),
                userId: user.id,
                gender: Math.random() > 0.5 ? 'Male' : (Math.random() > 0.5 ? 'Female' : 'Other'),
                hobbies: ['Reading', 'Hiking', 'Photography', 'Cooking'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1),
                description: `Hi, I'm ${user.name}! I'm studying at University and looking to connect with other students.`,
                yearBorn: 1995 + Math.floor(Math.random() * 10),
                photos: ["https://picsum.photos/300/400", 'https://picsum.photos/300/400', 'https://picsum.photos/400/300'],
            }
        });

        // Create preferences for each user
        await prisma.preference.create({
            data: {
                id: uuidv4(),
                userId: user.id,
                genderPreference: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'Male' : 'Female') : null,
                minAge: 18 + Math.floor(Math.random() * 5),
                maxAge: 25 + Math.floor(Math.random() * 10),
            }
        });
    }

    console.log('Database has been seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
