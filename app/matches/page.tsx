"use client";

import {useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Heart, X} from "lucide-react";
import Image from 'next/image';
import {useCallback, useEffect, useState} from "react";
import {profileMatchPageDataSchema} from "@lib/formdata";
import z from "zod";
import {getProfilesForMatching} from "@lib/actions";


export default function MessagesPage() {

  const { data: session } = useSession();

  const userId = session?.user.userId as string;


  const [mainProfile, setMainProfile] = useState<z.infer<typeof profileMatchPageDataSchema>>();
  const [profiles, setProfiles] = useState<z.infer<typeof profileMatchPageDataSchema>[]>([]);
  const [needReloadProfiles, setNeedReloadProfiles] = useState(true);


  const fetchProfiles = useCallback(async () => {
    try {
      const data = await getProfilesForMatching(userId);

      if (!data) throw new Error('Failed fetching profiles');

      const validProfiles = data
          .map((p) => profileMatchPageDataSchema.safeParse(p))
          .filter((parsed): parsed is { success: true; data: z.infer<typeof profileMatchPageDataSchema> } => parsed.success)
          .map((parsed) => parsed.data);

      setProfiles(validProfiles);
      setMainProfile(validProfiles[0] || null);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }, [userId]);


  const handleSwipe = async (swipeRight: boolean) => {
    const response = await fetch(`/api/swipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        swiperId : userId,
        swipedId : mainProfile?.userId,
        swipeRight : swipeRight
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setProfiles(prev => {
      const newProfiles = prev.slice(1);
      // If we now have no profiles, schedule a reload
      if (newProfiles.length <= 1) {
        setNeedReloadProfiles(true);
      }

      // Set the main profile to the next one
      setMainProfile(newProfiles[0] || null);

      return newProfiles;
    });


    response.json().then((data) => {
      if (data.isMatch) {
        // toast
      }
    })
  }


  useEffect(() => {
    if (needReloadProfiles) {
      fetchProfiles();
    }
    setNeedReloadProfiles(false);
  }, [fetchProfiles, needReloadProfiles]);

  return (
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
          {/* Left side image with stacked bio and hobbies */}
          {mainProfile && (
          <div className="w-full max-w-md flex justify-center items-start mt-14">
            <div className="w-[500px] h-[550px] rounded-2xl overflow-hidden relative">
              <Image
                  src="/bg-top-left.png"
                  alt="Left Side Pic"
                  width={1000}
                  height={500}
                  className="object-cover rounded-2xl"
              />

              {/* Bio and hobbies overlay on the background image */}
              {mainProfile && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-6 px-6">
                    {/* Bio section */}
                    {mainProfile.description && (
                        <div className="mb-5">
                          <h3 className="text-white font-bold text-2xl mb-2">About</h3>
                          <p className="text-white text-base">{mainProfile.description}</p>
                        </div>
                    )}

                    {/* Hobbies */}
                    {mainProfile.hobbies && mainProfile.hobbies.length > 0 && (
                        <div>
                          <h3 className="text-white font-bold text-2xl mb-2">Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {mainProfile.hobbies.map((hobby, index) => (
                                <span key={index} className="text-sm bg-purple-600 px-4 py-1.5 rounded-full text-white">
                            {hobby}
                          </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
              )}

          <div className="flex justify-center items-center mt-10">
            <Image
                src="/cada_heart.png"
                alt="Heart"
                width={250}
                height={250}
                className="object-contain"
            />
          </div>

          {/* mainProfile Card */}
          <div className="w-full max-w-md flex justify-center items-start mt-14">
            {mainProfile ? (
                <div className="relative w-[550px] h-[550px] rounded-2xl overflow-hidden shadow-xl bg-black centered">
                  <Image
                      // src={mainProfile.?.[0] ?? "/fallback.jpg"}
                      src={ mainProfile.avatar ?? "/fallback.jpg"}
                      alt={mainProfile.preferredName ?? "mainProfile"}
                      fill
                      sizes="350px"
                      className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-1">
                    <h2 className="text-xl font-bold">
                      {mainProfile.preferredName ?? "Anonymous"} ({new Date().getFullYear() - new Date(mainProfile.dateOfBirth!).getFullYear()})
                    </h2>
                    <p className="text-sm">{mainProfile.major}</p>
                    <div className="flex justify-between mt-4">
                      <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/30 text-red-500 border border-red-500 rounded-full"
                          onClick={() => handleSwipe(false)}
                      >
                        <X />
                      </Button>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="bg-purple-600 text-white rounded-full"
                          onClick={() => handleSwipe(true)}
                      >
                        <Heart />
                      </Button>
                    </div>
                  </div>
                </div>
            ) : <h1>No one matches your preference!</h1>}
          </div>
        </main>
      </div>
  );
}