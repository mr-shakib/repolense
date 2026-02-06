import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepoLense AI',
  description: 'Analyze GitHub repositories for architecture, quality, and engineering principles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
