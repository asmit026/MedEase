import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { fetchAdaptiveQuestions, submitTriageAssessment } from '../services/api';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const {
    symptoms,
    setSymptoms,
    questions,
    setQuestions,
    answers,
    setAnswers,
    updateAnswer,
    sessionId,
    setSessionId,
    setTriageResult,
    userLocation,
    requestUserLocation,
    locationStatus,
    resetAssessment
  } = useAssessment();

  const [isEditingSymptoms, setIsEditingSymptoms] = useState(!symptoms);
  const [symptomInput, setSymptomInput] = useState(symptoms);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingTriage, setSubmittingTriage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const quickSymptoms = [
    "Fever", "Dry cough", "Shortness of breath", "Chest pain",
    "Headache", "Stomach pain", "Fatigue", "Sore throat"
  ];

  const handleQuickAdd = (s) => {
    if (!symptomInput) {
      setSymptomInput(s);
    } else if (!symptomInput.toLowerCase().includes(s.toLowerCase())) {
      setSymptomInput(prev => `${prev.trim()}, ${s}`);
    }
  };

  // Default initial questions fallback if backend is offline
  const defaultQuestions = [
    {
      id: "duration",
      text: "How long have you had these symptoms?",
      category: "Personalized Follow-Up",
      type: "radio",
      options: ["Less than a day", "1–3 days", "4–7 days", "More than a week"]
    },
    {
      id: "dyspnea",
      text: "Are you experiencing difficulty breathing?",
      category: "Vital Check",
      type: "radio",
      options: ["Yes", "No", "Not sure"]
    }
  ];

  const activeQuestions = questions && questions.length > 0 ? questions : defaultQuestions;

  const handleRestartAssessment = () => {
    resetAssessment();
    setSymptomInput('');
    setIsEditingSymptoms(true);
    setErrorMsg('');
  };

  const handleSymptomSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!symptomInput.trim()) return;

    // Clear previous answers and results when starting/updating symptoms
    setAnswers({});
    setTriageResult(null);
    setSymptoms(symptomInput.trim());
    setIsEditingSymptoms(false);
    setLoadingQuestions(true);
    setErrorMsg('');

    try {
      const data = await fetchAdaptiveQuestions(symptomInput.trim());
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        if (data.sessionId || data.session_id) {
          setSessionId(data.sessionId || data.session_id);
        }
      }
    } catch (err) {
      console.warn("Using local questions due to API offline/fallback:", err);
      // default questions stay active
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleContinueToResults = async () => {
    setSubmittingTriage(true);
    setErrorMsg('');

    try {
      const answersList = Object.entries(answers).map(([qid, val]) => ({
        question_id: qid,
        answer: val
      }));

      const res = await submitTriageAssessment(symptoms, answersList, sessionId, userLocation);
      setTriageResult(res);
      navigate('/results');
    } catch (err) {
      console.error("Triage submission error:", err);
      setErrorMsg("Failed to connect to triage model service. Please try again.");
    } finally {
      setSubmittingTriage(false);
    }
  };

  // Calculate completion percentage starting from 0% / Question 1
  const isShowingQuestions = Boolean(symptoms) && !isEditingSymptoms;
  const answeredCount = isShowingQuestions ? activeQuestions.filter(q => Boolean(answers[q.id])).length : 0;
  const currentQuestionNumber = Math.min(activeQuestions.length, answeredCount + 1);
  const progressPercent = isShowingQuestions && activeQuestions.length > 0
    ? Math.round((answeredCount / activeQuestions.length) * 100)
    : 0;

  return (
    <div className="w-full py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Screen Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                Triage Protocol
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                {isShowingQuestions ? 'Step 02 / Follow-up Questions' : 'Step 01 / Symptom Intake'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-on-surface tracking-tight">
              Health Assessment
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tell us what you're experiencing. We'll ask a few targeted questions to better understand your situation.
            </p>
          </div>
          {(symptoms || Object.keys(answers).length > 0) && (
            <button
              type="button"
              onClick={handleRestartAssessment}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-medium border border-outline-variant/40 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Restart Assessment</span>
            </button>
          )}
        </div>

        {/* Main Assessment Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 sm:p-8">
          {/* Step Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between font-mono text-xs text-on-surface-variant mb-2">
              <span className="uppercase font-semibold text-on-surface">
                {!isShowingQuestions
                  ? 'Step 1: Describe Your Symptoms'
                  : answeredCount === activeQuestions.length
                    ? `All ${activeQuestions.length} Questions Answered`
                    : `Question ${currentQuestionNumber} of ${activeQuestions.length}`}
              </span>
              <span className="text-primary font-semibold">{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Logged Symptom Summary Chip or Input Form */}
          {isEditingSymptoms ? (
            <form onSubmit={handleSymptomSubmit} className="mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-2 font-medium">
                Describe your current symptoms & onset:
              </label>
              <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                rows={3}
                placeholder="e.g. Persistent fever and dry cough for 3 days, mild shortness of breath..."
                className="w-full p-3 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {/* Quick Symptom Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase text-on-surface-variant font-medium mr-1">
                  Common:
                </span>
                {quickSymptoms.map((qs) => (
                  <button
                    key={qs}
                    type="button"
                    onClick={() => handleQuickAdd(qs)}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
                  >
                    + {qs}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                {symptoms && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSymptoms(false)}
                    className="text-xs px-3 py-1.5 text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loadingQuestions || !symptomInput.trim()}
                  className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors"
                >
                  {loadingQuestions
                    ? 'Analyzing Symptoms...'
                    : symptoms
                      ? 'Update & Re-calibrate Questions'
                      : 'Continue to Follow-up Questions'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 bg-surface-container-low px-4 py-3 rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                  check_circle
                </span>
                <div className="truncate">
                  <span className="font-mono text-xs uppercase text-on-surface-variant mr-1">
                    Logged:
                  </span>
                  <span className="text-sm text-on-surface font-medium">
                    “{symptoms}”
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSymptomInput(symptoms);
                  setIsEditingSymptoms(true);
                }}
                className="font-mono text-xs text-primary hover:text-primary-container uppercase font-semibold shrink-0 cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}

          {/* Conversational Clinical Form (shown after symptoms are submitted) */}
          {isShowingQuestions && (
            <div className="space-y-6">
              {activeQuestions.map((q, idx) => {
                const currentVal = answers[q.id] || '';
                const categoryName = q.category || (idx === 0 ? "Personalized Follow-Up" : "Vital Check");

                return (
                  <div key={q.id || idx} className="pt-2 border-t border-outline-variant/20 first:border-0 first:pt-0">
                    <div className="mb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant block mb-1">
                        Question {idx + 1} · {categoryName}
                      </span>
                      <h2 className="text-base sm:text-lg font-semibold text-on-surface">
                        {q.text}
                      </h2>
                    </div>

                  {q.type === 'text' ? (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      placeholder="Optional additional notes..."
                      className="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <div className={`grid gap-2.5 ${q.options?.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                      {q.options?.map((opt) => {
                        const isSelected = currentVal === opt;
                        return (
                          <label
                            key={opt}
                            onClick={() => updateAnswer(q.id, opt)}
                            className={`group relative flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-secondary-container/20 border-primary/40 shadow-xs'
                                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isSelected}
                              onChange={() => updateAnswer(q.id, opt)}
                              className="sr-only"
                            />
                            <span className={`text-sm text-on-surface ${isSelected ? 'font-medium' : 'font-normal'}`}>
                              {opt}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-transparent'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                check
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-error-container/30 text-error text-xs">
              {errorMsg}
            </div>
          )}

          {/* User Location Request Card */}
          <div className="mt-8 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[22px] mt-0.5 ${userLocation?.isDefault ? 'text-primary' : 'text-primary'}`}>
                {userLocation?.isDefault ? 'near_me' : 'my_location'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-on-surface">
                    Your Location for Hospital Navigation
                  </span>
                  {!userLocation?.isDefault && (
                    <span className="bg-primary/10 text-primary font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      GPS Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {userLocation?.isDefault
                    ? "Allow location access so our AI can prioritize accredited nearby hospitals & urgent care centers for you."
                    : `Active coordinates: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                </p>
              </div>
            </div>
            {userLocation?.isDefault && (
              <button
                type="button"
                onClick={requestUserLocation}
                disabled={locationStatus === 'loading'}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">location_searching</span>
                <span>{locationStatus === 'loading' ? 'Locating...' : 'Use My Current Location'}</span>
              </button>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => {
                resetAssessment();
                navigate('/');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low text-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Home</span>
            </button>

            {isShowingQuestions && (
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRestartAssessment}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-sm font-medium transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Restart</span>
                </button>
                <button
                  type="button"
                  onClick={handleContinueToResults}
                  disabled={submittingTriage || answeredCount < activeQuestions.length}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
                >
                  <span>{submittingTriage ? 'Running AI Model Inference...' : 'Continue to Assessment Results'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Reliability Context Sub-panel */}
        <div className="mt-6 text-center">
          <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
            Standardized clinical protocol • Non-emergency diagnostic triage • Encrypted session
          </p>
        </div>
      </div>
    </div>
  );
}
