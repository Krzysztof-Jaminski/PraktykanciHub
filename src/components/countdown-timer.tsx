
"use client";

import { useState, useEffect } from 'react';
import { intervalToDuration, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ deadline }: { deadline: string }) => {
    const calculateTimeLeft = () => {
        const end = new Date(deadline);
        const now = new Date();
        
        if (isPast(end)) {
            return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const duration = intervalToDuration({ start: now, end });
        return {
            total: end.getTime() - now.getTime(),
            days: duration.days || 0,
            hours: duration.hours || 0,
            minutes: duration.minutes || 0,
            seconds: duration.seconds || 0,
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    if (timeLeft.total <= 0) {
        return (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-accent bg-accent/20 p-2 rounded-md flex items-center justify-center gap-2 mt-2"
            >
                <Clock className="h-4 w-4" />
                Czas minął!
            </motion.div>
        );
    }

    return (
        <div className="text-sm font-medium text-accent-foreground bg-accent/20 p-2 rounded-md flex items-center justify-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Kończy się za:</span>
            {timeLeft.days > 0 && <span className="font-bold">{timeLeft.days}d</span>}
            <span className="font-bold">{formatTime(timeLeft.hours)}h</span>
            <span className="font-bold">{formatTime(timeLeft.minutes)}m</span>
            <span className="font-bold">{formatTime(timeLeft.seconds)}s</span>
        </div>
    );
};

export default CountdownTimer;
