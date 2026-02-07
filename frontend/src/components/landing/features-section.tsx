"use client"

import { motion } from "framer-motion"
import { Code, Database, Share2, Shield, Zap, GitBranch } from "lucide-react"

const features = [
    {
        icon: <Code className="w-6 h-6" />,
        title: "Architecture Analysis",
        description: "Visualize your codebase structure with weightless dependency graphs.",
        delay: 0
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Security Scan",
        description: "Detect vulnerabilities before they weigh down your deployment.",
        delay: 0.1
    },
    {
        icon: <Database className="w-6 h-6" />,
        title: "Database Insights",
        description: "Optimize queries and schema design for effortless performance.",
        delay: 0.2
    },
    {
        icon: <GitBranch className="w-6 h-6" />,
        title: "Branch Health",
        description: "Keep your git history clean and drift-free.",
        delay: 0.3
    },
    {
        icon: <Share2 className="w-6 h-6" />,
        title: "Collaboration",
        description: "Measure team velocity and friction points.",
        delay: 0.4
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Instant Reports",
        description: "Generate deep insights in seconds, not minutes.",
        delay: 0.5
    }
]

export const FeaturesSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white"
                    >
                        Capabilities that defy expectations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
                    >
                        Our physics-based analysis engine treats every line of code as a dynamic object,
                        simulating real-world interactions to find friction points.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
