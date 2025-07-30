
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import type { StoredOrderDetails } from "@/contexts/app-context";
import { useEffect } from "react";
import { format } from "date-fns";

type FormValues = {
    companyName: string;
    description?: string;
    link?: string;
    creatorPhoneNumber?: string;
    deadline?: string;
};

const formSchema = z.object({
    companyName: z.string().min(2, "Nazwa firmy musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
    creatorPhoneNumber: z.string().min(5, "Proszę wprowadzić prawidłowy numer telefonu.").optional().or(z.literal('')),
    deadline: z.string().optional(),
});

type GroupOrderFormProps = {
    onSubmit: (data: FormValues & { type: 'order' }) => void;
    onCancel: () => void;
    storedDetails?: StoredOrderDetails | null;
    existingOrder?: FoodOrder;
};

export default function GroupOrderForm({ onSubmit, onCancel, storedDetails, existingOrder }: GroupOrderFormProps) {
    const deadlineTime = existingOrder?.deadline ? format(new Date(existingOrder.deadline), 'HH:mm') : '';
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: existingOrder ? {
            ...existingOrder,
            creatorPhoneNumber: existingOrder.creatorPhoneNumber || "",
            deadline: deadlineTime,
        } : {
            companyName: "",
            description: "",
            link: storedDetails?.link || "",
            creatorPhoneNumber: storedDetails?.creatorPhoneNumber || "",
            deadline: "",
        },
    });

    useEffect(() => {
        if (storedDetails && !existingOrder) {
            form.reset({
                ...form.getValues(),
                link: storedDetails.link,
                creatorPhoneNumber: storedDetails.creatorPhoneNumber,
            });
        }
    }, [storedDetails, form, existingOrder]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit({
            ...values,
            type: 'order'
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                <ScrollArea className="flex-grow p-1">
                    <div className="space-y-6 pr-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa firmy/restauracji</FormLabel>
                                    <FormControl><Input placeholder='np. Pizzeria "Szybka Pizza"' {...field} /></FormControl>
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
                                    <FormDescription>Po tym czasie nie będzie można dodawać nowych zamówień.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opis (opcjonalnie)</FormLabel>
                                    <FormControl><Textarea placeholder="np. instrukcje organizacyjne, numer BLIK do płatności..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link do menu</FormLabel>
                                    <FormControl><Input placeholder="https://przykladowapizza.com/menu" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="creatorPhoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twój numer telefonu</FormLabel>
                                    <FormControl><Input placeholder="Do koordynacji płatności" {...field} /></FormControl>
                                    <FormDescription>Twój numer będzie widoczny dla innych w tym zamówieniu.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" variant="glass">{existingOrder ? 'Zapisz zmiany' : 'Utwórz zamówienie'}</Button>
                </div>
            </form>
        </Form>
    );
}
