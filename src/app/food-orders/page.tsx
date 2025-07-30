
"use client";

import { useState, useContext, useMemo, useCallback } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, UtensilsCrossed, Vote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder } from '@/lib/types';
import FoodOrderCard from '@/components/food-order-card';
import VotingEventCard from '@/components/voting-event-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GroupOrderForm from '@/components/group-order-form';
import VotingEventForm from '@/components/voting-event-form';
import { cn } from '@/lib/utils';

type EventType = 'order' | 'voting';

export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder, storedOrderDetails } = useContext(AppContext);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);

    const handleFormSubmit = useCallback((data: any) => {
        addFoodOrder(data);
        setIsDialogOpen(false);
        setSelectedEventType(null);
    }, [addFoodOrder]);
    
    const handleOpenDialog = (type: EventType) => {
        setSelectedEventType(type);
        setIsDialogOpen(true);
    }
    
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedEventType(null);
        }
    }

    const activeVotingEvent = useMemo(() => foodOrders.find(order => order.type === 'voting' && order.isOpen), [foodOrders]);
    const activeOrderEvents = useMemo(() => foodOrders.filter(order => order.type === 'order' && order.isOpen), [foodOrders]);
    
    const historicEvents = useMemo(() => foodOrders.filter(order => !order.isOpen), [foodOrders]);
    const historicVotings = historicEvents.filter(o => o.type === 'voting');
    const historicOrders = historicEvents.filter(o => o.type === 'order');

    const [activeTab, setActiveTab] = useState('active');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05
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

    const renderActiveContent = () => (
        <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="space-y-8"
        >
            {activeVotingEvent ? (
                 <div className="grid md:grid-cols-1 gap-6">
                    <VotingEventCard event={activeVotingEvent} isHistoric={false} />
                </div>
            ) : (
                <Alert className="mb-8 border-primary/50 bg-primary/10 text-primary-foreground">
                    <Info className="h-4 w-4 !text-primary" />
                    <AlertTitle>Brak aktywnego głosowania</AlertTitle>
                    <AlertDescription>
                        Obecnie nie ma aktywnego głosowania. Możesz utworzyć nowe, aby społeczność wybrała restaurację.
                    </AlertDescription>
                </Alert>
            )}
            
            {activeOrderEvents.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline text-white">Aktywne zamówienia</h2>
                    <motion.div 
                        className="grid md:grid-cols-1 gap-6"
                        variants={containerVariants} 
                        initial="hidden" 
                        animate="visible"
                    >
                        {activeOrderEvents.map(order => (
                            <motion.div key={`active-order-${order.id}`} variants={itemVariants}>
                                <FoodOrderCard order={order} isHistoric={false} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                 <Alert className="mb-8 border-primary/50 bg-primary/10 text-primary-foreground">
                    <Info className="h-4 w-4 !text-primary" />
                    <AlertTitle>Brak aktywnych zamówień</AlertTitle>
                    <AlertDescription>
                        Możesz utworzyć zamówienie grupowe, jeśli nie ma potrzeby głosowania.
                    </AlertDescription>
                </Alert>
            )}
        </motion.div>
    );

    const renderHistoryContent = () => (
         <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="space-y-8"
        >
            <div className="space-y-4">
                <Card className="bg-card/50 border-border/20 p-4">
                     <CardTitle className="text-xl font-bold font-headline text-white">Zakończone głosowania</CardTitle>
                </Card>
                {historicVotings.length > 0 ? (
                    <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                        {historicVotings.map(event => (
                            <motion.div key={`hist-vote-${event.id}`} variants={itemVariants}>
                                <VotingEventCard event={event} isHistoric={true} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <Alert className="border-primary/50 bg-primary/10 text-primary-foreground">
                        <Info className="h-4 w-4 !text-primary" />
                        <AlertTitle>Brak zakończonych głosowań</AlertTitle>
                        <AlertDescription>
                            Wszystkie zakończone głosowania pojawią się w tym miejscu.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="space-y-4">
                <Card className="bg-card/50 border-border/20 p-4">
                    <CardTitle className="text-xl font-bold font-headline text-white">Zakończone zamówienia</CardTitle>
                </Card>
                {historicOrders.length > 0 ? (
                    <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                        {historicOrders.map(order => (
                             <motion.div key={`hist-order-${order.id}`} variants={itemVariants}>
                                <FoodOrderCard order={order} isHistoric={true} />
                             </motion.div>
                        ))}
                    </motion.div>
                ) : (
                     <Alert className="border-primary/50 bg-primary/10 text-primary-foreground">
                        <Info className="h-4 w-4 !text-primary" />
                        <AlertTitle>Brak zakończonych zamówień</AlertTitle>
                        <AlertDescription>
                            Wszystkie zakończone zamówienia pojawią się w tym miejscu.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </motion.div>
    );

    const renderDialogContent = () => {
        if (!selectedEventType) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle>Utwórz nowe wydarzenie jedzeniowe</DialogTitle>
                        <DialogDescription>Wybierz typ wydarzenia, które chcesz utworzyć.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <Card
                            onClick={() => setSelectedEventType('order')}
                            className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary transition-colors duration-75 focus:ring-2 focus:ring-primary outline-none"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setSelectedEventType('order')}
                        >
                            <UtensilsCrossed className="h-12 w-12 mb-4 text-primary" />
                            <h3 className="text-lg font-bold">Zamówienie grupowe</h3>
                            <p className="text-sm text-muted-foreground">Utwórz zamówienie z jednej, konkretnej restauracji.</p>
                        </Card>
                        <Card
                            onClick={() => setSelectedEventType('voting')}
                            className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary transition-colors duration-75 focus:ring-2 focus:ring-primary outline-none"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setSelectedEventType('voting')}
                        >
                            <Vote className="h-12 w-12 mb-4 text-accent" />
                            <h3 className="text-lg font-bold">Głosowanie na restaurację</h3>
                            <p className="text-sm text-muted-foreground">Pozwól społeczności wybrać, skąd chcecie zamówić jedzenie.</p>
                        </Card>
                    </div>
                </>
            );
        }

        if (selectedEventType === 'order') {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle>Utwórz nowe zamówienie grupowe</DialogTitle>
                        <DialogDescription>Wypełnij poniższe pola, aby rozpocząć zbieranie zamówień.</DialogDescription>
                    </DialogHeader>
                    <GroupOrderForm
                        onSubmit={handleFormSubmit}
                        onCancel={() => handleDialogChange(false)}
                        storedDetails={storedOrderDetails}
                    />
                </>
            );
        }

        if (selectedEventType === 'voting') {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle>Utwórz nowe głosowanie</DialogTitle>
                         <DialogDescription>Zaproponuj restauracje i pozwól społeczności zdecydować.</DialogDescription>
                    </DialogHeader>
                    <VotingEventForm
                        onSubmit={handleFormSubmit}
                        onCancel={() => handleDialogChange(false)}
                    />
                </>
            );
        }

        return null;
    }
    
    const getDialogClassName = () => {
        if (selectedEventType === 'order') return 'sm:max-w-xl';
        if (selectedEventType === 'voting') return 'sm:max-w-3xl';
        return 'sm:max-w-lg';
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="min-h-screen text-foreground flex flex-col"
        >
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
                <Card className="bg-card/50 border-border/20 mb-8">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold font-headline text-gradient">Wydarzenia jedzeniowe</h1>
                                <p className="text-muted-foreground">Organizuj grupowe zamówienia i głosuj na restauracje.</p>
                            </div>
                             <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                                <DialogTrigger asChild>
                                    <Button variant="glass" onClick={() => setIsDialogOpen(true)}>
                                        <PlusCircle className="mr-2" /> Utwórz wydarzenie
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={getDialogClassName()}>
                                    {renderDialogContent()}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                </Card>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Aktywne wydarzenia</TabsTrigger>
                        <TabsTrigger value="history">Historia</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <AnimatePresence mode="wait">
                           {activeTab === 'active' ? renderActiveContent() : renderHistoryContent()}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </main>
        </motion.div>
    );
}
