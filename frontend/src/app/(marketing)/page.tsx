import {
  Header,
  Hero,
  ProblemStatement,
  HowItWorks,
  WhatItAnalyzes,
  TrustPhilosophy,
  SampleInsight,
  FinalCTA,
  Footer
} from '@/components/landing';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-0">
        <Hero />
        <ProblemStatement />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="what-we-analyze">
          <WhatItAnalyzes />
        </div>
        <TrustPhilosophy />
        <SampleInsight />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}


