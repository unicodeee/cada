"use client"

import React, {useEffect, useRef, useState} from 'react';
import {addDoc, collection, getDocs, limit, orderBy, query, Timestamp, onSnapshot} from "firebase/firestore"

import db from "@lib/firestore"
import z from "zod";
import {TextBubbleRight} from "@components/ui/chatpage-ui/textBubbleRight";
import {TextBubbleLeft} from "@components/ui/chatpage-ui/textBubbleLeft";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@components/ui/dropdown-menu";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {toast} from "sonner";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@components/ui/avatar";
import {ScrollArea, ScrollBar} from "@components/ui/scroll-area";
import {Separator} from "@components/ui/separator";
import {Badge} from "@components/ui/badge";
import {useSession} from "next-auth/react";



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


const messageSchema = z.object({
    userId: z.string().uuid(),
    message: z.string().min(1),
    createdAt: z.preprocess(
        (val) => {
            if (val instanceof Timestamp) {
                return val.toDate(); // convert Firestore Timestamp to JS Date
            }
            return val; // fallback, if it's already a Date or string
        },
        z.date()
    ),
});


export default function ChatPage() {
    // const { data: session } = useSession();
    const { data: session } = useSession();
    const router = useRouter();
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<z.infer<typeof messageSchema>[]>([]);

    const bottomRef = useRef<HTMLDivElement>(null);



    const userId = session?.user.userId as string;

    const match = "matches/chats/3b58f3c7-d89e-4536-97c4-b4a9536ce54e";

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const matchRef = collection(db, match);

                const q = query(matchRef, orderBy("createdAt", "desc"), limit(50));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const messages = snapshot.docs.map(doc => {
                        const result = messageSchema.safeParse(doc.data());
                        return result.success ? result.data : null;
                    }).reverse().filter((msg): msg is z.infer<typeof messageSchema> => msg !== null);

                    setMessages(messages);
                }, (error) => {
                    console.error("Error listening to messages:", error);
                });
                return unsubscribe;

            } catch (e) {
                console.error(e);
            }
        };
        fetchMessages();
    }, []);



    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const messageToSend = messageSchema.safeParse({
            userId,
            message: value,
            createdAt: new Date(),
        });

        if (!messageToSend.success) {
            console.error("Validation failed:", messageToSend.error);
            return;
        }

        try {
            setMessages(prev => [...prev, messageToSend.data]);
            setValue("");
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });

            await addDoc(collection(db, match), messageToSend.data);
            toast.success(`Sent ${messageToSend.data} uploaded!`); // to do

        } catch (e) {
            console.log(e);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
    }


    return <div className="flex h-screen w-full overflow-hidden">

        {/*<form onSubmit={(e) => handleSubmit(e)}>*/}


        {/*    <input*/}
        {/*        type={"text"}*/}
        {/*        value={value}*/}
        {/*        onChange={(e) => {setValue(e.target.value)}}*/}
        {/*        placeholder={"Enter a value"}*/}
        {/*    />*/}

        {/*    <button type="submit">Submit</button>*/}

        {/*</form>*/}



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





        <div className="flex flex-col h-[90vh] w-[850px] mx-auto mt-3 bg-gray-100 border border-gray-300 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-t-2xl">
                <h1 className="text-xl font-bold">Charlotte</h1>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">

                {messages.map(

                    (msg, index) =>
                    msg.userId === userId
                        ? (
                        <TextBubbleRight key={index}>{msg.message}</TextBubbleRight>
                    )
                        : (
                        <TextBubbleLeft key={index}>{msg.message}</TextBubbleLeft>
                    )
                )}

                <div ref={bottomRef}></div>
            </div>

            {/* Input Area */}
            <form onSubmit={(e) => handleSubmit(e)}>
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
                            onChange={(e) => {handleChange(e)}}
                            className="flex-grow mr-2 h-12 text-lg"
                            value={value} />
                        <Button type="submit" className="h-12">Send</Button>
                </div>
            </form>
        </div>
    </div>;
}