"use client";

import {useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Heart, X} from "lucide-react";
import Image from 'next/image';
import {useEffect, useState} from "react";
import {profileMatchPageDataSchema} from "@lib/formdata";
import z from "zod";
import {getProfilesForMatching} from "@lib/actions";


export default function MessagesPage() {

  const { data: session } = useSession();

  const userId = session?.user.userId as string;



  const [profile, setProfiles] = useState<z.infer<typeof profileMatchPageDataSchema>| null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // const response = await getProfilesForMatching(userId);


        const data = await getProfilesForMatching(userId);
        if (!data) {
          throw new Error('Failed fetching profile');
        }


        console.log("data", data);

        if (data.length > 0) {
          const parsed = profileMatchPageDataSchema.safeParse(data[0]);
          if (parsed.success) {
            setProfiles(parsed.data);
          } else {
            console.error("Profile validation failed:", parsed.error.format());
          }
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-row justify-center items-start gap-20 px-6 py-8 w-full max-w-6xl mx-auto flex-grow">
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

          <div className="flex justify-center items-center mt-10">
            <Image
                src="/cada_heart.png"
                alt="Heart"
                width={250}
                height={250}
                className="object-contain"
            />
          </div>

          {/* Profile Card */}
          <div className="w-full max-w-md flex justify-center items-start mt-14">
            {profile && (
                <div className="relative w-[550px] h-[550px] rounded-2xl overflow-hidden shadow-xl bg-black centered">
                  <Image
                      // src={profile.?.[0] ?? "/fallback.jpg"}
                      src={ profile.avatar ?? "/fallback.jpg"}
                      alt={profile.preferredName ?? "Profile"}
                      fill
                      sizes="350px"
                      className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-1">
                    <h2 className="text-xl font-bold">
                      {profile.preferredName ?? "Anonymous"} ({new Date().getFullYear() - new Date(profile.dateOfBirth!).getFullYear()})
                    </h2>
                    <p className="text-sm">{profile.major}</p>
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
            )}
          </div>
        </main>
      </div>
  );
}