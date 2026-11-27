import express from 'express';
import cors from 'cors';
import axios from 'axios';
import symptomsRouter from './routes/symptoms.js';
import questionsRouter from './routes/questions.js';
import assessmentRouter from './routes/assessment.js';
import facilitiesRouter from './routes/facilities.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Mount Express API routes
app.use('/api/symptoms', symptomsRouter);
app.use('/api', questionsRouter);
app.use('/api', assessmentRouter);
app.use('/api/facilities', facilitiesRouter);

app.get('/api/health', async (req, res) => {
  let modelHealth = { model_loaded: false, num_conditions: 0 };
  try {
    const resp = await axios.get(`${MODEL_SERVICE_URL}/health`, { timeout: 2000 });
    modelHealth = resp.data;
  } catch (err) {
    modelHealth.error = err.message;
  }

  res.json({
    status: 'healthy',
    service: 'MedEase Express.js Backend',
    model_service_url: MODEL_SERVICE_URL,
    ...modelHealth
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`MedEase Express.js backend running at http://127.0.0.1:${PORT}`);
  console.log(`Connected to FastAPI PyTorch model service at ${MODEL_SERVICE_URL}`);
});
