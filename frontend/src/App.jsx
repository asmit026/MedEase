import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import {
  Navbar,
  Footer,
  HomePage,
  AssessmentPage,
  ResultsPage,
  FindHealthcarePage
} from './components';

export default function App() {
  return (
    <AssessmentProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-surface text-on-surface">
          <Navbar />
          <main className="flex-1 w-full pt-16 bg-surface">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/find-healthcare" element={<FindHealthcarePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AssessmentProvider>
  );
}
