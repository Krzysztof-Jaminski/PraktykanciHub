
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const formSchema = z.object({
    companyName: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    deadline: z.string().regex(timeRegex, "Nieprawidłowy format czasu (HH:MM).").optional().or(z.literal('')),
    votingOptions: z.array(z.object({
        name: z.string().min(1, "Nazwa firmy jest wymagana."),
        link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
    })).min(1, "Musisz podać co najmniej jedną opcję do głosowania.")
});

type FormValues = z.infer<typeof formSchema>;

type VotingEventFormProps = {
    onSubmit: (data: FormValues & { type: 'voting' }) => void;
    onCancel: () => void;
    existingEvent?: FoodOrder;
};

export default function VotingEventForm({ onSubmit, onCancel, existingEvent }: VotingEventFormProps) {
    const deadlineTime = existingEvent?.deadline ? format(new Date(existingEvent.deadline), 'HH:mm') : '';
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: existingEvent ? {
            companyName: existingEvent.companyName,
            description: existingEvent.description || "",
            deadline: deadlineTime,
            votingOptions: existingEvent.votingOptions?.map(opt => ({ name: opt.name, link: opt.link || '' })) || [],
        } : {
            companyName: "",
            description: "",
            deadline: "",
            votingOptions: [
                { name: '', link: '' },
                { name: '', link: '' },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "votingOptions"
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit({
            ...values,
            type: 'voting'
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full max-h-[80vh]">
                 <ScrollArea className="flex-grow p-1 pr-4 -mr-4">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tytuł głosowania</FormLabel>
                                    <FormControl><Input placeholder="np. Piątkowy lunch" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Czas zakończenia (opcjonalnie)</FormLabel>
                                    <FormControl><Input type="time" {...field} /></FormControl>
                                    <FormDescription>Po tym czasie głosowanie zostanie zamknięte.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opis głosowania (opcjonalnie)</FormLabel>
                                    <FormControl><Textarea placeholder="np. instrukcje organizacyjne, zasady głosowania" {...field} className="min-h-[60px]" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <FormLabel>Opcje do głosowania</FormLabel>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', link: '' })}>
                                    <PlusCircle className="mr-2" /> Dodaj opcję
                                </Button>
                            </div>
                            
                            <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-secondary/30">
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="relative w-full bg-card p-4 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`votingOptions.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-primary">Opcja #{index + 1}</FormLabel>
                                                        <FormControl><Input placeholder="Nazwa firmy" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`votingOptions.${index}.link`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Link do menu (opcjonalnie)</FormLabel>
                                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {fields.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:bg-red-500/20 hover:text-red-400" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>

                            <FormField
                                control={form.control}
                                name="votingOptions"
                                render={() => (
                                    <FormItem>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                 </ScrollArea>
                <Separator className="my-3" />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" variant="glass">{existingEvent ? 'Zapisz zmiany' : 'Utwórz głosowanie'}</Button>
                </div>
            </form>
        </Form>
    );
}
