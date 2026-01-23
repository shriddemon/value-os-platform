"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerService = exports.LedgerTransactionType = void 0;
const prisma_service_1 = require("../../shared/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
var LedgerTransactionType;
(function (LedgerTransactionType) {
    LedgerTransactionType["MINT"] = "MINT";
    LedgerTransactionType["TRANSFER"] = "TRANSFER";
    LedgerTransactionType["BURN"] = "BURN";
})(LedgerTransactionType || (exports.LedgerTransactionType = LedgerTransactionType = {}));
class LedgerService {
    async recordTransaction(type, entries, metadata = {}) {
        return prisma_service_1.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    type: type,
                    status: 'COMPLETED',
                    metadata: JSON.stringify(metadata),
                    finalizedAt: new Date()
                }
            });
            const results = [];
            for (const entry of entries) {
                if (entry.amount <= 0)
                    throw new Error("Ledger amounts must be positive");
                const txAmount = new library_1.Decimal(entry.amount);
                let balance = await tx.balance.findUnique({
                    where: {
                        walletId_creditDefId: {
                            walletId: entry.walletId,
                            creditDefId: entry.creditDefId
                        }
                    }
                });
                if (!balance) {
                    if (entry.direction === 'DEBIT') {
                    }
                    balance = await tx.balance.create({
                        data: {
                            walletId: entry.walletId,
                            creditDefId: entry.creditDefId,
                            amount: 0
                        }
                    });
                }
                let newAmount = new library_1.Decimal(balance.amount);
                if (entry.direction === 'CREDIT') {
                    newAmount = newAmount.add(txAmount);
                }
                else {
                    newAmount = newAmount.sub(txAmount);
                }
                if (entry.direction === 'DEBIT' && newAmount.lessThan(0)) {
                    throw new Error(`Insufficient funds in wallet ${entry.walletId}`);
                }
                await tx.balance.update({
                    where: { id: balance.id },
                    data: { amount: newAmount }
                });
                const ledgerEntry = await tx.ledgerEntry.create({
                    data: {
                        transactionId: transaction.id,
                        walletId: entry.walletId,
                        creditDefId: entry.creditDefId,
                        direction: entry.direction,
                        amount: txAmount,
                        balanceAfter: newAmount
                    }
                });
                results.push(ledgerEntry);
            }
            return { transaction, entries: results };
        });
    }
}
exports.LedgerService = LedgerService;
//# sourceMappingURL=ledger.service.js.map