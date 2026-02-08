'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

interface AnalysisPhase {
  name: string
  description: string
}

interface AnalysisAnimation3DProps {
  phases: AnalysisPhase[]
  currentPhase: number
}

// Individual Phase Node Component
function PhaseNode({ 
  position, 
  phase, 
  index, 
  currentPhase, 
  totalPhases 
}: { 
  position: [number, number, number]
  phase: AnalysisPhase
  index: number
  currentPhase: number
  totalPhases: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  const isCompleted = index < currentPhase
  const isActive = index === currentPhase
  const isPending = index > currentPhase

  // Animate the node
  useFrame((state) => {
    if (meshRef.current) {
      // Pulse animation for active node
      if (isActive) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
        meshRef.current.scale.setScalar(pulse)
      }
      
      // Gentle float for completed nodes
      if (isCompleted) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1
      }
    }
    
    // Glow effect for active node
    if (glowRef.current && isActive) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1
      glowRef.current.scale.setScalar(glowPulse * 1.5)
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      if (material && 'opacity' in material) {
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    }
  })

  // Color based on status
  const color = isCompleted 
    ? '#10b981' // green
    : isActive 
    ? '#3b82f6' // blue
    : '#9ca3af' // gray

  return (
    <group position={position}>
      {/* Main sphere */}
      <Sphere ref={meshRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : isCompleted ? 0.3 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Glow effect for active node */}
      {isActive && (
        <Sphere ref={glowRef} args={[0.4, 32, 32]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.3}
          />
        </Sphere>
      )}
      
      {/* Inner sphere for completed nodes - creates checkmark effect */}
      {isCompleted && (
        <Sphere args={[0.15, 16, 16]}>
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </Sphere>
      )}
      
      {/* Rings for pending nodes */}
      {isPending && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.03, 16, 32]} />
            <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>
        </>
      )}
    </group>
  )
}

// Connection Line Component
function ConnectionLine({ 
  start, 
  end, 
  isActive 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  isActive: boolean
}) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end])

  return (
    <Line
      points={points}
      color={isActive ? '#3b82f6' : '#e5e7eb'}
      lineWidth={isActive ? 3 : 1}
      opacity={isActive ? 0.8 : 0.3}
    />
  )
}

// Particle System Component
function Particles({ currentPhase }: { currentPhase: number }) {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particlesCount = 100
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Update particle positions for flow effect
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Scene Component
function Scene({ phases, currentPhase }: AnalysisAnimation3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Calculate positions for nodes in a circular layout
  const nodePositions = useMemo(() => {
    const radius = 2
    return phases.map((_, index) => {
      const angle = (index / phases.length) * Math.PI * 2 - Math.PI / 2
      return [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ] as [number, number, number]
    })
  }, [phases.length])

  // Gentle rotation of the entire scene
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
      
      <group ref={groupRef}>
        {/* Draw connection lines */}
        {nodePositions.map((start, index) => {
          if (index < phases.length - 1) {
            const end = nodePositions[index + 1]
            return (
              <ConnectionLine
                key={`line-${index}`}
                start={start}
                end={end}
                isActive={index < currentPhase}
              />
            )
          }
          return null
        })}
        
        {/* Draw phase nodes */}
        {phases.map((phase, index) => (
          <PhaseNode
            key={phase.name}
            position={nodePositions[index]}
            phase={phase}
            index={index}
            currentPhase={currentPhase}
            totalPhases={phases.length}
          />
        ))}
      </group>
      
      <Particles currentPhase={currentPhase} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// Main Component Export
export default function AnalysisAnimation3D({ phases, currentPhase }: AnalysisAnimation3DProps) {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 5, 15]} />
        <Scene phases={phases} currentPhase={currentPhase} />
      </Canvas>
      
      {/* Phase description overlay */}
      <div className="relative -mt-20 mx-auto max-w-md text-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">
            {phases[currentPhase]?.name || 'Processing...'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {phases[currentPhase]?.description || ''}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index < currentPhase
                    ? 'w-8 bg-green-500'
                    : index === currentPhase
                    ? 'w-12 bg-blue-500'
                    : 'w-4 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
