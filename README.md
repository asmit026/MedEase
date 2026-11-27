# MedEase AI — Clinical Health Assistant & Hospital Navigation

MedEase AI is an AI-powered clinical triage and hospital navigation application designed to help patients understand their symptoms, explore differential health risks, and navigate directly to appropriate medical facilities.

---

## Architecture Overview

```
MedEase/
├── backend/                      # Express.js (JavaScript) Main Backend (Port 5000)
│   ├── src/
│   │   ├── server.js             # Express App with CORS & route mounting
│   │   ├── data/
│   │   │   ├── symptoms.js       # Clinical symptom vocabulary & text extractor
│   │   │   └── facilities.js     # Hospital geolocation database & Haversine distance scoring
│   │   └── routes/
│   │       ├── symptoms.js       # GET /api/symptoms/search & /api/symptoms/popular
│   │       ├── questions.js      # POST /api/questions (Adaptive follow-up triage)
│   │       ├── assessment.js     # POST /api/assess (Calls FastAPI model service + red flags + facilities)
│   │       └── facilities.js     # GET /api/facilities (Geo-distance facility ranking)
│   └── package.json
├── model-service/                # FastAPI Python Microservice (Port 8000) — PyTorch Model Only
│   ├── main.py                   # FastAPI app exposing /health and /predict
│   ├── transformer.py            # PyTorch SymptomTransformer architecture
│   ├── inference.py              # Loads symptom_transformer.pt & resolves SNOMED/specialties
│   └── requirements.txt
├── frontend/                     # React + Vite + Tailwind CSS (Port 5173)
│   ├── src/
│   │   ├── components/           # Single-folder React components
│   │   ├── context/              # AssessmentContext with browser Geolocation API integration
│   │   └── services/             # Axios API client
│   └── vite.config.js            # Reverse proxy /api -> http://127.0.0.1:5000
└── medical_ai_complete_model/    # Provided PyTorch Model & Clinical Mappings
    ├── symptom_transformer.pt    # PyTorch model weights
    ├── model_mappings.json       # Symptom & SNOMED CT condition mappings
    ├── speciality_mapping.json   # 555 conditions mapped to medical specialists
    └── snomed_conditions.json    # Human-readable resolved SNOMED clinical labels
```

---

## Quickstart

### 1. Start the FastAPI PyTorch Model Service (Port 8000)
```bash
cd model-service
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Start the Express.js Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 3. Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Access the application at: `http://127.0.0.1:5173`
