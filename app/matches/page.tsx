"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import Image from 'next/image';

export default function MessagesPage() {

  const profile = {
    name: "Monica",
    age: 24,
    distance: "5 km away",
    image: "/avatars/monica.jpg",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN SECTION */}
      <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
        {/* Left Side: Static Image */}
        <div className="w-full max-w-md flex justify-center items-start mt-14">
          <div className="w-[1000px] h-[800px] rounded-2xl overflow-hidden">
            <Image
              src="/bg-top-left.png"
              alt="Left Side Pic"
              width={1000}
              height={800}
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
        {/* 💜 Middle: Heart Image */}
        <div className="flex justify-center items-center mt-10">
          <Image
            src="/cada_heart.png"
            alt="Heart"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        {/* Right Side: Profile Card */}
        <div className="w-full max-w-md flex justify-center items-start mt-14">
          <div className="relative w-[550px] h-[550px] rounded-2xl overflow-hidden shadow-xl bg-black centered">
            <Image
              src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=2417&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={profile.name}
              fill
              sizes = "350px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                {profile.name} ({profile.age})
              </h2>
              <p className="text-sm">{profile.distance}</p>
              <div className="flex justify-between mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 text-red-500 border border-red-500 rounded-full"
                >
                  <X />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-purple-600 text-white rounded-full"
                >
                  <Heart />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
