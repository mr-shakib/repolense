'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnalysisPhase {
  name: string
  description: string
}

interface AnalysisLoadingAnimationProps {
  phases: AnalysisPhase[]
  currentPhase: number
}

const phaseIcons = {
  Ingestion: (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  ),
  Architecture: (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Quality: (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Principles: (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Collaboration: (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'AI Insights': (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
}

export default function AnalysisLoadingAnimation({ phases, currentPhase }: AnalysisLoadingAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)

    // Check screen size
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 lg:p-10">
        {/* Current Phase Display */}
        <div className="flex flex-col items-center mb-8 lg:mb-6">
          <motion.div
            key={currentPhase}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 lg:w-24 lg:h-24 mb-4 relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl"
              animate={{
                boxShadow: [
                  "0 10px 40px rgba(59, 130, 246, 0.3)",
                  "0 10px 60px rgba(79, 70, 229, 0.4)",
                  "0 10px 40px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {phaseIcons[phases[currentPhase]?.name as keyof typeof phaseIcons]}
            </motion.div>
            
            {/* Rotating Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-blue-400/30 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.h3
            key={`title-${currentPhase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl font-bold text-gray-900 mb-2"
          >
            {phases[currentPhase]?.name}
          </motion.h3>

          <motion.p
            key={`desc-${currentPhase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm lg:text-base text-gray-600 text-center max-w-md"
          >
            {phases[currentPhase]?.description}
          </motion.p>
        </div>

        {/* Progress Timeline */}
        <div className="space-y-3 lg:space-y-0 lg:overflow-hidden lg:relative">
          <motion.div
            className="lg:flex lg:gap-4 lg:items-start space-y-3 lg:space-y-0"
            animate={{
              x: isLargeScreen ? `${-currentPhase * 14}%` : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {phases.map((phase, index) => {
              const isCompleted = index < currentPhase
              const isActive = index === currentPhase
              const isPending = index > currentPhase

              return (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 lg:flex-col lg:flex-1 lg:min-w-[160px]"
                >
                {/* Status Indicator */}
                <div className="relative lg:self-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 10px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? { duration: 1.5, repeat: Infinity }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>

                  {/* Connecting Line - Vertical on mobile, Horizontal on desktop */}
                  {index < phases.length - 1 && (
                    <>
                      <motion.div
                        className={`absolute left-1/2 top-full w-0.5 h-3 -ml-px lg:hidden ${
                          index < currentPhase ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      />
                      <motion.div
                        className={`hidden lg:block absolute left-full top-1/2 h-0.5 w-4 -mt-px ${
                          index < currentPhase ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      />
                    </>
                  )}
                </div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0 lg:w-full">
                  <motion.div
                    className={`px-4 py-3 rounded-xl lg:text-center ${
                      isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : isActive
                        ? 'bg-blue-50 border border-blue-300'
                        : 'bg-white border border-gray-200'
                    }`}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.02, 1],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? { duration: 2, repeat: Infinity }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between lg:flex-col lg:gap-2">
                      <div className="min-w-0 flex-1 lg:w-full">
                        <p
                          className={`font-semibold text-sm lg:text-center ${
                            isCompleted
                              ? 'text-green-900'
                              : isActive
                              ? 'text-blue-900'
                              : 'text-gray-600'
                          }`}
                        >
                          {phase.name}
                        </p>
                        <p
                          className={`text-xs mt-0.5 lg:text-center ${
                            isCompleted
                              ? 'text-green-700'
                              : isActive
                              ? 'text-blue-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {phase.description}
                        </p>
                      </div>

                      {isActive && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-3 text-blue-600 lg:ml-0"
                        >
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white rounded-full h-2 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <motion.p
          className="text-center text-xs text-gray-600 mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Step {currentPhase + 1} of {phases.length} • This may take 60-90 seconds
        </motion.p>
      </div>
    </div>
  )
}
