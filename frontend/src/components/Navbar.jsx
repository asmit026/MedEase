import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAssessmentActive = currentPath === '/assessment' || currentPath === '/results';
  const isFindHealthcareActive = currentPath === '/find-healthcare';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant/50">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img
              src="/medease-logo.svg"
              alt="MedEase AI"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <Link
              to="/assessment"
              className={`text-sm transition-colors ${
                isAssessmentActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-normal'
              }`}
            >
              Assessment
            </Link>
            <Link
              to="/find-healthcare"
              className={`text-sm transition-colors ${
                isFindHealthcareActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-normal'
              }`}
            >
              Find Healthcare
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center bg-primary text-on-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-none"
          >
            Start Assessment
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
