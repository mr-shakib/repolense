import { ReportResponse } from '@/types/api'
import { motion } from 'framer-motion'

interface ScoresOverviewProps {
  report: ReportResponse
}

export function ScoresOverview({ report }: ScoresOverviewProps) {
  const scores = [
    { name: 'Overall', score: report.overall_score, color: 'indigo', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Architecture', score: report.architecture_score, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Quality', score: report.quality_score, color: 'green', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Principles', score: report.principles_score, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Collaboration', score: report.collaboration_score, color: 'teal', gradient: 'from-teal-500 to-cyan-500' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    if (score >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-rose-500'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const CircularProgress = ({ score, gradient, size = 80 }: { score: number; gradient: string; size?: number }) => {
    const circumference = 2 * Math.PI * (size / 2 - 8)
    const offset = circumference - (score / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            stroke={`url(#gradient-${gradient})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
          <defs>
            <linearGradient id={`gradient-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient.includes('green') ? '#22c55e' : gradient.includes('yellow') ? '#eab308' : gradient.includes('orange') ? '#f97316' : gradient.includes('red') ? '#ef4444' : gradient.includes('blue') ? '#3b82f6' : gradient.includes('purple') ? '#a855f7' : gradient.includes('teal') ? '#14b8a6' : '#6366f1'} />
              <stop offset="100%" stopColor={gradient.includes('emerald') ? '#10b981' : gradient.includes('orange') ? '#fb923c' : gradient.includes('rose') ? '#f43f5e' : gradient.includes('cyan') ? '#06b6d4' : gradient.includes('pink') ? '#ec4899' : '#8b5cf6'} />
            </linearGradient>
          </defs>
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
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-shadow duration-300 overflow-hidden"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl pointer-events-none"
      />
      
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 relative z-10"
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
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full text-sm font-medium text-gray-700 border border-yellow-200/50"
          >
            ⭐ {report.repository?.stars || 0}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full text-sm font-medium text-gray-700 border border-blue-200/50"
          >
            🔱 {report.repository?.forks || 0}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full text-sm font-bold text-purple-700 border border-purple-200/50"
          >
            {report.repository?.primary_language || 'Unknown'}
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center justify-center mb-8 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100/50 relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"
        />
        <CircularProgress 
          score={report.overall_score} 
          gradient={getScoreGradient(report.overall_score)}
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
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/50 to-white/50 hover:from-gray-50 hover:to-white rounded-2xl border border-gray-100/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex items-center gap-4 flex-1">
                <CircularProgress score={item.score} gradient={item.gradient} size={60} />
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                  <motion.p
                    className={`text-sm font-semibold ${getScoreColor(item.score)}`}
                  >
                    {item.score >= 80 ? '🏆 Excellent' : item.score >= 60 ? '✨ Good' : item.score >= 40 ? '⚠️ Fair' : '🔴 Needs Work'}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {report.architecture.signals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 pt-6 border-t border-gray-200/50"
        >
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            Architecture Patterns
          </h3>
          <div className="space-y-2">
            {report.architecture.signals
              .filter((signal) => signal.confidence >= 50)
              .slice(0, 3)
              .map((signal, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50 hover:border-blue-200/50 transition-all"
                >
                  <span className="text-gray-700 font-medium">{signal.pattern}</span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      signal.confidence_level === 'High Confidence'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                        : signal.confidence_level === 'Detected'
                        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
                        : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    {signal.confidence.toFixed(0)}%
                  </motion.span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
