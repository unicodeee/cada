"use client"

import React, {useEffect, useState} from 'react';
import {addDoc, collection, getDocs, limit, orderBy, query, Timestamp} from "firebase/firestore"

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


export default function Page() {
    // const { data: session } = useSession();
    const router = useRouter();
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<z.infer<typeof messageSchema>[]>([]);


    const userId = "3b58f3c7-d89e-4536-97c4-b4a9536ce54d";

    const match = "items";

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const matchRef = collection(db, match);

                const q = query(matchRef, orderBy("createdAt", "desc"), limit(25));


                const snapshot = await getDocs(q);
                // const snapshot = await getDocs(collection(db, match));



                const validMessages = snapshot.docs.map(doc => {
                    const result = messageSchema.safeParse(doc.data());
                    return result.success ? result.data : null;
                }).filter((msg): msg is z.infer<typeof messageSchema> => msg !== null);

                console.log("validMessages", validMessages);

                setMessages(validMessages);
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

            await addDoc(collection(db, match), messageToSend.data);
            toast.success(`Sent ${messageToSend.data} uploaded!`); // to do

            // fake message
            messageToSend.data.message  = "I LOVE YOU BABE!"
            messageToSend.data.userId = "3b58f3c7-d89e-4536-97c4-b4a9536ce54c";
            await addDoc(collection(db, match), messageToSend.data);

        } catch (e) {
            console.log(e);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
    }


    return <div className=" flex ">

        {/*<form onSubmit={(e) => handleSubmit(e)}>*/}


        {/*    <input*/}
        {/*        type={"text"}*/}
        {/*        value={value}*/}
        {/*        onChange={(e) => {setValue(e.target.value)}}*/}
        {/*        placeholder={"Enter a value"}*/}
        {/*    />*/}

        {/*    <button type="submit">Submit</button>*/}

        {/*</form>*/}


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