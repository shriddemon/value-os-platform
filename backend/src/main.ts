import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { vCreditRouter } from './modules/vcredits/vcredits.routes';
import { policyRouter } from './modules/policy/policy.routes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use((req, max, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ValueOS-Core', timestamp: new Date() });
});

// API Routes
app.use('/api/v1/vcredits', vCreditRouter);
app.use('/api/v1/policy', policyRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[GlobalError]', err);
  res.status(500).json({ error: 'Internal System Error', reference: err.message });
});

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Database (SQLite)');

    app.listen(PORT, () => {
      console.log(`🚀 Value OS Core running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
