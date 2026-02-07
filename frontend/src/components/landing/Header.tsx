'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'How it works', href: '#how-it-works' },
        { name: 'Features', href: '#what-we-analyze' },
        { name: 'Sample report', href: '#sample-insight' },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ${scrolled ? 'pt-4' : 'pt-6'
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="pointer-events-auto relative mx-4">
                <motion.nav
                    className={`
                        relative flex items-center justify-between gap-2
                        p-2 bg-white/70 backdrop-blur-xl saturate-150
                        border border-white/40 shadow-xl shadow-black/5
                        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                        ${mobileMenuOpen ? 'rounded-[32px] flex-col items-stretch' : 'rounded-full pl-5 pr-2'}
                    `}
                    layout
                    style={{
                        minWidth: mobileMenuOpen ? '320px' : 'auto',
                    }}
                >
                    <div className="flex items-center justify-between w-full gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-105 transition-transform duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold text-gray-900 tracking-tight">
                                RepoLense
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {!mobileMenuOpen && (
                            <div className="hidden md:flex items-center gap-1">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                                        onMouseEnter={() => setHoveredItem(item.name)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        {hoveredItem === item.name && (
                                            <motion.div
                                                layoutId="nav-hover"
                                                className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {/* CTA Button */}
                            {!mobileMenuOpen && (
                                <Link
                                    href="/analyze"
                                    className="hidden md:flex px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-full transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5"
                                >
                                    Analyze Report
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
                                    <motion.span
                                        animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 5 : 0 }}
                                        className="w-full h-0.5 bg-current rounded-full origin-center"
                                    />
                                    <motion.span
                                        animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                                        className="w-full h-0.5 bg-current rounded-full"
                                    />
                                    <motion.span
                                        animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -5 : 0 }}
                                        className="w-full h-0.5 bg-current rounded-full origin-center"
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Menu Content */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden md:hidden w-full"
                            >
                                <div className="flex flex-col gap-2 p-2 pt-4">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                    <Link
                                        href="/analyze"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-2xl text-center shadow-lg shadow-gray-900/20 transition-all mt-2"
                                    >
                                        Analyze Report
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </div>
        </motion.header>
    );
}
