
"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '@/contexts/app-context';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, UserCircle } from 'lucide-react';
import type { User } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const UserCard = ({ user, isCurrentUser }: { user: User, isCurrentUser: boolean }) => {
    return (
        <Link href={`/users/${user.id}`} className="block">
            <Card className={cn(
                "hover:border-primary transition-all cursor-pointer bg-card",
                isCurrentUser && 'border-primary border-2'
            )}>
                <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                        {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg flex items-center gap-2 text-white">
                            {user.name}
                            {user.role === 'admin' && <ShieldCheck className="h-5 w-5 text-primary" />}
                        </p>
                        <p className="text-sm text-muted-foreground">Praktykant</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function UsersPage() {
  const { allUsers, user: currentUser } = useContext(AppContext);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="min-h-screen text-foreground"
    >
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline text-gradient">Praktykanci</h1>
            <p className="text-muted-foreground">Przeglądaj profile innych uczestników programu.</p>
        </div>
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {allUsers.map(user => (
                <motion.div key={user.id} variants={itemVariants}>
                    <UserCard user={user} isCurrentUser={user.id === currentUser?.id} />
                </motion.div>
            ))}
        </motion.div>
      </main>
    </motion.div>
  );
}
