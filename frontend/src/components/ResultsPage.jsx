import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { triageResult, symptoms, setSelectedSpecialty, resetAssessment } = useAssessment();

  // If user arrives directly without assessment, provide realistic fallback matching Stitch
  const fallbackResult = {
    referenceId: "ME-84192",
    conditions: [
      {
        id: "c1",
        name: "Respiratory Infection",
        relevance: "High",
        badge: "Potential relevance: High",
        icon: "pulmonology",
        description: "Some of your symptoms can occur with respiratory infections. Pathogens typically irritate the upper airway mucosa, prompting mild immune reactivity."
      },
      {
        id: "c2",
        name: "Other Respiratory Conditions",
        relevance: "Moderate",
        badge: "Potential relevance: Moderate",
        icon: "air",
        description: "Some symptoms may also be associated with other respiratory conditions or mild bronchial sensitivities."
      }
    ],
    recommendedSpecialty: "General Medicine",
    specialtyDescription: "An initial evaluation by a general physician may help determine the next appropriate step.",
    redFlags: [
      "Severe difficulty breathing",
      "Severe chest pain",
      "Confusion or sudden dizziness",
      "Rapid worsening of symptoms"
    ],
    disclaimer: "This summary was assembled using algorithmic triage guidelines to assist your personal healthcare research. It is strictly non-diagnostic and does not supersede direct consultation with a qualified medical professional."
  };

  const result = triageResult || fallbackResult;

  useEffect(() => {
    if (result.recommendedSpecialty) {
      setSelectedSpecialty(result.recommendedSpecialty);
    }
  }, [result, setSelectedSpecialty]);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 flex flex-col gap-8">
        {/* Top Progress / Step Meta Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs font-semibold">
              3
            </span>
            <span className="font-mono text-xs tracking-wider text-on-surface-variant uppercase">
              Clinical Triage Synthesis
            </span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Summary Completed • Ref: {result.referenceId || 'ME-84192'}</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-on-surface tracking-tight">
            What your symptoms may relate to
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Based on the information you provided, these are possible health concerns to consider. This is not a medical diagnosis.
          </p>
        </div>

        {/* Section 1: Possible Health Concerns Cards */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-on-surface-variant tracking-wider">
              Observed Patterns ({result.conditions?.length || 2} Findings)
            </span>
            <span className="text-xs text-on-surface-variant">Reviewing initial responses</span>
          </div>

          {result.conditions?.map((cond, idx) => {
            const isHigh = cond.relevance === 'High';
            return (
              <div
                key={cond.id || idx}
                className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-on-surface">
                      {cond.name}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded font-mono text-[11px] uppercase tracking-wide font-medium ${
                        isHigh
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {cond.badge || `Potential relevance: ${cond.relevance}`}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant pt-1 leading-relaxed">
                    {cond.description}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/find-healthcare')}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-container font-semibold group cursor-pointer"
                    >
                      <span>Find specialized care</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-surface-container-low text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    {cond.icon || 'stethoscope'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 2: Subtle Warm Warning / Red Flags */}
        <div className="bg-error-container/20 border border-error-container/40 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-container/70 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <h3 className="text-base font-semibold text-on-surface">
              Seek urgent care if you experience:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1 text-sm text-on-surface">
              {(result.redFlags || []).map((flag, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-on-surface-variant pt-2">
              If you experience any of these red-flag indicators, seek emergency medical care immediately.
            </p>
          </div>
        </div>

        {/* Section 3: Recommended Specialty & Action */}
        <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="font-mono text-xs tracking-wider text-primary uppercase font-semibold">
              RECOMMENDED SPECIALTY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-on-surface">
              {result.recommendedSpecialty || "General Medicine"}
            </h2>
            <p className="text-sm text-on-surface-variant pt-1 leading-relaxed">
              {result.specialtyDescription || "An initial evaluation by a general physician may help determine the next appropriate step."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 flex-shrink-0">
            <Link
              to="/find-healthcare"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-primary-container transition-colors shadow-none"
            >
              <span>Find Healthcare</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center bg-surface-container text-on-surface text-xs font-medium px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-center"
            >
              Edit answers
            </Link>
            <button
              type="button"
              onClick={() => {
                resetAssessment();
                navigate('/assessment');
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-surface-container-low text-on-surface-variant text-xs font-medium px-4 py-2 rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-colors text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Restart Assessment</span>
            </button>
          </div>
        </div>

        {/* Disclaimer / Non-Diagnostic Safety Callout */}
        <div className="rounded-lg bg-surface-container-low p-4 flex items-start gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {result.disclaimer || "This summary was assembled using algorithmic triage guidelines to assist your personal healthcare research. It is strictly non-diagnostic and does not supersede direct consultation with a qualified medical professional."}
          </p>
        </div>
      </div>
    </div>
  );
}
