'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card";
import {Label} from "@components/ui/label";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {useSession} from "next-auth/react";

import {allGenders, allSexualOrientations, allYearsBorn} from "@lib/data";

export default function ProfilePage() {
    const { data: session } = useSession();
    

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
            <main className="flex flex-col gap-6 items-center ">
                <h1 className="text-5xl font-bold">♥ Dating Profile ♥</h1>
                <div>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Hi {session?.user?.name ? session.user.name : "User"}</CardTitle>
                            <CardDescription>Let us know more about you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="preferredName">Preferred Name</Label>
                                        <Input id="preferredName" placeholder="Your preferred name"/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select>
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select your gender"/>
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {Object.entries(allGenders()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="sexualOrientation">Sexual Orientation</Label>
                                        <Select>
                                            <SelectTrigger id="sexualOrientation">
                                                <SelectValue placeholder="Select your sexual orientation"/>
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {Object.entries(allSexualOrientations()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="yearBorn">Year Born</Label>
                                        <Select>
                                            <SelectTrigger id="yearBorn">
                                                <SelectValue placeholder="Select your year born"/>
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {Object.entries(allYearsBorn()).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="hobbies">Hobbies</Label>
                                        <Input id="hobbies" placeholder="Your hobbies"/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="description">Bio</Label>
                                        <Input id="description" placeholder="Your bio"/>
                                    </div>
                                    
                                </div>
                            </form>
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