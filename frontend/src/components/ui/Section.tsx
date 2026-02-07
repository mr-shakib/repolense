'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    animate?: boolean;
}

export default function Section({
    children,
    className = '',
    id,
    animate = true
}: SectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const baseStyles = 'py-20 md:py-32';
    const combinedClassName = `${baseStyles} ${className}`;

    // Scroll-triggered animation: fade + translate
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1] as const, // Custom easing for smooth motion
            }
        }
    };

    if (!animate) {
        return (
            <section id={id} className={combinedClassName}>
                {children}
            </section>
        );
    }

    return (
        <motion.section
            ref={ref}
            id={id}
            className={combinedClassName}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
        >
            {children}
        </motion.section>
    );
}
