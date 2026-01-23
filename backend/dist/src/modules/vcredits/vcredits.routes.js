"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vCreditRouter = void 0;
const express_1 = require("express");
const vcredits_service_1 = require("./vcredits.service");
const prisma_service_1 = require("../../shared/prisma.service");
const router = (0, express_1.Router)();
const service = new vcredits_service_1.VCreditService();
router.post('/definitions', async (req, res) => {
    try {
        const result = await service.createDefinition(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/definitions', async (req, res) => {
    try {
        const defs = await prisma_service_1.prisma.vCreditDefinition.findMany();
        res.json(defs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/mint', async (req, res) => {
    try {
        const result = await service.mint(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/exchange', async (req, res, next) => {
    try {
        const { walletId, amount, fromCreditDefId } = req.body;
        const result = await service.exchange(walletId, Number(amount), fromCreditDefId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/wallets/:id/balances', async (req, res) => {
    try {
        const result = await service.getBalance(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const stats = await service.getSystemStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/issuers/:id/stats', async (req, res, next) => {
    try {
        const stats = await service.getIssuerStats(req.params.id);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
router.get('/brands/:id/stats', async (req, res, next) => {
    try {
        const stats = await service.getBrandStats(req.params.id);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
router.get('/wallets/:id/stats', async (req, res, next) => {
    try {
        const stats = await service.getUserWalletStats(req.params.id);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
router.get('/demo/ids', async (req, res, next) => {
    try {
        const ids = await service.getDemoIds();
        res.json(ids);
    }
    catch (error) {
        next(error);
    }
});
router.get('/issuers', async (req, res) => {
    try {
        const issuers = await prisma_service_1.prisma.issuer.findMany({
            include: { creditDefs: true }
        });
        res.json(issuers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/issuers', async (req, res) => {
    try {
        const issuer = await prisma_service_1.prisma.issuer.create({
            data: {
                name: req.body.name,
                slug: req.body.slug,
                apiKey: 'sk_' + Math.random().toString(36).substring(7)
            }
        });
        res.json(issuer);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/transactions', async (req, res) => {
    try {
        const txs = await prisma_service_1.prisma.transaction.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { ledgerEntries: true }
        });
        res.json(txs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.vCreditRouter = router;
//# sourceMappingURL=vcredits.routes.js.map