
"use client";

import { useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/contexts/app-context";
import UserProfile from "./user-profile";
import { Logo } from "./icons";
import { Button } from "./ui/button";
import { ShoppingCart, Users } from "lucide-react";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href={user ? "/" : "/welcome"} className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline text-lg">Praktykanci<span className="text-primary">Hub</span></span>
          </Link>
          {user && (
            <nav className="hidden items-center gap-1 text-sm md:flex">
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Link href="/users">
                        <Users className="mr-2 text-primary" />
                        Użytkownicy
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Link href="/food-orders">
                        <ShoppingCart className="mr-2 text-orange-500" />
                        Zamówienia
                    </Link>
                </Button>
            </nav>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2">
          {user && <UserProfile />}
        </div>
      </div>
    </header>
  );
}
