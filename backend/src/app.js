import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { analyzeTransaction, DEFAULT_RULES } from '../../shared/risk.js';
import { parseTransaction, parseRules } from './validators.js';

export const app = express();
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.disable('x-powered-by');
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) { callback(null, !origin || allowedOrigins.includes(origin)); }, methods: ['GET','POST'], optionsSuccessStatus: 204 }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/risk', rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_,res) => res.json({ status: 'ok', service: 'FraudShield Risk API', engine: 'rules-v1', mode: 'synthetic-demo' }));
app.get('/api/risk/rules', (_,res) => res.json({ rules: DEFAULT_RULES }));
app.post('/api/risk/analyze', (req,res,next) => {
  try {
    const transaction = parseTransaction(req.body?.transaction);
    const rules = parseRules(req.body?.rules);
    res.json({ analysis: analyzeTransaction(transaction,rules), engine: 'rules-v1', disclaimer: 'Demo score; not a calibrated fraud probability' });
  } catch (error) { next(error); }
});
app.post('/api/risk/batch', (req,res,next) => {
  try {
    const list = req.body?.transactions;
    if (!Array.isArray(list) || list.length < 1 || list.length > 100) {
      throw Object.assign(new Error('Provide 1–100 transactions'), { status: 400 });
    }
    const rules = parseRules(req.body?.rules);
    const analyses = list.map(row => analyzeTransaction(parseTransaction(row),rules));
    res.json({ analyses, engine: 'rules-v1', disclaimer: 'Synthetic demo data only' });
  } catch(error) { next(error); }
});
app.use((req,res) => res.status(404).json({error: 'Not found',health: '/api/health'}));
app.use((error,req,res,next) => {
  const status = error.status || (error.type === 'entity.too.large' ? 413 : error instanceof SyntaxError ? 400 : 500);
  if (status >= 500) console.error('Unexpected API error:',error);
  res.status(status).json({error: status >= 500 ? 'Internal server error' : error.message});
});