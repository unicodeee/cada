"use client";
import Image from 'next/image'


const mockEvents = [
    {
        title: 'Art of the African Diaspora Exhibit',
        date: 'Sun, Mar 2, 2025',
        location: '2nd Floor, DiNapoli Gallery, Dr. Martin Luther King Jr Library',
        category: 'Art Exhibition & Performances',
        image: '/images/african-art.jpg',
        extra: 'Discover SJSU',
    },
    {
        title: 'Transfuturism',
        date: 'Sun, Mar 2, 2025',
        location: 'Dr. Martin Luther King Jr Library, 5th Floor, AACANA Studies Center',
        category: 'Art Exhibition & Performances',
        image: '/images/transfuturism.jpg',
    },
    {
        title: 'Softball - San Jose State at Pacific',
        date: 'Sun, Mar 2, 2025 10 am to 12 pm',
        location: 'Stockton, Calif.',
        category: 'Athletics & Recreation',
        image: '/images/spartan-logo.png',
    },
    {
        title: 'Softball - San Jose State at University of...',
        date: 'Sun, Mar 2, 2025 12:15 pm to 2 pm',
        location: 'Stockton, Calif.',
        category: 'Athletics & Recreation',
        image: '/images/spartan-logo.png',
    },
    {
        title: 'Baseball - San Jose State at San Francisco',
        date: 'Sun, Mar 2, 2025 1:05 pm to 3:05 pm',
        location: 'San Francisco, Calif.',
        category: 'Athletics & Recreation',
        image: '/images/spartan-logo.png',
    },
    {
        title: 'Writing Workshop: Basic APA Style',
        date: 'Mon, Mar 3, 2025 10:30 am to 11:30 am',
        location: 'Virtual Event',
        category: 'Workshop',
        image: '/images/apa-workshop.png',
    },
    {
        title: 'National Student Exchange (NSE) - Info',
        date: 'Mon, Mar 3, 2025 11 am to 12 pm',
        location: 'Virtual Event',
        category: 'Study Abroad',
        image: '/images/sjsu-nse-info.jpg',
    },
    {
        title: 'National Student Exchange (NSE) 101',
        date: 'Mon, Mar 3, 2025 11 am to 12 pm',
        location: 'Virtual Event',
        category: 'Study Abroad',
        image: '/images/sjsu-nse-101.jpg',
    },
]

export default function EventsPage() {
    return (
        <div className="p-4 bg-green-50 min-h-screen">
            <div className="text-center text-2xl font-semibold mb-6">Upcoming SJSU Events</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockEvents.map((event, i) => (
                    <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden border">
                        <div className="relative h-48 w-full">
                            <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                            <p className="text-sm text-gray-500 mb-1">📍 {event.location}</p>
                            <p className="text-sm text-blue-700 font-medium">{event.category}</p>
                            {event.extra && (
                                <p className="text-xs text-green-700 font-semibold mt-1">{event.extra}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
