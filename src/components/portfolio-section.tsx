
"use client";

import { useState, useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import type { PortfolioItem } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { FileText, Link, PlusCircle, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import PortfolioItemForm from './portfolio-item-form';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

export default function PortfolioSection() {
    const { user, portfolio, upsertPortfolioItem, removePortfolioItem, togglePortfolioItemVisibility } = useContext(AppContext);
    const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);

    if (!user) return null;

    const sortedPortfolio = portfolio.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const statuses = sortedPortfolio.filter(item => item.type === 'status');
    const projects = sortedPortfolio.filter(item => item.type === 'project');

    const handleEdit = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(undefined);
        setIsFormOpen(true);
    }
    
    const handleFormSubmit = (item: PortfolioItem) => {
        upsertPortfolioItem(item);
        setIsFormOpen(false);
        setEditingItem(undefined);
    }

    const renderItem = (item: PortfolioItem) => (
        <Card key={item.id} className={cn("flex flex-col bg-card")}>
            <CardHeader className={cn("p-4 bg-secondary/50")}>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className={cn("font-headline text-lg", "text-white")}>{item.title}</CardTitle>
                        <CardDescription>
                            {item.type === 'status' && item.weekOf && `Status na tydzień ${format(parseISO(item.weekOf), 'd MMMM yyyy', { locale: pl })}`}
                            {item.type === 'project' && `Dodano ${format(parseISO(item.date), 'd MMMM yyyy', { locale: pl })}`}
                        </CardDescription>
                    </div>
                    <Badge variant={item.type === 'status' ? 'default' : 'secondary'} className={cn(item.type === 'status' && "bg-accent/80 text-white")}>{item.type === 'status' ? 'Status' : 'Projekt'}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                 {item.technologies && item.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {item.technologies.map(tech => <Badge key={tech} variant="outline">{tech}</Badge>)}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
                 <div>
                    {item.link && (
                        <Button variant="link" asChild className="p-0 h-auto">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                               <Link className="mr-2" /> Zobacz Link
                            </a>
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => togglePortfolioItemVisibility(item.id)}>
                        {item.isVisible ? <Eye /> : <EyeOff />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil /></Button>
                    <Button variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400" onClick={() => removePortfolioItem(item.id)}><Trash2 /></Button>
                </div>
            </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Separator className="my-6" />

            {/* Projects Portfolio */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold font-headline text-white">Portfolio Projektów</h3>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddNew} variant="glass">
                                <PlusCircle className="mr-2" /> Dodaj Projekt
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingItem ? "Edytuj Projekt" : "Dodaj Nowy Projekt"}</DialogTitle>
                            </DialogHeader>
                            <PortfolioItemForm
                              item={editingItem}
                              onSubmit={handleFormSubmit}
                              onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                 {projects.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-1">
                        {projects.map(renderItem)}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">Nie dodano jeszcze żadnych projektów.</p>
                )}
            </div>

            <Separator className="my-6" />

            {/* Weekly Statuses */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline text-white">Statusy Tygodniowe</h3>
                {statuses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-1">
                        {statuses.map(renderItem)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium">Brak Opublikowanych Statusów</p>
                        <p className="text-sm text-muted-foreground">Twoje tygodniowe statusy pojawią się tutaj automatycznie.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
