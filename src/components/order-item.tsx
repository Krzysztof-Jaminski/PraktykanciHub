
"use client";

import { useContext } from 'react';
import type { User } from '@/lib/types';
import type { OrderItem } from '@/lib/types';
import { AppContext } from '@/contexts/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Trash2, UserCircle, X, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type OrderItemProps = {
    item: OrderItem;
    orderId: string;
    isCreator: boolean;
    isAdmin: boolean;
    isHistoric: boolean;
};

export default function OrderItem({ item, orderId, isCreator, isAdmin, isHistoric }: OrderItemProps) {
    const { user, getUserById, removeOrderItem, togglePaidStatus } = useContext(AppContext);
    
    const itemUser = item.userId ? getUserById(item.userId) : null;
    const displayName = item.guestName || itemUser?.name || 'Unknown User';
    const displayAvatar = itemUser?.avatarUrl;

    const canModify = isCreator || isAdmin || user?.id === item.userId;

    if (!user) return null;

    return (
        <div className={cn(
            "flex items-center gap-3 p-2 rounded-md transition-colors",
            item.isPaid ? 'bg-green-500/20' : 'bg-secondary'
        )}>
            <Avatar className="h-8 w-8">
                 {displayAvatar ? <AvatarImage src={displayAvatar} alt={displayName} /> : <AvatarFallback><UserCircle /></AvatarFallback>}
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm flex items-center gap-2">
                        {displayName}
                        {item.guestName && <Badge variant="outline">Gość</Badge>}
                    </span>
                    <p className="font-bold text-sm text-primary">{item.price.toFixed(2)} zł</p>
                </div>
                <p className="text-xs text-foreground/80">{item.name}</p>
                {item.details && <p className="text-xs text-muted-foreground">↳ {item.details}</p>}
            </div>
            
            <div className="flex items-center gap-1">
                 {(isCreator || isAdmin) && !isHistoric && (
                    <Button 
                        size="icon" 
                        variant={item.isPaid ? "default" : "outline"} 
                        className={cn(
                            "h-7 w-7",
                            item.isPaid ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-secondary/50"
                        )}
                        onClick={() => togglePaidStatus(orderId, item.id)}
                    >
                        {item.isPaid ? <X /> : <Check />}
                    </Button>
                )}
                 {(canModify || isAdmin) && !isHistoric && (
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 relative"
                        onClick={() => removeOrderItem(orderId, item.id)}
                    >
                         {isAdmin && user?.id !== item.userId && !isCreator && <ShieldCheck className="absolute h-3 w-3 -top-1 -right-1 text-primary" />}
                        <Trash2 />
                    </Button>
                 )}
            </div>
        </div>
    );
}
