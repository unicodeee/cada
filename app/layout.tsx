"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/app/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import ThemeToggler from "@components/ui/theme-toggler";
import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ListItem from "@components/list-items";
import { Icons } from "@components/ui/icons";

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description: "A popup that displays information related to an element.",
  },
];

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
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
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
                    <NavigationMenuItem >
                      <Link href="/profile" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle() + " bg-primary text-white"}
                        >
                          Profile
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </footer>

              {children}
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </>
  );
}

// Extract navigation logic into a separate component
function AuthNavigation() {
  const { data: session } = useSession(); // Get session data

  return (
    <>
      {session && (
        <NavigationMenu>
          <NavigationMenuList>

            {/* Conditionally show Profile link if user is logged in */}
            <NavigationMenuItem>
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <ThemeToggler />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </>
  );
}
