import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Minimal Ambient Glow Background Layer */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[540px] h-[540px] bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-96 left-12 w-[420px] h-[420px] bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 1. HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-20 md:pt-28 md:pb-32 flex flex-col items-center text-center">
          {/* Clinical Provenance Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px] tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Clinical Intelligence V2.4 · Calibrated Guidance</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] md:leading-[64px] tracking-tight text-on-surface max-w-4xl mx-auto font-semibold">
            Understand your symptoms.<br className="hidden sm:inline" />{" "}
            <span className="text-primary font-normal">Find the right care.</span>
          </h1>

          {/* Supporting Body Text */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Answer a few guided questions, explore possible health concerns, and find relevant healthcare facilities near you.
          </p>

          {/* Action Cluster */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/assessment"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-primary text-on-primary text-base font-medium px-6 py-3.5 rounded-lg shadow-sm hover:bg-primary-container transition-all duration-200"
            >
              <span>Start Health Assessment</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <Link
              to="/find-healthcare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface text-base font-medium px-6 py-3.5 rounded-lg shadow-sm hover:bg-surface-container-low transition-colors duration-150 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                location_on
              </span>
              <span>Find Healthcare</span>
            </Link>
          </div>

          {/* Clinical Safety Subtext */}
          <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant font-mono text-xs opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span>AI-assisted guidance · Not a medical diagnosis</span>
          </div>
        </section>

        {/* 2. SYSTEM ARCHITECTURE / PROCESS SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary font-semibold">01</span>
              <span className="w-8 h-[1px] bg-outline-variant" />
              <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                Patient Navigation Sequence
              </span>
            </div>
            <span className="hidden md:inline font-mono text-xs text-on-surface-variant/70">
              5-Stage Triage Pathway
            </span>
          </div>

          {/* Horizontal Flow Diagram */}
          <div className="relative w-full">
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] -translate-y-1/2 bg-surface-container-highest -z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs text-primary font-semibold">
                    01
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    clinical_notes
                  </span>
                </div>
                <h2 className="text-base font-semibold text-on-surface mb-1">Symptoms</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Record primary sensations, onset, and severity parameters.
                </p>
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant/80 font-mono text-[10px] uppercase">
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  <span>Intake Form</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs text-primary font-semibold">
                    02
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    help_center
                  </span>
                </div>
                <h2 className="text-base font-semibold text-on-surface mb-1">Questions</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Adaptive, clinical follow-ups narrowing diagnostic focus.
                </p>
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant/80 font-mono text-[10px] uppercase">
                  <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                  <span>Adaptive Tree</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs text-primary font-semibold">
                    03
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    analytics
                  </span>
                </div>
                <h2 className="text-base font-semibold text-on-surface mb-1">Possible Concerns</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Differential possibilities with evidence-backed rationales.
                </p>
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant/80 font-mono text-[10px] uppercase">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Clinical Odds</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs text-primary font-semibold">
                    04
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    stethoscope
                  </span>
                </div>
                <h2 className="text-base font-semibold text-on-surface mb-1">Specialty</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Identification of precise medical disciplines required.
                </p>
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-on-surface-variant/80 font-mono text-[10px] uppercase">
                  <span className="material-symbols-outlined text-[14px]">local_hospital</span>
                  <span>Triaged Focus</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary-fixed-dim/40 flex items-center justify-center font-mono text-xs text-on-primary-fixed-variant font-semibold">
                    05
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    near_me
                  </span>
                </div>
                <h2 className="text-base font-semibold text-on-surface mb-1">Healthcare</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Direct routing to accredited local clinics and urgent care.
                </p>
                <div className="mt-4 pt-3 flex items-center gap-1.5 text-primary font-mono text-[10px] uppercase font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Final Route</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DIFFERENTIATOR SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-24">
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden border border-outline-variant/30">
            {/* Clinical Hairline Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant tracking-wider uppercase mb-3">
                  <span className="material-symbols-outlined text-[14px] text-primary">schema</span>
                  <span>Methodology & Philosophy</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-on-surface">
                  More than a symptom checker.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Instead of giving you a direct AI diagnosis, MedEase asks relevant follow-up questions, helps you understand possible health concerns, and guides you toward appropriate healthcare.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 items-center pt-2">
                  <div className="flex items-center gap-2 text-on-surface text-xs sm:text-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span>Calibrated against NHS & CDC frameworks</span>
                  </div>
                  <span className="hidden sm:inline text-outline-variant font-mono">·</span>
                  <div className="flex items-center gap-2 text-on-surface text-xs sm:text-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                    <span>Zero identifiable health log storage</span>
                  </div>
                </div>
              </div>

              {/* Metric Indicator Gauge */}
              <div className="flex-shrink-0 self-center md:self-start bg-surface-container-low p-4 rounded-xl text-center w-full md:w-44 flex flex-col items-center">
                <div className="w-16 h-16 relative flex items-center justify-center mb-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-surface-variant" cx="18" cy="18" fill="none" r="15.9155" stroke="currentColor" strokeWidth="2.5" />
                    <circle className="text-primary" cx="18" cy="18" fill="none" r="15.9155" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="2.5" />
                  </svg>
                  <span className="material-symbols-outlined absolute text-primary text-[22px]">health_and_safety</span>
                </div>
                <span className="font-mono text-xl font-semibold text-on-surface">94.8%</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Triage Accuracy
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
