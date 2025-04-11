"use client";
import * as React from "react";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/app/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation"; // This will be our new navigation component

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
            <head />
            <body>
            <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <ApplyLoadingStateForPage>
                        <AuthenticatedFooter />
                        {children}
                    </ApplyLoadingStateForPage>
                </ThemeProvider>
            </SessionProvider>
            </body>
            </html>
        </>
    );
}

function AuthenticatedFooter() {
    const { status } = useSession();

    if (status === "authenticated") {
        return <FooterNavigation />;
    }

    return null;
}

function ApplyLoadingStateForPage({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}