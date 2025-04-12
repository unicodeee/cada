"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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

const ChatPage = () => {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    function handleSendMessage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Message cannot be empty!");
            return;
        }
        console.log("Message sent:", message);
        setMessage("");
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* LEFT: Matches Sidebar */}
            <div className="w-[400px] border-r p-4 overflow-y-auto">
                {/* Header */}
                <div className="items-center gap-2 mb-2">
                    <Image src="/cada_heart.png" alt="Heart" width={48} height={48} className="w-12 h-12" />
                </div>
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

                <Separator className="mb-4" />

                {/* Message List */}
                <div className="space-y-4">
                    {users.map((user, i) => (
                        <div key={i} className="flex justify-between items-start">
                            <div className="flex gap-3 items-start">
                                <Avatar>
                                    <AvatarImage src={user.img} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-semibold">{user.name}</h2>
                                    <p className="text-sm text-gray-600 truncate max-w-[160px]">
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

            {/* RIGHT: Chat UI */}
            <div className="flex flex-col bg-white border border-gray-300 rounded-2xl mx-auto my-9 w-[850px] h-[85vh] overflow-hidden">


                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white shadow-sm">
                    <h1 className="text-xl font-bold">Charlotte</h1>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
                    <div className="flex flex-col items-end">
                        <Card className="bg-purple-500 text-white rounded-2xl p-3 max-w-xs">
                            <CardContent>Hi, good morning Charlotte... 😁😅</CardContent>
                        </Card>
                        <Card className="bg-purple-500 text-white rounded-2xl p-3 max-w-xs mt-2">
                            <CardContent>It seems we have a lot in common & have a lot of interest in each other 😂</CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-col items-start">
                        <Card className="bg-gray-200 text-black rounded-2xl p-3 max-w-xs">
                            <CardContent>Hello, good morning too Andrew 🌞</CardContent>
                        </Card>
                        <Card className="bg-gray-200 text-black rounded-2xl p-3 max-w-xs mt-2">
                            <CardContent>Haha, yes I have seen your profile and I am a perfect match 👋😊</CardContent>
                        </Card>
                    </div>
                </div>

                {/* Input Section */}
                <div className="flex items-center p-4 bg-white border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Plus className="w-9 h-9 text-gray-500 mr-2 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top">
                            <DropdownMenuItem className="text-lg py-2" onClick={() => handleNavigation('/calendar')}>
                                📚 Study Buddy Mode
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-lg py-2" onClick={() => handleNavigation('/eventpage')}>
                                🏫 Campus Social Events
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow mr-2 h-12 text-lg"
                        value={message}
                    />
                    <Button className="h-12" onClick={handleSendMessage}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
