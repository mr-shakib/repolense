"use client"

import { motion } from "framer-motion"
import { FloatingElement } from "@/components/ui/floating-element"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { MoveUpRight } from "lucide-react"

export const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-black">
            {/* Abstract Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingElement depth={0.5} delay={0} className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
                <FloatingElement depth={1.2} delay={1} className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl" />
                <FloatingElement depth={0.8} delay={2} className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-slate-100/20 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 text-sm text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    RepoLens AI is now in public beta
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 max-w-4xl mx-auto"
                >
                    Code analysis, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        defying gravity.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Experience weightless repository insights. Our AI-driven platform floats through your code,
                    effortlessly surfacing architecture patterns, quality metrics, and hidden risks.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <MagneticButton className="px-8 py-4 bg-zinc-900 text-white rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50">
                        Analyze Repository <MoveUpRight className="w-4 h-4" />
                    </MagneticButton>

                    <MagneticButton strength={0.2} className="px-8 py-4 bg-white text-zinc-600 border border-zinc-200 rounded-full font-medium hover:bg-zinc-50 transition-colors dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900">
                        View Sample Report
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    )
}
