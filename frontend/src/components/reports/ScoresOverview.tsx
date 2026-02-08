import { ReportResponse } from '@/types/api'
import { motion } from 'framer-motion'

interface ScoresOverviewProps {
  report: ReportResponse
}

export function ScoresOverview({ report }: ScoresOverviewProps) {
  const scores = [
    { name: 'Overall', score: report.overall_score, color: '#6366f1' },
    { name: 'Architecture', score: report.architecture_score, color: '#3b82f6' },
    { name: 'Quality', score: report.quality_score, color: '#22c55e' },
    { name: 'Principles', score: report.principles_score, color: '#a855f7' },
    { name: 'Collaboration', score: report.collaboration_score, color: '#14b8a6' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSolidColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const CircularProgress = ({ score, color, size = 80 }: { score: number; color: string; size?: number }) => {
    const circumference = 2 * Math.PI * (size / 2 - 8)
    const offset = circumference - (score / 100) * circumference
    const scoreColor = getSolidColor(score)

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Decorative inner ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 14}
            stroke={scoreColor}
            strokeWidth="2"
            fill="none"
            opacity="0.2"
            strokeDasharray="4 4"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Main progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            stroke={scoreColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 8px ${scoreColor}40)`,
            }}
          />
          {/* Outer glow ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            stroke={scoreColor}
            strokeWidth="1"
            fill="none"
            opacity="0.3"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-xl font-bold text-gray-900"
          >
            {Math.round(score)}
          </motion.span>
        </div>
        {/* Rotating sparkle decoration for high scores */}
        {score >= 80 && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: scoreColor }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-3xl p-6 shadow-2xl overflow-hidden"
      style={{
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.9), 0 20px 40px rgba(0,0,0,0.08), 0 10px 20px rgba(59,130,246,0.05)',
        border: '2px solid rgba(226,232,240,0.8)'
      }}
    >
      {/* Animated geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="score-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="2" fill="#3b82f6" />
            <rect x="0" y="0" width="1" height="60" fill="#8b5cf6" />
            <rect x="0" y="0" width="60" height="1" fill="#8b5cf6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#score-pattern)" />
        </svg>
      </div>

      {/* Floating animated shape */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [10, -10, 10],
          x: [5, -5, 5],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-12 -left-12 w-28 h-28 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />
      
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black text-gray-900 mb-2 relative z-10"
        style={{
          textShadow: '2px 2px 0 rgba(59,130,246,0.08), 3px 3px 0 rgba(139,92,246,0.04)',
        }}
      >
        Analysis Scores
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 relative z-10"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-1">{report.repository?.name || 'Unknown Repository'}</h3>
        <p className="text-sm text-gray-600">by {report.repository?.owner || 'Unknown'}</p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <motion.span 
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 rounded-full text-sm font-medium text-gray-700 border-2 border-yellow-200"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 8px rgba(234,179,8,0.15)'
            }}
          >
            ⭐ {report.repository?.stars || 0}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium text-gray-700 border-2 border-blue-200"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 8px rgba(59,130,246,0.15)'
            }}
          >
            🔱 {report.repository?.forks || 0}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center px-3 py-1.5 bg-purple-50 rounded-full text-sm font-bold text-purple-700 border-2 border-purple-200"
            style={{
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 8px rgba(168,85,247,0.15)'
            }}
          >
            {report.repository?.primary_language || 'Unknown'}
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center justify-center mb-8 p-6 bg-blue-50/30 rounded-2xl relative overflow-hidden"
        style={{
          border: '2px solid rgba(191,219,254,0.5)',
          boxShadow: 'inset 0 2px 8px rgba(59,130,246,0.03), 0 4px 12px rgba(59,130,246,0.05)'
        }}
      >
        {/* Rotating decorative squares */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 right-4 w-8 h-8 border-2 border-blue-300/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-4 left-4 w-6 h-6 border-2 border-purple-300/30"
          style={{ borderRadius: '30%' }}
        />
        <CircularProgress 
          score={report.overall_score} 
          color={getSolidColor(report.overall_score)}
          size={120}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm font-bold text-gray-600 mt-4 uppercase tracking-wider"
        >
          Overall Score
        </motion.p>
      </motion.div>

      <div className="space-y-4">
        {scores.slice(1).map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ x: 4, scale: 1.02 }}
            className="group"
          >
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-2xl transition-all duration-300"
              style={{
                border: '2px solid rgba(226,232,240,0.6)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                <CircularProgress score={item.score} color={item.color} size={60} />
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                  <motion.p
                    className={`text-sm font-semibold ${getScoreColor(item.score)}`}
                  >
                    {item.score >= 80 ? '🏆 Excellent' : item.score >= 60 ? '✨ Good' : item.score >= 40 ? '⚠️ Fair' : '🔴 Needs Work'}
                  </motion.p>
                </div>
              </div>
              {/* Decorative corner accent */}
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color, opacity: 0.4 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {report.architecture.signals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 pt-6 border-t-2 border-gray-200/50"
        >
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            Architecture Patterns
          </h3>
          <div className="space-y-2">
            {report.architecture.signals
              .filter((signal) => signal.confidence >= 50)
              .slice(0, 3)
              .map((signal, idx) => {
                const confidenceColor = 
                  signal.confidence_level === 'High Confidence' ? '#22c55e' :
                  signal.confidence_level === 'Detected' ? '#3b82f6' : '#eab308'
                
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl transition-all"
                    style={{
                      border: '2px solid rgba(191,219,254,0.4)',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 6px rgba(59,130,246,0.05)'
                    }}
                  >
                    <span className="text-gray-700 font-medium">{signal.pattern}</span>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: signal.confidence_level === 'High Confidence' ? '#dcfce7' :
                                       signal.confidence_level === 'Detected' ? '#dbeafe' : '#fef3c7',
                        color: signal.confidence_level === 'High Confidence' ? '#15803d' :
                               signal.confidence_level === 'Detected' ? '#1e40af' : '#a16207',
                        border: `2px solid ${confidenceColor}`,
                        boxShadow: `0 2px 8px ${confidenceColor}20`
                      }}
                    >
                      {signal.confidence.toFixed(0)}%
                    </motion.span>
                  </motion.div>
                )
              })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
