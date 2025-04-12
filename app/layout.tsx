"use client";
import * as React from "react";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/app/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import FooterNavigation from "@/components/FooterNavigation";
import { usePathname } from "next/navigation";

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
                        <ConditionalFooter />
                        {children}
                    </ApplyLoadingStateForPage>
                </ThemeProvider>
            </SessionProvider>
            </body>
            </html>
        </>
    );
}

function ConditionalFooter() {
    const { status } = useSession();
    const pathname = usePathname();

    // Don't show footer navigation on tutorial page or when user is not authenticated
    if (status !== "authenticated" || pathname === "/tutorial") {
        return null;
    }

    return <FooterNavigation />;
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
