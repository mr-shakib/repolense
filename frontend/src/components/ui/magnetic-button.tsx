"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
    children: ReactNode
    className?: string
    strength?: number
    onClick?: () => void
}

export const MagneticButton = ({
    children,
    className,
    strength = 0.5,
    onClick
}: MagneticButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current!.getBoundingClientRect()

        const xPos = (clientX - (left + width / 2)) * strength
        const yPos = (clientY - (top + height / 2)) * strength

        x.set(xPos)
        y.set(yPos)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.button
            ref={ref}
            className={cn("relative", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ x: mouseX, y: mouseY }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}
