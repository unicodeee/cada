// app/page.tsx

'use client'

import HomePage from "@/app/HomePage"; // Adjust path as necessary
import {getUserSession} from "@lib/session";
import {SessionProvider} from "next-auth/react";

export default function Home() {

  const user =  getUserSession();
  console.log("user: ", user);
  return (
      <div>
          <SessionProvider>
              <HomePage/>
          </SessionProvider>
      </div>
  );
}
