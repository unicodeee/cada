"use client";
import * as React from "react";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/ui/theme-provider";
import "@/app/globals.css";
import {SessionProvider, useSession} from "next-auth/react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
                        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white py-3 flex justify-around items-center text-xs z-50">
                            {/* Home */}
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/" legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Home
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Matches */}
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/matches" legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Matches
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Chats */}
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/chats" legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Chats
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Profile */}
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/profile" legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Profile
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </footer>
                        {children}
                    </ApplyLoadingStateForPage>
                </ThemeProvider>
            </SessionProvider>

            </body>
            </html>
        </>
    );
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
