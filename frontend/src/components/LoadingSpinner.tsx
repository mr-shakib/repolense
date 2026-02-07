/**
 * LoadingSpinner Component
 * 
 * Reusable loading indicator with optional message.
 */

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">{message}</p>
    </div>
  )
}
