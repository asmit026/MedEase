import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-on-surface">MedEase AI</span>
          <span className="text-outline-variant">·</span>
          <span className="font-mono text-[11px] tracking-normal text-on-surface-variant uppercase">
            AI-assisted guidance · Not a medical diagnosis
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-on-surface transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-on-surface transition-colors">Terms</Link>
          <span className="text-outline-variant">·</span>
        </div>
      </div>
    </footer>
  );
}
