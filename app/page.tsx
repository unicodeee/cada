// app/page.tsx

'use client'

import HomePage from "@/app/HomePage"; // Adjust path as necessary
import {SessionProvider} from "next-auth/react";

export default function Home() {
  return (
      <div>
          <SessionProvider>
              <HomePage/>
          </SessionProvider>
      </div>
  );
}
