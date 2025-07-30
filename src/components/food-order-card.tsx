
"use client";

import { useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Link as LinkIcon, Phone, ShoppingCart, Pencil, Trash2, Check, X, ShieldCheck, History } from 'lucide-react';
import OrderItem from '@/components/order-item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { isPast } from 'date-fns';
import CountdownTimer from '@/components/countdown-timer';
import GroupOrderForm from '@/components/group-order-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function FoodOrderCard({ order, isHistoric }: { order: FoodOrder, isHistoric: boolean }) {
    const { user, getUserById, addOrderItem, togglePaidStatus, toggleOrderState, removeFoodOrder, editFoodOrder } = useContext(AppContext);
    const [newItem, setNewItem] = useState<{ name: string; details: string; price: string }>({ name: '', details: '', price: '' });
    const [guestName, setGuestName] = useState('');
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    if (!user) return null;

    const creator = getUserById(order.creatorId);
    const isCreator = user.id === order.creatorId;
    const isAdmin = user.role === 'admin';
    const isDeadlinePassed = order.deadline ? isPast(new Date(order.deadline)) : false;

    const handleAddOrderItem = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(newItem.price);
        if (newItem.name && !isNaN(price) && price > 0) {
            addOrderItem(order.id, {
                name: newItem.name,
                details: newItem.details,
                price: price,
            }, guestName || undefined);
            setNewItem({ name: '', details: '', price: '' });
            setGuestName('');
            setIsOrderDialogOpen(false);
        }
    };
    
    const handleEditSubmit = (editedOrder: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'order' }) => {
        if (!order) return;
        editFoodOrder(order.id, editedOrder);
        setIsEditDialogOpen(false);
    };

    const totalAmount = order.orders.reduce((sum, item) => sum + item.price, 0);
    const canOrder = order.isOpen && !isDeadlinePassed;

    return (
        <Card className="flex flex-col border-primary/30 bg-card h-full">
            <CardHeader className="bg-secondary/50 rounded-t-lg p-4">
                <div className="flex items-start gap-4">
                    <div className="h-14 w-14 flex items-center justify-center bg-muted rounded-md border-2 border-border">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="font-headline text-xl text-primary break-words">{order.companyName}</CardTitle>
                         {creator ? (
                            <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Avatar className="h-4 w-4">
                                   {creator.avatarUrl ? <AvatarImage src={creator.avatarUrl} alt={creator.name} /> : <AvatarFallback><UserCircle /></AvatarFallback>}
                                </Avatar>
                                Stworzone przez {creator.name}
                            </CardDescription>
                        ) : (
                           <CardDescription className="text-xs text-muted-foreground">Nie znaleziono twórcy</CardDescription>
                        )}
                    </div>
                    {!order.isOpen && <Badge variant="destructive" className="bg-red-500/80">Zamknięte</Badge>}
                </div>
                 {order.deadline && <CountdownTimer deadline={order.deadline} />}
            </CardHeader>

            <CardContent className="flex-grow space-y-4 flex flex-col min-h-0 p-4">
                 <ScrollArea className="flex-grow pr-4 -mr-4">
                    <div className="space-y-3">
                        {order.orders.map(item => (
                            <OrderItem key={item.id} item={item} orderId={order.id} isCreator={isCreator} isAdmin={isAdmin} isHistoric={isHistoric} />
                        ))}
                         {order.orders.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">Brak zamówień. Bądź pierwszy!</p>
                        )}
                    </div>
                </ScrollArea>
                 <Separator className="mt-auto" />
                <div className="flex justify-between items-center font-bold pt-2">
                    <span>Suma:</span>
                    <span>{totalAmount.toFixed(2)} zł</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-3 border-t p-4 bg-secondary/30">
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <a href={order.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                        <LinkIcon /> Link do Menu
                    </a>
                    <span className="flex items-center gap-1">
                        <Phone /> {order.creatorPhoneNumber}
                    </span>
                </div>

                {canOrder ? (
                    <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="glass" className="w-full"><ShoppingCart className="mr-2" /> Dodaj zamówienie</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Dodaj do zamówienia "{order.companyName}"</DialogTitle>
                                <DialogDescription>
                                    Możesz dodać zamówienie dla siebie lub dla gościa, który nie jest w aplikacji.
                                    <Button variant="link" asChild className="p-0 h-auto ml-1 text-primary">
                                        <a href={order.link} target="_blank" rel="noopener noreferrer">Zobacz menu</a>
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddOrderItem} className="space-y-4">
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Zamówienie dla gościa</h4>
                                    <Label htmlFor="guest-name">Imię i nazwisko gościa (opcjonalnie)</Label>
                                    <Input id="guest-name" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="np. Jan Kowalski" />
                                    <p className="text-xs text-muted-foreground">Jeśli zostawisz puste, zamówienie zostanie przypisane do Ciebie.</p>
                                </div>
                                <Separator />
                                <div>
                                    <Label htmlFor="item-name">Nazwa produktu</Label>
                                    <Input id="item-name" value={newItem.name} onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))} required />
                                </div>
                                <div>
                                    <Label htmlFor="item-details">Szczegóły (opcjonalnie)</Label>
                                    <Input id="item-details" value={newItem.details} onChange={e => setNewItem(prev => ({ ...prev, details: e.target.value }))} placeholder="np. dodatkowy ser, bez cebuli" />
                                </div>
                                <div>
                                    <Label htmlFor="item-price">Cena</Label>
                                    <Input id="item-price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))} required />
                                </div>
                                <Button type="submit" variant="glass" className="w-full">Dodaj zamówienie</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                ) : (
                    !isHistoric && <Button className="w-full" disabled>
                        {isDeadlinePassed ? 'Zbiórka zamówień zakończona' : 'Wydarzenie zamknięte'}
                    </Button>
                )}
                
                {(isCreator || isAdmin) && isHistoric && (
                    <Button variant="outline" onClick={() => toggleOrderState(order.id)} className="w-full transition-transform duration-100 hover:-translate-y-0.5">
                        <History className="mr-2" /> Wznów zamówienie
                    </Button>
                )}

                 {(isCreator || isAdmin) && !isHistoric && (
                     <div className="w-full space-y-2 pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground">Akcje twórcy</p>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="secondary" onClick={() => togglePaidStatus(order.id, 'all')} className="transition-transform duration-100 hover:-translate-y-0.5">
                                <Check className="mr-2" /> Oznacz wszystkich jako opłaconych
                            </Button>
                            <Button variant="outline" onClick={() => toggleOrderState(order.id)} className="transition-transform duration-100 hover:-translate-y-0.5">
                                <X className="mr-2"/> Zakończ zbiórkę
                            </Button>
                        </div>
                     </div>
                )}

                {(isCreator || isAdmin) && !isHistoric && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-primary">
                        <p className="text-xs font-semibold text-primary flex items-center gap-1"><ShieldCheck /> Akcje administratora / twórcy</p>
                        <div className="flex gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="flex-1 transition-transform duration-100 hover:-translate-y-0.5" variant="destructive">
                                        <Trash2 className="mr-2" /> Usuń
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Czy na pewno chcesz usunąć to wydarzenie?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tej akcji nie można cofnąć. Spowoduje to trwałe usunięcie zamówienia
                                            i wszystkich powiązanych z nim danych.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeFoodOrder(order.id)}>Usuń</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 transition-transform duration-100 hover:-translate-y-0.5" variant="outline">
                                        <Pencil className="mr-2" /> Edytuj
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xl">
                                    <DialogHeader>
                                        <DialogTitle>Edytuj zamówienie grupowe</DialogTitle>
                                        <DialogDescription>Zmień szczegóły istniejącego zamówienia.</DialogDescription>
                                    </DialogHeader>
                                    <GroupOrderForm
                                        onSubmit={handleEditSubmit}
                                        onCancel={() => setIsEditDialogOpen(false)}
                                        existingOrder={order}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
