"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
    children?: ReactNode
    className?: string
    depth?: number
    delay?: number
}

export const FloatingElement = ({
    children,
    className,
    depth = 1,
    delay = 0
}: FloatingElementProps) => {
    const { scrollY } = useScroll()
    const bobY = useMotionValue(0)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        // Randomize duration only on client side to avoid hydration mismatch
        const duration = 3 + Math.random() * 2

        const controls = animate(bobY, [0, -10, 0], {
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        })

        return () => controls.stop()
    }, [delay, bobY])

    // Parallax effect based on scroll
    const parallaxY = useTransform(scrollY, [0, 1000], [0, -50 * depth])
    const smoothParallaxY = useSpring(parallaxY, { stiffness: 100, damping: 20 })

    // Combine parallax and bobbing
    const y = useTransform([smoothParallaxY, bobY], (latest: any[]) => {
        return latest[0] + latest[1]
    })

    return (
        <motion.div
            className={cn("relative", className)}
            style={{ y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.8, delay } }}
        >
            {children}
        </motion.div>
    )
}
