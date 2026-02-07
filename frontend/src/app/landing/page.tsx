"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { TrustSection } from "@/components/landing/trust-section"
import { CTASection } from "@/components/landing/cta-section"
import { GravityProvider } from "@/components/landing/gravity-context"

export default function LandingPage() {
    return (
        <GravityProvider>
            <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
                <HeroSection />
                <TrustSection />
                <FeaturesSection />
                <CTASection />

                <footer className="py-8 border-t border-zinc-100 dark:border-zinc-900 text-center text-sm text-zinc-500">
                    <p>© {new Date().getFullYear()} RepoLens AI. Crafted with zero gravity.</p>
                </footer>
            </main>
        </GravityProvider>
    )
}
