
'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedSquare = ({
    size,
    initialX,
    initialY,
    duration,
    delay = 0
}: {
    size: number,
    initialX: string,
    initialY: string,
    duration: number,
    delay?: number
}) => (
    <motion.div
        style={{
            width: size,
            height: size,
            position: 'absolute',
            top: initialY,
            left: initialX,
            backgroundColor: 'hsla(var(--primary) / var(--bg-square-opacity))',
            borderRadius: '15px',
            filter: 'blur(10px)',
        }}
        initial={{ opacity: 0, y: 50, rotate: 0 }}
        animate={{
            opacity: [0, 1, 0],
            y: [50, -50, 50],
            x: [0, 20, -20, 0],
            rotate: [0, 90, 180],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: delay,
        }}
    />
);

export default function AnimatedBackground() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (!isMounted) {
        return null;
    }

    return (
        <div id="animated-bg" className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
             {/* Static glows */}
            <div
                className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] rounded-full filter blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, hsla(var(--primary) / var(--bg-glow-opacity)), transparent 60%)'}}
            ></div>
            <div 
                className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full filter blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, hsla(var(--accent) / var(--bg-glow-opacity)), transparent 60%)'}}
            ></div>
            <div 
                className="absolute bottom-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full filter blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, hsla(28, 100%, 50%, var(--bg-glow-orange-opacity)), transparent 70%)'}}
            ></div>
             <div 
                className="absolute top-[5%] right-[10%] w-[50vw] h-[50vw] rounded-full filter blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, hsla(28, 100%, 50%, var(--bg-glow-orange-opacity)), transparent 70%)'}}
            ></div>


            {/* Simplified Animated squares */}
            <AnimatedSquare size={350} initialX="5%" initialY="15%" duration={35} />
            <AnimatedSquare size={400} initialX="85%" initialY="70%" duration={40} />
            <AnimatedSquare size={200} initialX="50%" initialY="40%" duration={30} delay={5} />
        </div>
    );
}
