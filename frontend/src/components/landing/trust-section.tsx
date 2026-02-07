"use client"

import { motion } from "framer-motion"

const stats = [
    { value: "10M+", label: "Lines Analyzed" },
    { value: "99.9%", label: "Uptime" },
    { value: "500+", label: "Repositories" },
    { value: "Zero", label: "Gravity" },
]

export const TrustSection = () => {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-zinc-400 dark:text-zinc-600 text-sm uppercase tracking-widest mb-8">Trusted by heavyweights</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                        {/* Placeholders for logos, using text for now as per instructions to not use external images without copying */}
                        <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">ACME Corp</span>
                        <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">StellarInst</span>
                        <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">NebulaLabs</span>
                        <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">VoidSystems</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
