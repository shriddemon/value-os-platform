import { prisma } from '../../shared/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export enum LedgerTransactionType {
  MINT = 'MINT',
  TRANSFER = 'TRANSFER',
  BURN = 'BURN'
}

interface LedgerEntryParams {
  walletId: string;
  creditDefId: string;
  amount: number; // Positive
  direction: 'DEBIT' | 'CREDIT';
}

/**
 * Service to handle low-level double-entry bookkeeping.
 * ALL value movements must go through here.
 */
export class LedgerService {

  /**
   * Records a transaction atomically.
   */
  async recordTransaction(
    type: LedgerTransactionType,
    entries: LedgerEntryParams[],
    metadata: any = {}
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the parent Transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: type as any,
          status: 'COMPLETED',
          metadata: JSON.stringify(metadata),
          finalizedAt: new Date()
        }
      });

      const results = [];

      // 2. Process each entry (Debit/Credit)
      for (const entry of entries) {
        // Validation: Positive amounts only
        if (entry.amount <= 0) throw new Error("Ledger amounts must be positive");

        const txAmount = new Decimal(entry.amount);

        // Update Balance
        // We use upsert to ensure balance row exists
        let balance = await tx.balance.findUnique({
          where: {
            walletId_creditDefId: {
              walletId: entry.walletId,
              creditDefId: entry.creditDefId
            }
          }
        });

        if (!balance) {
          // If debiting a non-existent balance, fail (unless it's a special system wallet logic, but keep strict for now)
          if (entry.direction === 'DEBIT') {
            // Exception: If system allows overdrafts? No.
            // But valid scenarios: Creating a brand new wallet balance on first Credit.
            // Checking if credit is allowed:
          }
          balance = await tx.balance.create({
            data: {
              walletId: entry.walletId,
              creditDefId: entry.creditDefId,
              amount: 0
            }
          });
        }

        // Calculate new balance
        let newAmount = new Decimal(balance.amount);
        if (entry.direction === 'CREDIT') {
          newAmount = newAmount.add(txAmount);
        } else {
          newAmount = newAmount.sub(txAmount);
        }

        // Check for insufficient funds (if DEBIT)
        // Assumption: System wallets might go negative? For now, enforce >= 0 for User wallets.
        // We fetch wallet type to check constraints (omitted for brevity, assume strict).
        if (entry.direction === 'DEBIT' && newAmount.lessThan(0)) {
          throw new Error(`Insufficient funds in wallet ${entry.walletId}`);
        }

        // Save new balance
        await tx.balance.update({
          where: { id: balance.id },
          data: { amount: newAmount }
        });

        // Create Immutable Ledger Entry
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
