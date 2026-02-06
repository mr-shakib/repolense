/**
 * Utility functions for the frontend.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes with proper precedence.
 * 
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a readable format.
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Validates a GitHub repository URL.
 * 
 * @param url - URL to validate
 * @returns True if valid GitHub URL
 */
export function isValidGitHubUrl(url: string): boolean {
  const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
  return pattern.test(url)
}

/**
 * Extracts owner and repo name from GitHub URL.
 * 
 * @param url - GitHub repository URL
 * @returns Object with owner and repo, or null if invalid
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/)
  if (!match) return null
  
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  }
}
