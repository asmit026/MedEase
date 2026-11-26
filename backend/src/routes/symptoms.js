import { Router } from 'express';
import { CLINICAL_SYMPTOMS, searchSymptomsByQuery } from '../data/symptoms.js';

const router = Router();

router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const results = searchSymptomsByQuery(q, limit);

  res.json({
    query: q,
    count: results.length,
    results: results.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      urgency: s.urgency_level || 'Low',
      model_index: s.model_index
    }))
  });
});

router.get('/popular', (req, res) => {
  const popularIds = [
    'sym_cough',
    'sym_fever',
    'sym_dyspnea',
    'sym_chest_pain',
    'sym_headache',
    'sym_fatigue',
    'sym_abdominal_pain',
    'sym_joint_pain'
  ];
  const popular = CLINICAL_SYMPTOMS.filter(s => popularIds.includes(s.id));

  res.json({
    symptoms: popular.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      model_index: s.model_index
    }))
  });
});

export default router;
