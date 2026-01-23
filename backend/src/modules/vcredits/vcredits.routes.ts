import { Router } from 'express';
import { VCreditService } from './vcredits.service';
import { prisma } from '../../shared/prisma.service';

const router = Router();
const service = new VCreditService();

// Create Definition
router.post('/definitions', async (req, res) => {
  try {
    const result = await service.createDefinition(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// List Definitions (Missing Endpoint Fix)
router.get('/definitions', async (req, res) => {
  try {
    const defs = await prisma.vCreditDefinition.findMany();
    res.json(defs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mint Credits
router.post('/mint', async (req, res) => {
  try {
    const result = await service.mint(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/exchange', async (req, res, next) => {
  try {
    const { walletId, amount, fromCreditDefId } = req.body;
    const result = await service.exchange(walletId, Number(amount), fromCreditDefId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get Wallet Balance
router.get('/wallets/:id/balances', async (req, res) => {
  try {
    const result = await service.getBalance(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Dashboard Stats (Aggregated)
router.get('/stats', async (req, res) => {
  try {
    const stats = await service.getSystemStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/issuers/:id/stats', async (req, res, next) => {
  try {
    const stats = await service.getIssuerStats(req.params.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/brands/:id/stats', async (req, res, next) => {
  try {
    const stats = await service.getBrandStats(req.params.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/wallets/:id/stats', async (req, res, next) => {
  try {
    const stats = await service.getUserWalletStats(req.params.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/demo/ids', async (req, res, next) => {
  try {
    const ids = await service.getDemoIds();
    res.json(ids);
  } catch (error) {
    next(error);
  }
});

// --- New Endpoints for Full Dashboard ---

// List Issuers (Brands)
router.get('/issuers', async (req, res) => {
  try {
    const issuers = await prisma.issuer.findMany({
      include: { creditDefs: true }
    }); // Mocking "include" if relation name differs, but standard findMany is safe
    res.json(issuers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Register New Issuer
router.post('/issuers', async (req, res) => {
  try {
    const issuer = await prisma.issuer.create({
      data: {
        name: req.body.name,
        slug: req.body.slug,
        apiKey: 'sk_' + Math.random().toString(36).substring(7)
      }
    });
    res.json(issuer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// List Transactions
router.get('/transactions', async (req, res) => {
  try {
    const txs = await prisma.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { ledgerEntries: true }
    });
    res.json(txs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const vCreditRouter = router;
