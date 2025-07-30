
"use client";

import { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { AppContext } from "@/contexts/app-context";
import { Logo } from './icons';
import { useToast } from '@/hooks/use-toast';
import { UserCircle } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.11-3.11C17.45 1.45 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.96l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1H10.3291V10.3291H1V1Z" fill="#F25022"/>
        <path d="M12.6709 1H22V10.3291H12.6709V1Z" fill="#7FBA00"/>
        <path d="M1 12.6709H10.3291V22H1V12.6709Z" fill="#00A4EF"/>
        <path d="M12.6709 12.6709H22V22H12.6709V12.6709Z" fill="#FFB900"/>
    </svg>
);

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { login, loginAsGuest } = useContext(AppContext);
  const { toast } = useToast();

  const handleLogin = (provider: 'google' | 'microsoft') => {
    login(provider);
    onLogin();
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    onLogin();
  };
  
  return (
    <div className="w-full flex flex-col items-center text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Logo className="h-8 w-8 text-primary" />
        </div>

        <DialogHeader className="text-center">
            <DialogTitle className="font-headline text-4xl">
                 <span className="text-center">Dołącz do Praktykanci<span className="text-primary">Hub!</span></span>
            </DialogTitle>
            <DialogDescription className="mt-3 text-lg text-muted-foreground">Zaloguj się, aby zarezerwować miejsce i dołączyć do społeczności.</DialogDescription>
        </DialogHeader>
      
        <div className="flex-grow w-full flex flex-col justify-center py-8 space-y-3 px-12">
            <Button variant="outline" className="w-full justify-center h-12 text-base transition-colors duration-150 border-border/50 hover:border-primary hover:bg-secondary shadow-md" onClick={() => handleLogin('google')}>
                <GoogleIcon /> Zaloguj przez Google
            </Button>
            <Button variant="outline" className="w-full justify-center h-12 text-base transition-colors duration-150 border-border/50 hover:border-primary hover:bg-secondary shadow-md" onClick={handleGuestLogin}>
                <UserCircle /> Kontynuuj jako Gość
            </Button>
            <Button variant="outline" className="w-full justify-center h-12 text-base transition-colors duration-150 border-border/50 hover:border-primary hover:bg-secondary shadow-md" onClick={() => toast({ title: 'Logowanie przez Microsoft wkrótce!', description: 'Na ten moment prosimy o logowanie się za pomocą konta Google.' })}>
                <MicrosoftIcon /> Zaloguj przez Microsoft
            </Button>
        </div>
      
        <DialogFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                Logując się, akceptujesz nasze warunki i politykę prywatności.
            </p>
        </DialogFooter>
    </div>
  );
}
