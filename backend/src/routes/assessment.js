import crypto from 'crypto';
import axios from 'axios';
import { Router } from 'express';
import { extractSymptomsFromText } from '../data/symptoms.js';
import { findNearbyFacilities } from '../data/facilities.js';

const router = Router();
const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || 'http://127.0.0.1:8000';

router.post('/assess', async (req, res) => {
  try {
    const symptomsText = (req.body?.symptoms || '').trim();
    const answers = req.body?.answers || [];
    const sessionId = req.body?.session_id || `ME-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const location = req.body?.location || null;

    const matchedSymptoms = extractSymptomsFromText(symptomsText);
    let indices = matchedSymptoms
      .map(s => s.model_index)
      .filter(idx => idx !== undefined && idx !== null);

    if (indices.length === 0) {
      indices = [10];
    }

    // Call the FastAPI PyTorch model service (symptom_transformer.pt)
    const modelResponse = await axios.post(`${MODEL_SERVICE_URL}/predict`, {
      symptom_indices: indices,
      top_k: 3
    });

    const prediction = modelResponse.data;

    // Evaluate clinical red flags from follow-up answers
    const answersDict = {};
    for (const item of answers) {
      if (item?.question_id) {
        answersDict[item.question_id] = item.answer || '';
      }
    }

    const redFlags = [];
    if (answersDict.dyspnea === 'Yes' || symptomsText.toLowerCase().includes('severe')) {
      redFlags.push('Significant difficulty breathing or sudden respiratory distress');
    }
    if (
      Object.values(answersDict).some(v => String(v).toLowerCase().includes('radiates')) ||
      symptomsText.toLowerCase().includes('chest pain')
    ) {
      redFlags.push('Pressure or tightness radiating to arm, neck, or jaw');
    }
    if (answersDict.severity_trend === 'Rapidly getting worse') {
      redFlags.push('Rapid acute escalation of symptom severity');
    }

    if (redFlags.length === 0) {
      redFlags.push(
        'Severe difficulty breathing or blue-tinted lips',
        'Crushing chest pressure or sudden radiating chest pain',
        'Sudden confusion, slurred speech, or facial drooping',
        'Persistent high fever unyielding to antipyretics'
      );
    }

    const userLat = location?.lat ?? null;
    const userLng = location?.lng ?? null;
    const recommendedSpecialty = prediction.recommendedSpecialty || 'General Physician';

    const nearbyFacilities = await findNearbyFacilities({
      userLat,
      userLng,
      specialty: recommendedSpecialty
    });

    res.json({
      referenceId: sessionId,
      symptoms: symptomsText,
      matchedSymptoms: matchedSymptoms.map(s => s.name),
      conditions: prediction.conditions,
      recommendedSpecialty,
      specialtyDescription: prediction.specialtyDescription,
      allSpecialties: prediction.allSpecialties || [],
      redFlags: redFlags.slice(0, 4),
      recommendedFacilities: nearbyFacilities.slice(0, 4),
      disclaimer:
        'This summary was assembled using the MedEase PyTorch Transformer triage model to assist your personal healthcare research. It is strictly non-diagnostic and does not supersede direct consultation with a qualified medical professional.'
    });
  } catch (error) {
    console.error('Error during assessment / model service call:', error.message);
    res.status(502).json({
      error: 'Failed to run triage inference on PyTorch model service',
      details: error.message
    });
  }
});

export default router;
