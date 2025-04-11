"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const ChatPage = () => {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    function handleSendMessage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Message cannot be empty!");
            return;
        }
        console.log("Message sent:", message);
        setMessage(""); // Clear the input field after sending the message
    }
    return (
        <div className="flex h-screen">
            {/* Left Side Screenshot Content */}
            <div className="w-1/3 p-50 flex-left items-center justify-center">
                <Image
                    src="/bg-top-left.png"
                    alt="Screenshot Content"
                    width={800}
                    height={800}
                    className="rounded-lg object-cover"
                />
            </div>

            {/* Chat Interface */}
            <div className="flex flex-col h-[90vh] w-[850px] mx-auto mt-3 bg-gray-100 border border-gray-300 rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-t-2xl">
                    <h1 className="text-xl font-bold">Charlotte</h1>
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
                            <CardContent>Haha, yes I have seen your profile and I am a perfect match 🙋‍♀️😊</CardContent>
                        </Card>
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex items-center p-4 bg-white border-t rounded-b-2xl">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Plus className="w-9 h-9 text-gray-500 mr-2 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top">
                            <DropdownMenuItem className="text-lg py-2" onClick={() => handleNavigation('/calendar')}>📚 Study Buddy Mode</DropdownMenuItem>
                            <DropdownMenuItem className="text-lg py-2" onClick={() => handleNavigation('/eventpage')}>🏫 Campus Social Events</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                        className="flex-grow mr-2 h-12 text-lg"
                        value={message} />
                    <Button className="h-12" onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
