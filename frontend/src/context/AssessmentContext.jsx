import React, { createContext, useContext, useState, useEffect } from 'react';

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const [symptoms, setSymptoms] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  
  // Geolocation state for hospital navigation
  const [userLocation, setUserLocation] = useState({
    lat: 45.4215,
    lng: -75.6972,
    label: 'Ottawa / Downtown Metro',
    isDefault: true
  });
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt', 'loading', 'granted', 'denied'
  const [locationError, setLocationError] = useState('');

  // Function to request user's GPS coordinates via browser Geolocation API
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          label: 'Your Current Location (GPS)',
          isDefault: false
        });
        setLocationStatus('granted');
        setLocationError('');
      },
      (err) => {
        console.warn('Geolocation access declined or unavailable:', err.message);
        setLocationStatus('denied');
        setLocationError('Location permission denied or unavailable. Using default metropolitan center.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const resetAssessment = () => {
    setSymptoms('');
    setQuestions([]);
    setAnswers({});
    setSessionId('');
    setTriageResult(null);
    setSelectedSpecialty('');
  };

  return (
    <AssessmentContext.Provider
      value={{
        symptoms,
        setSymptoms,
        questions,
        setQuestions,
        answers,
        setAnswers,
        updateAnswer,
        sessionId,
        setSessionId,
        triageResult,
        setTriageResult,
        selectedSpecialty,
        setSelectedSpecialty,
        userLocation,
        setUserLocation,
        locationStatus,
        locationError,
        requestUserLocation,
        resetAssessment
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
