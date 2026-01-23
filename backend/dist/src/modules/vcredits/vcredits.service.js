"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCreditService = void 0;
const prisma_service_1 = require("../../shared/prisma.service");
const ledger_service_1 = require("../ledger/ledger.service");
const policy_service_1 = require("../policy/policy.service");
const ledgerService = new ledger_service_1.LedgerService();
const policyService = new policy_service_1.PolicyService();
class VCreditService {
    async createDefinition(data) {
        return prisma_service_1.prisma.vCreditDefinition.create({
            data: {
                issuerId: data.issuerId,
                name: data.name,
                symbol: data.symbol,
                type: data.type
            }
        });
    }
    async mint(data) {
        let def = await prisma_service_1.prisma.vCreditDefinition.findUnique({ where: { id: data.creditDefId } });
        if (!def) {
            const issuer = await prisma_service_1.prisma.issuer.findUnique({ where: { id: data.issuerId } }) || await prisma_service_1.prisma.issuer.findFirst();
            if (!issuer)
                throw new Error("No Issuer found for Minting");
            def = await prisma_service_1.prisma.vCreditDefinition.create({
                data: {
                    id: data.creditDefId,
                    issuerId: issuer.id,
                    name: "Demo Asset",
                    symbol: "DMA",
                    type: 'LOYALTY_POINT'
                }
            });
        }
        return ledgerService.recordTransaction(ledger_service_1.LedgerTransactionType.MINT, [
            {
                walletId: data.targetWalletId,
                creditDefId: data.creditDefId,
                amount: data.amount,
                direction: 'CREDIT'
            }
        ], { reason: data.reason, issuerId: data.issuerId });
    }
    async redeem(data) {
        const policyResult = await policyService.evaluateTransaction({
            amount: data.amount,
            creditDefId: data.creditDefId,
            senderWalletId: data.walletId,
            context: { action: 'REDEEM', issuerId: data.issuerId }
        });
        if (!policyResult.approved) {
            throw new Error(`Policy Rejected: ${JSON.stringify(policyResult.results)}`);
        }
        return ledgerService.recordTransaction(ledger_service_1.LedgerTransactionType.BURN, [
            {
                walletId: data.walletId,
                creditDefId: data.creditDefId,
                amount: data.amount,
                direction: 'DEBIT'
            }
        ], { reason: data.reason, issuerId: data.issuerId });
    }
    async getBalance(walletId) {
        return prisma_service_1.prisma.balance.findMany({
            where: { walletId },
            include: { creditDef: true }
        });
    }
    async getSystemStats() {
        const txCount = await prisma_service_1.prisma.transaction.count();
        const mintEntries = await prisma_service_1.prisma.ledgerEntry.findMany({
            where: { transaction: { type: 'MINT' } }
        });
        const totalIssued = mintEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);
        const burnEntries = await prisma_service_1.prisma.ledgerEntry.findMany({
            where: { transaction: { type: 'BURN' } }
        });
        const totalRedeemed = burnEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);
        const policyBlockCount = await prisma_service_1.prisma.policyEvaluationLog.count({
            where: { decision: 'DENIED' }
        });
        return {
            totalIssued,
            totalRedeemed,
            txCount_24h: txCount,
            policyBlockCount
        };
    }
    async getIssuerStats(issuerId) {
        const defs = await prisma_service_1.prisma.vCreditDefinition.findMany({
            where: { issuerId },
            select: { id: true }
        });
        const defIds = defs.map(d => d.id);
        const mintEntries = await prisma_service_1.prisma.ledgerEntry.findMany({
            where: {
                transaction: { type: 'MINT' },
                creditDefId: { in: defIds }
            }
        });
        const totalIssued = mintEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);
        const burnEntries = await prisma_service_1.prisma.ledgerEntry.findMany({
            where: {
                transaction: { type: 'BURN' },
                creditDefId: { in: defIds }
            }
        });
        const totalRedeemed = burnEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);
        const outstandingLiability = totalIssued - totalRedeemed;
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const velocity24h = await prisma_service_1.prisma.transaction.count({
            where: {
                type: 'BURN',
                createdAt: { gte: oneDayAgo },
                ledgerEntries: {
                    some: { creditDefId: { in: defIds } }
                }
            }
        });
        return {
            totalIssued,
            totalRedeemed,
            outstandingLiability,
            velocity24h,
            expiringWithin30Days: 0
        };
    }
    async getBrandStats(brandId) {
        const burns = await prisma_service_1.prisma.transaction.findMany({
            where: {
                type: 'BURN',
                metadata: { contains: brandId }
            },
            include: { ledgerEntries: true }
        });
        let totalRedeemed = 0;
        burns.forEach(tx => {
            const debits = tx.ledgerEntries.filter(e => e.direction === 'DEBIT');
            totalRedeemed += debits.reduce((sum, e) => sum + e.amount.toNumber(), 0);
        });
        const feesPaid = totalRedeemed * 0.01;
        const netSettlement = totalRedeemed - feesPaid;
        const blocks = await prisma_service_1.prisma.policyEvaluationLog.count({
            where: {
                decision: 'DENIED',
                results: { contains: brandId }
            }
        });
        return {
            totalRedeemed,
            feesPaid,
            netSettlement,
            blockedAttempts: blocks
        };
    }
    async getUserWalletStats(walletId) {
        const balances = await prisma_service_1.prisma.balance.findMany({
            where: { walletId },
            include: { creditDef: true }
        });
        const expirySchedule = balances.map(b => (Object.assign(Object.assign({}, b), { expiringAmount: 0, nextExpiryDate: null })));
        const history = await prisma_service_1.prisma.transaction.findMany({
            where: {
                OR: [
                    { ledgerEntries: { some: { walletId } } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { ledgerEntries: true, policyLog: true }
        });
        const uniqueIssuerIds = [...new Set(balances.map(b => b.creditDef.issuerId))];
        const usableLocations = await prisma_service_1.prisma.issuer.findMany({
            where: { id: { in: uniqueIssuerIds } }
        });
        return {
            balances: expirySchedule,
            recentActivity: history,
            usableLocations
        };
    }
    async exchange(walletId, amount, fromCreditDefId) {
        const toCreditDefId = 'VAL_ASSET';
        const sourceBalance = await prisma_service_1.prisma.balance.findUnique({
            where: { walletId_creditDefId: { walletId, creditDefId: fromCreditDefId } }
        });
        if (!sourceBalance || sourceBalance.amount.toNumber() < amount) {
            console.log(`[Exchange Failed] Insufficient Balance. Has: ${(sourceBalance === null || sourceBalance === void 0 ? void 0 : sourceBalance.amount) || 0}, Need: ${amount}`);
            throw new Error(`Insufficient funds via Backend. Has: ${(sourceBalance === null || sourceBalance === void 0 ? void 0 : sourceBalance.amount) || 0}`);
        }
        const conversionRate = 0.01;
        const valAmount = amount * conversionRate;
        let valDef = await prisma_service_1.prisma.vCreditDefinition.findUnique({ where: { id: toCreditDefId } });
        if (!valDef) {
            const issuer = await prisma_service_1.prisma.issuer.findFirst();
            if (!issuer)
                throw new Error("No Valid Issuer found to own $VAL asset");
            valDef = await prisma_service_1.prisma.vCreditDefinition.create({
                data: {
                    id: toCreditDefId,
                    issuerId: issuer.id,
                    name: "Value OS Liquid",
                    symbol: "$VAL",
                    type: 'GIFT_CARD'
                }
            });
        }
        return prisma_service_1.prisma.$transaction(async (tx) => {
            await tx.balance.update({
                where: { walletId_creditDefId: { walletId, creditDefId: fromCreditDefId } },
                data: { amount: { decrement: amount } }
            });
            const targetBalance = await tx.balance.findUnique({
                where: { walletId_creditDefId: { walletId, creditDefId: toCreditDefId } }
            });
            if (!targetBalance) {
                await tx.balance.create({
                    data: { walletId, creditDefId: toCreditDefId, amount: valAmount }
                });
            }
            else {
                await tx.balance.update({
                    where: { walletId_creditDefId: { walletId, creditDefId: toCreditDefId } },
                    data: { amount: { increment: valAmount } }
                });
            }
            await tx.ledgerEntry.create({
                data: {
                    transactionId: `TX_SWAP_${Date.now()}`,
                    walletId,
                    creditDefId: toCreditDefId,
                    amount: valAmount,
                    direction: 'CREDIT',
                    balanceAfter: 0
                }
            }).catch(e => console.log("Ledger Log skipped due to schema constraints"));
            return { success: true, swapped: valAmount };
        });
    }
    async getDemoIds() {
        const issuer = await prisma_service_1.prisma.issuer.findFirst();
        const brand = await prisma_service_1.prisma.issuer.findFirst();
        const demoUser = await prisma_service_1.prisma.user.findFirst({
            where: { email: 'demo@valueos.com' },
            include: { wallets: true }
        });
        const wallet = (demoUser === null || demoUser === void 0 ? void 0 : demoUser.wallets[0]) || await prisma_service_1.prisma.wallet.findFirst();
        return {
            issuerId: (issuer === null || issuer === void 0 ? void 0 : issuer.id) || '',
            brandId: (brand === null || brand === void 0 ? void 0 : brand.id) || '',
            walletId: (wallet === null || wallet === void 0 ? void 0 : wallet.id) || ''
        };
    }
}
exports.VCreditService = VCreditService;
//# sourceMappingURL=vcredits.service.js.map