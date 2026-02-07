import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RepoLense AI - AI-Powered GitHub Repository Analysis',
  description: 'Deep insights on architecture patterns, code quality, engineering principles, and team collaboration. Deterministic-first, AI-assisted analysis for serious engineering teams.',
  keywords: 'GitHub analysis, code quality, architecture patterns, engineering principles, AI code review',
  authors: [{ name: 'RepoLense AI' }],
  openGraph: {
    title: 'RepoLense AI - AI-Powered GitHub Repository Analysis',
    description: 'Deep insights on architecture patterns, code quality, engineering principles, and team collaboration.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
