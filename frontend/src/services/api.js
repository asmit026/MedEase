import axios from 'axios';

const API_BASE = '/api';

/**
 * Fetch dynamic follow-up questions from the clinical backend
 */
export async function fetchAdaptiveQuestions(symptomsText) {
  try {
    const res = await axios.post(`${API_BASE}/questions`, {
      symptoms: symptomsText
    });
    return res.data;
  } catch (error) {
    console.error('API error in fetchAdaptiveQuestions:', error);
    throw error;
  }
}

/**
 * Submit assessment to the PyTorch Transformer triage model
 */
export async function submitTriageAssessment(symptomsText, answersList, sessionId, location) {
  try {
    const payload = {
      symptoms: symptomsText,
      answers: answersList,
      session_id: sessionId
    };

    if (location && (location.lat || location.lng)) {
      payload.location = {
        lat: location.lat,
        lng: location.lng,
        address: location.label || ''
      };
    }

    const res = await axios.post(`${API_BASE}/assess`, payload);
    return res.data;
  } catch (error) {
    console.error('API error in submitTriageAssessment:', error);
    throw error;
  }
}

/**
 * Fetch hospitals and healthcare facilities with real geolocation distance
 */
export async function fetchNearbyFacilities({ search = '', specialty = '', lat = null, lng = null } = {}) {
  try {
    const params = {};
    if (search) params.search = search;
    if (specialty) params.specialty = specialty;
    if (lat !== null && lat !== undefined) params.lat = lat;
    if (lng !== null && lng !== undefined) params.lng = lng;

    const res = await axios.get(`${API_BASE}/facilities`, { params });
    return res.data;
  } catch (error) {
    console.error('API error in fetchNearbyFacilities:', error);
    throw error;
  }
}

/**
 * Autocomplete / fuzzy search for symptoms
 */
export async function searchSymptoms(query) {
  try {
    const res = await axios.get(`${API_BASE}/symptoms/search`, {
      params: { q: query, limit: 10 }
    });
    return res.data;
  } catch (error) {
    console.error('API error in searchSymptoms:', error);
    return { results: [] };
  }
}

/**
 * Fetch popular quick symptom chips
 */
export async function fetchPopularSymptoms() {
  try {
    const res = await axios.get(`${API_BASE}/symptoms/popular`);
    return res.data;
  } catch (error) {
    console.error('API error in fetchPopularSymptoms:', error);
    return { symptoms: [] };
  }
}
