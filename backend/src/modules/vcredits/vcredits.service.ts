import { prisma } from '../../shared/prisma.service';
import { LedgerService, LedgerTransactionType } from '../ledger/ledger.service';
import { PolicyService } from '../policy/policy.service';

const ledgerService = new LedgerService();
const policyService = new PolicyService();

export class VCreditService {

  async createDefinition(data: {
    issuerId: string;
    name: string;
    symbol: string;
    type: 'LOYALTY_POINT' | 'GIFT_CARD' | 'AIRLINE_MILE'
  }) {
    return prisma.vCreditDefinition.create({
      data: {
        issuerId: data.issuerId,
        name: data.name,
        symbol: data.symbol,
        type: data.type as any
      }
    });
  }

  async mint(data: {
    issuerId: string;
    targetWalletId: string;
    creditDefId: string;
    amount: number;
    reason?: string;
  }) {
    // 1. Verify/Fix Issuer & Asset Relationship for Demo
    let def = await prisma.vCreditDefinition.findUnique({ where: { id: data.creditDefId } });
    if (!def) {
      // Auto-recover for demo: Create item if missing
      const issuer = await prisma.issuer.findUnique({ where: { id: data.issuerId } }) || await prisma.issuer.findFirst();
      if (!issuer) throw new Error("No Issuer found for Minting");

      def = await prisma.vCreditDefinition.create({
        data: {
          id: data.creditDefId,
          issuerId: issuer.id,
          name: "Demo Asset",
          symbol: "DMA",
          type: 'LOYALTY_POINT'
        }
      });
    }

    // 2. Execute Atomic Mint
    return ledgerService.recordTransaction(
      LedgerTransactionType.MINT,
      [
        {
          walletId: data.targetWalletId,
          creditDefId: data.creditDefId,
          amount: data.amount,
          direction: 'CREDIT'
        }
      ],
      { reason: data.reason, issuerId: data.issuerId }
    );
  }

  async redeem(data: {
    issuerId: string;
    walletId: string;
    creditDefId: string;
    amount: number;
    merchantId?: string;
    reason?: string;
  }) {
    // 1. Verify Issuer Logic (Optional: Any issuer can redeem their own tokens?)
    // For now, assume open redemption if you hold the token, but usually only Issuer can burn.

    // 2. Policy Check
    const policyResult = await policyService.evaluateTransaction({
      amount: data.amount,
      creditDefId: data.creditDefId,
      senderWalletId: data.walletId,
      context: { action: 'REDEEM', issuerId: data.issuerId }
    });

    if (!policyResult.approved) {
      throw new Error(`Policy Rejected: ${JSON.stringify(policyResult.results)}`);
    }

    // 3. Check Liquidity Pool Solvency (Mechanisms 1 & 3)
    let redemptionValue = data.amount * 0.01; // Base Value: $0.01 per point
    let discount = 0;

    // Mechanism 3: Merchant Discount
    if (data.merchantId) {
      const merchant = await prisma.merchant.findUnique({ where: { id: data.merchantId } });
      if (merchant && merchant.discountRate.toNumber() > 0) {
        discount = merchant.discountRate.toNumber();
        // If discount is 10%, pool pays 90%.
        // Cost = Value * (1 - 0.10)
        redemptionValue = redemptionValue * (1 - discount);
        console.log(`[Liquidity] Merchant Discount Applied: ${(discount * 100).toFixed(0)}%. New Cost: $${redemptionValue}`);
      }
    }

    const pool = await prisma.liquidityPool.findUnique({
      where: { creditDefId: data.creditDefId }
    });

    if (pool) {
      if (pool.balance.toNumber() < redemptionValue) {
        throw new Error(`LIQUIDITY FAILURE: Issuer Pool Insolvent. Pool has $${pool.balance}, required $${redemptionValue}`);
      }

      // Deduct from Pool (Spending Real Money)
      await prisma.liquidityPool.update({
        where: { id: pool.id },
        data: { balance: { decrement: redemptionValue } }
      });
      console.log(`[Liquidity] Deducted $${redemptionValue} from Pool ${pool.id}. Remaining: $${pool.balance.toNumber() - redemptionValue}`);
    } else {
      console.warn(`[Liquidity] No Pool found for Credit ${data.creditDefId}. Proceeding unbacked.`);
    }

    // 4. Execute Ledger Transaction
    // Redemption = Burn = Debit User.
    // In double-entry, we effectively credit a "Null" or "System Burn" wallet, 
    // or we just have a single-sided debit if we accept that 'Burn' destroys liability.
    // Let's model it as a Debit from User.

    return ledgerService.recordTransaction(
      LedgerTransactionType.BURN,
      [
        {
          walletId: data.walletId,
          creditDefId: data.creditDefId,
          amount: data.amount,
          direction: 'DEBIT'
        }
      ],
      { reason: data.reason, issuerId: data.issuerId }
    );
  }

  async getBalance(walletId: string) {
    return prisma.balance.findMany({
      where: { walletId },
      include: { creditDef: true }
    });
  }

  async getSystemStats() {
    // 1. Total Transaction Volume
    const txCount = await prisma.transaction.count();

    // 2. Total Value Minted
    const mintEntries = await prisma.ledgerEntry.findMany({
      where: { transaction: { type: 'MINT' } }
    });
    const totalIssued = mintEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);

    // 3. Total Value Redeemed
    const burnEntries = await prisma.ledgerEntry.findMany({
      where: { transaction: { type: 'BURN' } }
    });
    const totalRedeemed = burnEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);

    // 4. Policy Blocks
    const policyBlockCount = await prisma.policyEvaluationLog.count({
      where: { decision: 'DENIED' }
    });

    return {
      totalIssued,
      totalRedeemed,
      txCount_24h: txCount,
      policyBlockCount
    };
  }

  async getIssuerStats(issuerId: string) {
    // 0. Get all Credit Definition IDs for this Issuer
    const defs = await prisma.vCreditDefinition.findMany({
      where: { issuerId },
      select: { id: true }
    });
    const defIds = defs.map(d => d.id);

    // 1. Total Issued (Minted)
    const mintEntries = await prisma.ledgerEntry.findMany({
      where: {
        transaction: { type: 'MINT' },
        creditDefId: { in: defIds }
      }
    });
    const totalIssued = mintEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);

    // 2. Total Redeemed (Burned)
    const burnEntries = await prisma.ledgerEntry.findMany({
      where: {
        transaction: { type: 'BURN' },
        creditDefId: { in: defIds }
      }
    });
    const totalRedeemed = burnEntries.reduce((acc, entry) => acc + entry.amount.toNumber(), 0);

    // 3. Outstanding Liability
    const outstandingLiability = totalIssued - totalRedeemed;

    // 4. Redemption Velocity (Last 24h)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // For velocity, we need to interact with Transaction -> LedgerEntries -> CreditDefId
    // Since we can't deep filter easily without relation on LedgerEntry, 
    // we query Transactions that are BURN and have entries with our defIds
    const velocity24h = await prisma.transaction.count({
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

  async getBrandStats(brandId: string) {
    // 1. Fetch all BURN transactions linked to this brand (via metadata)
    const burns = await prisma.transaction.findMany({
      where: {
        type: 'BURN',
        metadata: { contains: brandId } // Simple string match on JSON metadata
      },
      include: { ledgerEntries: true }
    });

    // 2. Calculate Redeemed Value (Gross)
    let totalRedeemed = 0;
    burns.forEach(tx => {
      // Sum the DEBIT entries (User spending)
      const debits = tx.ledgerEntries.filter(e => e.direction === 'DEBIT');
      totalRedeemed += debits.reduce((sum, e) => sum + e.amount.toNumber(), 0);
    });

    // 3. Assume Fees (1%)
    const feesPaid = totalRedeemed * 0.01;

    // 4. Net Settlement
    const netSettlement = totalRedeemed - feesPaid;

    // 5. Blocked Attempts
    const blocks = await prisma.policyEvaluationLog.count({
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

  async getUserWalletStats(walletId: string) {
    // 1. Get Balances (Source of truth: Balance Table, maintained by Ledger)
    const balances = await prisma.balance.findMany({
      where: { walletId },
      include: { creditDef: true }
    });

    // 2. Mock Expiry Schedule (Since we don't have row-level expiry yet)
    // In a real system, we would query the Ledger for 'MINT' entries 
    // and check if today > mintDate + creditDef.expiryDays
    const expirySchedule = balances.map(b => ({
      ...b,
      expiringAmount: 0, // Placeholder
      nextExpiryDate: null
    }));

    // 3. Transactions History (Recent Activity)
    const history = await prisma.transaction.findMany({
      where: {
        OR: [
          { ledgerEntries: { some: { walletId } } } // Involved in ledger
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { ledgerEntries: true, policyLog: true }
    });

    // 4. Usable Locations (Available Brands)
    // Return a list of Issuers that match the held credits?
    // Or just all Issuers as "Discovery"?
    // Let's show Issuers for tokens I hold.
    const uniqueIssuerIds = [...new Set(balances.map(b => b.creditDef.issuerId))];
    const usableLocations = await prisma.issuer.findMany({
      where: { id: { in: uniqueIssuerIds } }
    });

    return {
      balances: expirySchedule,
      recentActivity: history,
      usableLocations
    };
  }

  async exchange(
    walletId: string,
    amount: number,
    fromCreditDefId: string
  ) {
    const toCreditDefId = 'VAL_ASSET';

    // 1. Validate Balance
    const sourceBalance = await prisma.balance.findUnique({
      where: { walletId_creditDefId: { walletId, creditDefId: fromCreditDefId } }
    });

    if (!sourceBalance || sourceBalance.amount.toNumber() < amount) {
      console.log(`[Exchange Failed] Insufficient Balance. Has: ${sourceBalance?.amount || 0}, Need: ${amount}`);
      throw new Error(`Insufficient funds via Backend. Has: ${sourceBalance?.amount || 0}`);
    }

    // 2. Calculate Value
    const conversionRate = 0.01;
    const valAmount = amount * conversionRate;

    // 3. Ensure $VAL exists
    let valDef = await prisma.vCreditDefinition.findUnique({ where: { id: toCreditDefId } });
    if (!valDef) {
      const issuer = await prisma.issuer.findFirst();
      if (!issuer) throw new Error("No Valid Issuer found to own $VAL asset");

      valDef = await prisma.vCreditDefinition.create({
        data: {
          id: toCreditDefId,
          issuerId: issuer.id,
          name: "Value OS Liquid",
          symbol: "$VAL",
          type: 'GIFT_CARD'
        }
      });
    }

    // 4. Atomic Swap (Transaction)
    return prisma.$transaction(async (tx) => {
      // Burn
      await tx.balance.update({
        where: { walletId_creditDefId: { walletId, creditDefId: fromCreditDefId } },
        data: { amount: { decrement: amount } }
      });

      // Mint
      const targetBalance = await tx.balance.findUnique({
        where: { walletId_creditDefId: { walletId, creditDefId: toCreditDefId } }
      });

      if (!targetBalance) {
        await tx.balance.create({
          data: { walletId, creditDefId: toCreditDefId, amount: valAmount }
        });
      } else {
        await tx.balance.update({
          where: { walletId_creditDefId: { walletId, creditDefId: toCreditDefId } },
          data: { amount: { increment: valAmount } }
        });
      }

      // Log it
      await tx.ledgerEntry.create({
        data: {
          transactionId: `TX_SWAP_${Date.now()}`, // Fake FK for demo or real if tx exists
          walletId,
          creditDefId: toCreditDefId,
          amount: valAmount,
          direction: 'CREDIT',
          balanceAfter: 0 // Mock
        }
      }).catch(e => console.log("Ledger Log skipped due to schema constraints")); // Fail safe

      return { success: true, swapped: valAmount };
    });
  }

  async getDemoIds() {
    const issuer = await prisma.issuer.findFirst();
    const brand = await prisma.issuer.findFirst();

    // Find the specific Demo User wallet to ensure it has funds
    const demoUser = await prisma.user.findFirst({
      where: { email: 'demo@valueos.com' },
      include: { wallets: true }
    });

    // Fallback to any wallet if demo user not found (legacy compat)
    const wallet = demoUser?.wallets[0] || await prisma.wallet.findFirst();

    return {
      issuerId: issuer?.id || '',
      brandId: brand?.id || '',
      walletId: wallet?.id || ''
    };
  }

  async seedDemo() {
    console.log('🚀 Starting Value OS Demo Flow (API Triggered)...');

    // 1. Cleanup
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.liquidityPool.deleteMany();
    await prisma.vCreditDefinition.deleteMany();
    await prisma.merchant.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.issuer.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Issuer
    const issuer = await prisma.issuer.create({
      data: { name: 'SkyHigh Airlines', slug: 'skyhigh', apiKey: 'sk_test_123' }
    });

    // 3. Create User & Wallet
    const user = await prisma.user.create({
      data: { email: 'demo@valueos.com', passwordHash: 'hashed_secret', fullName: 'Demo User' }
    });
    const wallet = await prisma.wallet.create({ data: { userId: user.id } });

    // 4. Create Credit Definition
    const miles = await this.createDefinition({
      issuerId: issuer.id, name: 'Sky Miles', symbol: 'SKY', type: 'AIRLINE_MILE'
    });

    // 4.1. Setup Liquidity Pool
    await prisma.liquidityPool.create({
      data: { creditDefId: miles.id, balance: 10000, currency: 'USD' }
    });

    // --- NEW ASSETS ---
    const bonvoy = await this.createDefinition({ issuerId: issuer.id, name: 'Marriott Bonvoy', symbol: 'MBV', type: 'LOYALTY_POINT' });
    const amex = await this.createDefinition({ issuerId: issuer.id, name: 'Amex Rewards', symbol: 'MR', type: 'LOYALTY_POINT' });
    const steam = await this.createDefinition({ issuerId: issuer.id, name: 'Steam Credit', symbol: 'STM', type: 'GIFT_CARD' });

    // Fund pools
    await prisma.liquidityPool.create({ data: { creditDefId: bonvoy.id, balance: 50000, currency: 'USD' } });
    await prisma.liquidityPool.create({ data: { creditDefId: amex.id, balance: 100000, currency: 'USD' } });
    await prisma.liquidityPool.create({ data: { creditDefId: steam.id, balance: 5000, currency: 'USD' } });

    // 5. MINT Assets
    await this.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: miles.id, amount: 12500, reason: 'Flight Refund' });
    await this.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: bonvoy.id, amount: 45000, reason: 'Hotel Stay' });
    await this.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: amex.id, amount: 8200, reason: 'Statement Credit' });
    await this.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: steam.id, amount: 50, reason: 'Gift Card' });

    // CONFIG: Create Merchant with Discount
    const cafe = await prisma.merchant.create({
      data: { name: "Value Cafe", category: "Dining", discountRate: 0.10 }
    });

    // 6. REDEEM 250 Miles
    await this.redeem({
      issuerId: issuer.id,
      walletId: wallet.id,
      creditDefId: miles.id,
      amount: 250,
      merchantId: cafe.id,
      reason: 'Morning Coffee'
    });

    return { success: true, message: 'Demo Environment Seeded' };
  }
}
