"use client"
import {Card, CardContent, CardFooter} from "@components/ui/card";
import {Button} from "@components/ui/button";
import UserCard from "@components/usercard";
import * as React from "react";
import {useSession} from "next-auth/react";


export default function TableDemo() {

    const { data: session, status } = useSession();



    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (



        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <main className="flex flex-col gap-6 items-center ">
                <h1 className="text-5xl font-bold">♥ Dating Profile ♥</h1>
                <div className="flex flex-row gap-10 items-center ">

                    <Card className="w-[350px]">

                        <CardContent>
                            <UserCard
                                image={session.user?.image || undefined}
                            />
                        </CardContent>


                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save</Button>
                        </CardFooter>
                    </Card>

                    <Card className="w-[350px]">

                        <CardContent>
                            <UserCard
                                image={session.user?.image || undefined}
                            />
                        </CardContent>


                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>




    )
}

