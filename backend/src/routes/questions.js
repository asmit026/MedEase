import crypto from 'crypto';
import { Router } from 'express';
import { extractSymptomsFromText } from '../data/symptoms.js';

const router = Router();

router.post('/questions', (req, res) => {
  const symptomsText = (req.body?.symptoms || '').trim();
  const sessionId = `sess-${crypto.randomBytes(4).toString('hex')}`;
  const matchedSymptoms = extractSymptomsFromText(symptomsText);

  const questions = [
    {
      id: 'duration',
      text: 'How long have you had these symptoms?',
      category: 'Personalized Follow-Up',
      type: 'radio',
      options: ['Less than a day', '1–3 days', '4–7 days', 'More than a week']
    }
  ];

  let specificAdded = 0;
  for (const sym of matchedSymptoms) {
    for (const fUp of sym.follow_ups || []) {
      questions.push({
        id: fUp.id,
        text: fUp.text,
        category: `Specific to ${sym.name}`,
        type: 'radio',
        options: fUp.options
      });
      specificAdded += 1;
      if (specificAdded >= 2) break;
    }
    if (specificAdded >= 2) break;
  }

  if (specificAdded === 0) {
    questions.push({
      id: 'dyspnea',
      text: 'Are you experiencing difficulty breathing or unusual chest sensations?',
      category: 'Vital Check',
      type: 'radio',
      options: ['Yes', 'No', 'Not sure']
    });
  }

  questions.push({
    id: 'severity_trend',
    text: 'How have your symptoms changed since they began?',
    category: 'Vital Check',
    type: 'radio',
    options: ['Gradually improving', 'Remaining about the same', 'Steadily worsening', 'Rapidly getting worse']
  });

  res.json({
    sessionId,
    symptoms: symptomsText,
    matchedCount: matchedSymptoms.length,
    matchedSymptoms: matchedSymptoms.map(s => s.name),
    questions
  });
});

export default router;
