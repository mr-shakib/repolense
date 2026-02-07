'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
    icon?: ReactNode;
}

export default function Button({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    icon,
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 elevation-2 hover:elevation-3',
        secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary-300 hover:bg-gray-50 focus:ring-primary-500 elevation-1 hover:elevation-2',
        ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
        <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </>
    );

    // Microinteraction: subtle scale on press
    const buttonMotion = {
        whileTap: disabled ? {} : { scale: 0.98 },
        whileHover: disabled ? {} : { y: -1 },
    };

    if (href && !disabled) {
        return (
            <motion.div {...buttonMotion}>
                <Link href={href} className={combinedClassName}>
                    {content}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            {...buttonMotion}
        >
            {content}
        </motion.button>
    );
}
