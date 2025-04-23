"use client"

import React, {useEffect, useRef, useState} from 'react';
import {addDoc, collection, limit, onSnapshot, orderBy, query, Timestamp} from "firebase/firestore"

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
import {useSession} from "next-auth/react";
import {getProfile} from "@lib/actions";
import {Sidebar} from "@components/ui/chatpage-ui/chatSideBar";
import {MatchProfile, MyProfile} from "@/app/types/chats";




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
    
    const [matchProfiles, setMatchProfiles] = useState<MatchProfile[]>([]);
    const [myProfile, setMyProfile] = useState<MyProfile>();

    const bottomRef = useRef<HTMLDivElement>(null);

    const userId = session?.user.userId as string;

    const [selectedMatchPath, setSelectedMatchPath] = useState<string | null>(); // default or null


    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch('/api/matches');
                if (!response.ok) {
                    throw new Error('Failed fetching matches');
                }
                const data = await response.json();
                setMatchProfiles(data);

            } catch (error) {
                throw error;
            }
        }
        fetchMatches();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {

                if (!selectedMatchPath) return;

                const matchRef = collection(db, selectedMatchPath);
                const q = query(matchRef, orderBy("createdAt", "desc"), limit(50));


                const unsubscribe = onSnapshot(q, (snapshot) => {


                    if (snapshot.empty) {
                        setMessages([]); // clear UI or show "Start the conversation!"
                        return;
                    }


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
    }, [selectedMatchPath]);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(userId);
                if (!data) {
                    throw new Error('Failed fetching profile');
                }
                setMyProfile(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error('Something went wrong');
                }
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);



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

            await addDoc(collection(db, selectedMatchPath!), messageToSend.data);
            toast.success(`Sent ${messageToSend.data} uploaded!`); // to do

        } catch (e) {
            console.log(e);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    const handleMatchClick = (user: MatchProfile) => {
        setSelectedMatchPath(`matches/chats/${user.matchId}`);
    };



    return <div className="flex h-screen w-full overflow-hidden">
        {matchProfiles && myProfile ?
            <Sidebar matchProfiles={matchProfiles} myProfile={myProfile}  onClick={handleMatchClick} />
        : myProfile ?
                <Sidebar myProfile={myProfile}  onClick={handleMatchClick}/>
                : <div>No match found</div>}


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