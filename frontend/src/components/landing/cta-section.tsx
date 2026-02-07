"use client"

import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ArrowRight } from "lucide-react"

export const CTASection = () => {
    return (
        <section className="py-32 bg-white dark:bg-black relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background gradient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-white"
                >
                    Ready to float?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto"
                >
                    Join thousands of developers experiencing the lightness of optimized code.
                </motion.p>

                <div className="flex justify-center">
                    <MagneticButton strength={0.3} className="group px-10 py-5 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                        <span className="flex items-center gap-2">
                            Start Analysis Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </MagneticButton>
                </div>
            </div>
        </section>
    )
}
