/**
 * Report Page
 * 
 * Dynamic route for displaying analysis reports.
 * Fetches and displays report data for a given analysis ID.
 */

import { Suspense } from 'react'
import ReportDisplay from '@/components/ReportDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'

interface PageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<LoadingSpinner message="Loading report..." />}>
          <ReportDisplay analysisId={params.id} />
        </Suspense>
      </div>
    </main>
  )
}
