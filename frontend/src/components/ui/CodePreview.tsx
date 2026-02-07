'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CodePreviewProps {
    children: ReactNode;
    language?: string;
    className?: string;
}

export default function CodePreview({
    children,
    language = 'typescript',
    className = ''
}: CodePreviewProps) {
    return (
        <motion.div
            className={`relative group ${className}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {/* Language badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-md z-10">
                {language}
            </div>

            {/* Code container */}
            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto elevation-2 group-hover:elevation-3 transition-all duration-200">
                <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                    <code>{children}</code>
                </pre>
            </div>

            {/* Subtle hover reveal effect */}
            <motion.div
                className="absolute inset-0 rounded-xl border-2 border-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none"
            />
        </motion.div>
    );
}
