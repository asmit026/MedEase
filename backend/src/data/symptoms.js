export const CLINICAL_SYMPTOMS = [
  {
    id: 'sym_cough',
    name: 'Cough',
    synonyms: ['coughing', 'dry cough', 'wet cough', 'hacking cough', 'persistent cough'],
    category: 'Respiratory',
    model_index: 949,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'cough_type',
        text: 'Is your cough dry, or are you coughing up phlegm or mucus?',
        options: ['Dry and hacking', 'Productive with clear mucus', 'Productive with yellow/green phlegm', 'Blood-tinged']
      }
    ]
  },
  {
    id: 'sym_dyspnea',
    name: 'Shortness of breath (Dyspnea)',
    synonyms: ['difficulty breathing', 'shortness of breath', 'breathless', 'hard to breathe', 'winded', 'dyspnea', 'wheezing'],
    category: 'Respiratory',
    model_index: 692,
    urgency_level: 'High',
    red_flag: true,
    follow_ups: [
      {
        id: 'dyspnea_rest',
        text: 'Does the shortness of breath occur even while resting or lying flat?',
        options: ['Yes, at complete rest', 'Only with exertion / walking', 'Only when lying flat', 'No']
      }
    ]
  },
  {
    id: 'sym_sore_throat',
    name: 'Sore throat',
    synonyms: ['throat pain', 'scratchy throat', 'pain swallowing', 'pharyngitis', 'throat irritation'],
    category: 'Respiratory',
    model_index: 2229,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: [
      {
        id: 'throat_swallowing',
        text: 'Are you able to swallow liquids and saliva without severe pain?',
        options: ['Yes, normal swallowing', 'Painful but manageable', 'Cannot swallow liquids']
      }
    ]
  },
  {
    id: 'sym_congestion',
    name: 'Nasal congestion & runny nose',
    synonyms: ['stuffy nose', 'runny nose', 'blocked nose', 'rhinorrhea', 'nasal blockage', 'sneezing', 'sinus pressure'],
    category: 'Respiratory',
    model_index: 1564,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: []
  },
  {
    id: 'sym_fever',
    name: 'Fever & Chills',
    synonyms: ['fever', 'high temperature', 'chills', 'feverish', 'shivering', 'sweats', 'hot flashes'],
    category: 'Systemic',
    model_index: 2123,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'fever_temp',
        text: 'Have you measured your body temperature?',
        options: ['Below 38°C (100.4°F)', '38°C – 39°C (100.4°F – 102.2°F)', 'Above 39°C (102.2°F)', "Haven't measured"]
      }
    ]
  },
  {
    id: 'sym_fatigue',
    name: 'Fatigue & Weakness',
    synonyms: ['fatigue', 'exhaustion', 'tiredness', 'lethargy', 'weakness', 'low energy', 'feeling drained'],
    category: 'Systemic',
    model_index: 2104,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: []
  },
  {
    id: 'sym_chest_pain',
    name: 'Chest pain or tightness',
    synonyms: ['chest pain', 'chest tightness', 'chest pressure', 'heavy chest', 'angina', 'pain in ribs', 'cardiac pain'],
    category: 'Cardiovascular',
    model_index: 216,
    urgency_level: 'High',
    red_flag: true,
    follow_ups: [
      {
        id: 'chest_pain_radiate',
        text: 'Does the chest sensation radiate to your left arm, jaw, neck, or back?',
        options: ['Yes, radiates to arm/jaw', 'No, localized to one spot', 'Sharp and worsens when breathing in', 'Mild ache']
      }
    ]
  },
  {
    id: 'sym_palpitations',
    name: 'Heart palpitations',
    synonyms: ['palpitations', 'racing heart', 'rapid heartbeat', 'fluttering in chest', 'skipped heartbeat', 'tachycardia'],
    category: 'Cardiovascular',
    model_index: 1750,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'palpitations_dizzy',
        text: 'Are palpitations accompanied by lightheadedness, chest pain, or shortness of breath?',
        options: ['Yes, feeling dizzy/faint', 'Accompanied by mild anxiety', 'No other symptoms']
      }
    ]
  },
  {
    id: 'sym_headache',
    name: 'Headache & Migraine',
    synonyms: ['headache', 'migraine', 'head throbbing', 'head pain', 'temple pain', 'tension headache'],
    category: 'Neurological',
    model_index: 479,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'headache_onset',
        text: "Did the headache begin suddenly like a 'thunderclap' (sudden explosive pain), or build up gradually?",
        options: ['Sudden explosive onset (seconds)', 'Gradual onset over hours/days', 'Recurring throbbing migraine', 'Dull constant ache']
      }
    ]
  },
  {
    id: 'sym_dizziness',
    name: 'Dizziness & Vertigo',
    synonyms: ['dizziness', 'dizzy', 'vertigo', 'spinning sensation', 'lightheaded', 'unsteady', 'loss of balance'],
    category: 'Neurological',
    model_index: 2128,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'vertigo_spinning',
        text: 'Does the room feel like it is actively spinning around you (vertigo)?',
        options: ['Yes, room spinning sensation', 'Lightheadedness upon standing up', 'General wooziness', 'No']
      }
    ]
  },
  {
    id: 'sym_abdominal_pain',
    name: 'Abdominal pain',
    synonyms: ['stomach pain', 'abdominal pain', 'belly ache', 'stomach cramps', 'gut pain', 'abdominal cramps'],
    category: 'Gastrointestinal',
    model_index: 1115,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'ab_pain_location',
        text: 'Where is the stomach pain primarily focused?',
        options: ['Lower right side', 'Upper center / under ribs', 'Lower abdomen / cramps', 'Generalized all over belly']
      }
    ]
  },
  {
    id: 'sym_nausea',
    name: 'Nausea & Vomiting',
    synonyms: ['nausea', 'vomiting', 'throwing up', 'queasy', 'sick to stomach', 'emesis'],
    category: 'Gastrointestinal',
    model_index: 2030,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: [
      {
        id: 'vomiting_fluids',
        text: 'Are you able to keep liquids or hydration down?',
        options: ['Yes, keeping fluids down', 'Vomiting repeatedly, cannot keep water down', 'Blood present in vomit']
      }
    ]
  },
  {
    id: 'sym_diarrhea',
    name: 'Diarrhea',
    synonyms: ['diarrhea', 'loose stools', 'watery stools', 'frequent bowel movements', 'upset stomach'],
    category: 'Gastrointestinal',
    model_index: 169,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: []
  },
  {
    id: 'sym_joint_pain',
    name: 'Joint pain & swelling',
    synonyms: ['joint pain', 'swollen joints', 'knee pain', 'hip pain', 'arthritis', 'stiff joints', 'joint ache'],
    category: 'Musculoskeletal',
    model_index: 214,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: [
      {
        id: 'joint_redness',
        text: 'Are the affected joints visibly red, warm, or swollen?',
        options: ['Yes, visibly swollen and hot', 'Achy and stiff without visible swelling', 'Mild morning stiffness']
      }
    ]
  },
  {
    id: 'sym_back_pain',
    name: 'Back pain',
    synonyms: ['back pain', 'lower back pain', 'spine pain', 'lumbago', 'sciatica', 'lumbar ache'],
    category: 'Musculoskeletal',
    model_index: 1423,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: [
      {
        id: 'back_numbness',
        text: 'Do you experience numbness in your legs or any loss of bladder control?',
        options: ['Yes, numbness or loss of control (Seek Emergency)', 'Shooting pain down leg', 'Localized back muscle ache']
      }
    ]
  },
  {
    id: 'sym_rash',
    name: 'Skin rash or irritation',
    synonyms: ['rash', 'skin redness', 'hives', 'itchy skin', 'pruritus', 'skin lesion', 'spots on skin', 'welts'],
    category: 'Dermatological',
    model_index: 481,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: [
      {
        id: 'rash_spreading',
        text: 'Is the rash spreading rapidly, blistering, or accompanied by facial swelling?',
        options: ['Yes, rapidly spreading / blistering', 'Mild localized redness/itch', 'Dry flaking skin']
      }
    ]
  },
  {
    id: 'sym_ear_pain',
    name: 'Ear pain or discharge',
    synonyms: ['ear pain', 'earache', 'clogged ear', 'ringing in ear', 'tinnitus', 'ear discharge'],
    category: 'ENT',
    model_index: 694,
    urgency_level: 'Low',
    red_flag: false,
    follow_ups: []
  },
  {
    id: 'sym_eye_irritation',
    name: 'Eye redness or pain',
    synonyms: ['eye redness', 'conjunctivitis', 'pink eye', 'eye pain', 'blurred vision', 'watery eyes'],
    category: 'Ophthalmology',
    model_index: 804,
    urgency_level: 'Moderate',
    red_flag: false,
    follow_ups: []
  }
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function searchSymptomsByQuery(query = '', limit = 10) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return CLINICAL_SYMPTOMS.slice(0, limit);

  const matches = [];
  for (const sym of CLINICAL_SYMPTOMS) {
    let score = 0;
    if (q === sym.name.toLowerCase()) {
      score = 100;
    } else if (sym.name.toLowerCase().includes(q)) {
      score = 50;
    } else if (sym.synonyms.some(syn => syn.toLowerCase().includes(q))) {
      score = 40;
    } else if (q.split(/\s+/).some(word => word && sym.name.toLowerCase().includes(word))) {
      score = 20;
    }

    if (score > 0) {
      matches.push({ score, sym });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit).map(m => m.sym);
}

export function extractSymptomsFromText(text = '') {
  const cleaned = (text || '').toLowerCase();
  const found = [];
  const seenIds = new Set();

  for (const sym of CLINICAL_SYMPTOMS) {
    const terms = [sym.name.toLowerCase(), ...sym.synonyms.map(s => s.toLowerCase())];
    const matched = terms.some(term => {
      const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
      return regex.test(cleaned);
    });

    if (matched && !seenIds.has(sym.id)) {
      found.push(sym);
      seenIds.add(sym.id);
    }
  }

  if (found.length === 0) {
    found.push(CLINICAL_SYMPTOMS[0]);
  }

  return found;
}
