
"use client";

import { useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/app-context';
import Header from '@/components/header';
import WeeklyCalendar from '@/components/weekly-calendar';
import WeeklyStatus from '@/components/weekly-status';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, firebaseUser, authLoading } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !firebaseUser && !user) {
        router.push('/welcome');
    }
  }, [authLoading, user, firebaseUser, router]);
  

  if (authLoading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <motion.div 
        className="min-h-screen text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
    >
        <>
          <Header />
          <main className="container mx-auto px-4 py-8">
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.1 }}
             >
                <WeeklyStatus />
            </motion.div>
            
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.2 }}
                className="mt-8"
             >
                <WeeklyCalendar />
            </motion.div>
          </main>
        </>
    </motion.div>
  );
}
