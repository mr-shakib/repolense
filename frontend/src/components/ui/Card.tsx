'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export default function Card({
    children,
    className = '',
    hover = true,
    onClick
}: CardProps) {
    const baseStyles = 'bg-white rounded-2xl p-6 transition-all duration-200';
    const hoverStyles = hover ? 'elevation-1 hover:elevation-3 cursor-pointer' : 'elevation-1';

    const combinedClassName = `${baseStyles} ${hoverStyles} ${className}`;

    // Microinteraction: gentle lift on hover (2-4px)
    const cardMotion = hover ? {
        whileHover: { y: -3 },
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    } : {};

    return (
        <motion.div
            className={combinedClassName}
            onClick={onClick}
            {...cardMotion}
        >
            {children}
        </motion.div>
    );
}
