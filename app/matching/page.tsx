"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";

const users = [
  {
    name: "Charlotte",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c",
    message: "Haha, I'm a perfect match 🫣🫣",
    time: "09:41",
    unread: 1,
  },
  {
    name: "Aurora",
    img: "/avatars/aurora.jpg",
    message: "Wow, this is really epic 👍",
    time: "08:54",
    unread: 3,
  },
  {
    name: "Victoria",
    img: "/avatars/victoria.jpg",
    message: "Thank you so much andrew 🔥",
    time: "01:27",
  },
  {
    name: "Emilia",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c",
    message: "Wow love it! ❤️",
    time: "Yesterday",
    unread: 2,
  },
  {
    name: "Natalie",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c",
    message: "I know... I'm trying to get the ...",
    time: "Yesterday",
  },
  {
    name: "Scarlett",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c",
    message: "It's strong not just fabulous! 😌",
    time: "Dec 20, 2023",
  },
  {
    name: "Caroline",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c",
    message: "Sky blue. Trying it now! 😂",
    time: "Dec 19, 2023",
  },
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const profile = {
    name: "Monica",
    age: 24,
    distance: "5 km away",
    image: "/avatars/monica.jpg", // Replace with your image path
  };

  if (!session) {
    return <div>abc</div>;
  }
  return (
    <div className="flex flex-row justify-center items-start gap-8 px-6 py-8 w-full max-w-6xl mx-auto">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocI3e5J3Hqiq4V0GRCL26yXMle8N0FhJ7MLlaDOumedDJ80LnA=s96-c" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Andrew</h1>
            <p className="text-sm text-gray-500">Now Active</p>
          </div>
        </div>

        {/* Scrollable Avatars */}
        <ScrollArea className="mb-4">
          <div className="flex space-x-4 pb-2">
            {users.map((user, i) => (
              <div key={i} className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.img} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-purple-500 rounded-full border-2 border-white" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Separator />

        {/* Message List */}
        <div className="space-y-4 mt-4">
          {users.map((user, i) => (
            <div key={i} className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <Avatar>
                  <AvatarImage src={user.img} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {user.message}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="text-xs text-gray-400">{user.time}</p>
                {user.unread && (
                  <Badge className="rounded-full bg-purple-600 text-white h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {user.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-md flex justify-center">
        <div className="relative w-[350px] h-[550px] rounded-2xl overflow-hidden shadow-xl bg-black centered">
          {/* Background Image */}
          <img
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=2417&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Bottom Info */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {profile.name} ({profile.age})
            </h2>
            <p className="text-sm">{profile.distance}</p>

            {/* Action Buttons */}
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
    </div>
  );
}
