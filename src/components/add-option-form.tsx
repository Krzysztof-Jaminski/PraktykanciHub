
"use client";

import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type AddOptionFormProps = {
    eventId: string;
    onAdded: () => void;
};

const formSchema = z.object({
    name: z.string().min(1, "Nazwa firmy jest wymagana."),
    link: z.string().url("Proszę podać prawidłowy URL.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddOptionForm({ eventId, onAdded }: AddOptionFormProps) {
    const { addVotingOption } = useContext(AppContext);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            link: '',
        },
    });

    const handleSubmit = (values: FormValues) => {
        addVotingOption(eventId, values);
        onAdded();
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwa firmy</FormLabel>
                            <FormControl>
                                <Input placeholder="np. Burger King" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link do menu (opcjonalnie)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/menu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="glass" className="w-full">Dodaj opcję</Button>
            </form>
        </Form>
    );
}

    