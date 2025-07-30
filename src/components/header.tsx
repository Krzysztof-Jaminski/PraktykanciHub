
"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { AppContext } from "@/contexts/app-context";
import UserProfile from "./user-profile";
import { Logo } from "./icons";
import { Button } from "./ui/button";
import { ShoppingCart, Users, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const { user } = useContext(AppContext);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavigationItems = () => (
    <>
      <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground w-full justify-start">
        <Link href="/users" onClick={() => setIsMobileMenuOpen(false)}>
          <Users className="mr-2 text-primary" />
          Użytkownicy
        </Link>
      </Button>
      <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground w-full justify-start">
        <Link href="/food-orders" onClick={() => setIsMobileMenuOpen(false)}>
          <ShoppingCart className="mr-2 text-orange-500" />
          Zamówienia
        </Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href={user ? "/" : "/welcome"} className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline text-lg">Praktykanci<span className="text-primary">Hub</span></span>
          </Link>
          {user && !isMobile && (
            <nav className="hidden items-center gap-1 text-sm md:flex">
              <NavigationItems />
            </nav>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2">
          {user && isMobile && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Otwórz menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu nawigacji</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  <NavigationItems />
                </nav>
              </SheetContent>
            </Sheet>
          )}
          {user && <UserProfile />}
        </div>
      </div>
    </header>
  );
}
