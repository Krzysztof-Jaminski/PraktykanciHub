
'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, FileText, ShoppingCart, Users } from "lucide-react";
import { Logo } from "@/components/icons";
import React, { useContext, useEffect, useState } from "react";
import Login from "@/components/login";
import { AppContext } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div 
        className="p-8 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 flex flex-col items-center text-center shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, delay, ease: "easeOut" }}
        whileHover={{ 
            translateY: -5,
            transition: { duration: 0.2 }
        }}
    >
        <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-headline mb-2 text-white">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

export default function WelcomePage() {
    const { user } = useContext(AppContext);
    const router = useRouter();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    if (user) {
        return null;
    }

    return (
        <motion.div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent text-foreground p-4 overflow-hidden"
            initial="initial"
            animate="animate"
        >
            <div className="container mx-auto px-4 py-12 z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-center mb-12"
                >
                    <Logo className="h-20 w-20 mx-auto mb-4 text-primary drop-shadow-lg" />
                    <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2 drop-shadow-md">Witaj w Praktykanci<span className="text-primary">Hub!</span></h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Twoje centrum do zarządzania praktykami</p>
                </motion.div>

                <div className="space-y-12">
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Briefcase className="h-8 w-8" />}
                            title="Rezerwacje Obecności"
                            description="Zaplanuj swoje dni w biurze lub online. Zobacz, kto jeszcze będzie i zarezerwuj miejsce."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<FileText className="h-8 w-8" />}
                            title="Statusy i Portfolio"
                            description="Dziel się tygodniowymi postępami i buduj swoje portfolio projektów, aby pokazać swoje osiągnięcia."
                            delay={0.15}
                        />
                        <FeatureCard
                            icon={<ShoppingCart className="h-8 w-8" />}
                            title="Zamówienia Jedzenia"
                            description="Organizuj grupowe zamówienia na lunch. Dołącz do istniejących lub twórz własne wydarzenia."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8" />}
                            title="Społeczność"
                            description="Przeglądaj profile innych praktykantów i bądź na bieżąco z życiem firmy."
                            delay={0.25}
                        />
                    </div>
                    
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.3, ease: "easeOut" }}
                    >
                        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                            <DialogTrigger asChild>
                                 <Button size="lg" variant="glass" className="shadow-md transform hover:scale-105 transition-transform duration-150">
                                    Rozpocznij
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl px-8 pb-12 pt-16">
                                <Login onLogin={() => setIsLoginDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
