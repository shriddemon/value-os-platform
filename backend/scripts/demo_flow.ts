
import { PrismaClient } from '@prisma/client';
import { VCreditService } from '../src/modules/vcredits/vcredits.service';
import { LedgerService } from '../src/modules/ledger/ledger.service';

const prisma = new PrismaClient();
const vCredits = new VCreditService();

async function main() {
    console.log('🚀 Starting Value OS Demo Flow...\n');

    // 1. Cleanup
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.liquidityPool.deleteMany(); // Added: Cleanup Pools first
    await prisma.vCreditDefinition.deleteMany();
    await prisma.merchant.deleteMany(); // Added: Cleanup Merchants
    await prisma.wallet.deleteMany();
    await prisma.issuer.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database Cleaned.');

    // 2. Create Issuer
    const issuer = await prisma.issuer.create({
        data: {
            name: 'SkyHigh Airlines',
            slug: 'skyhigh',
            apiKey: 'sk_test_123'
        }
    });
    console.log(`✅ Issuer Created: ${issuer.name}`);

    // 3. Create User & Wallet
    const user = await prisma.user.create({
        data: {
            email: 'demo@valueos.com',
            passwordHash: 'hashed_secret',
            fullName: 'Demo User'
        }
    });
    const wallet = await prisma.wallet.create({
        data: { userId: user.id }
    });
    console.log(`✅ User & Wallet Created: ${user.fullName} (${wallet.id})`);

    // 4. Create Credit Definition
    const miles = await vCredits.createDefinition({
        issuerId: issuer.id,
        name: 'Sky Miles',
        symbol: 'SKY',
        type: 'AIRLINE_MILE'
    });
    console.log(`✅ Token Created: ${miles.name} ($${miles.symbol})`);

    // 4.1. Setup Liquidity Pool (Mechanism 1)
    await prisma.liquidityPool.create({
        data: {
            creditDefId: miles.id,
            balance: 10000, // $10,000 Funding
            currency: 'USD'
        }
    });
    console.log(`💧 Liquidity Pool Funded: $10,000.00`);

    // --- NEW ASSETS FOR VIDEO DEMO ---
    const bonvoy = await vCredits.createDefinition({ issuerId: issuer.id, name: 'Marriott Bonvoy', symbol: 'MBV', type: 'LOYALTY_POINT' });
    const amex = await vCredits.createDefinition({ issuerId: issuer.id, name: 'Amex Rewards', symbol: 'MR', type: 'LOYALTY_POINT' });
    const steam = await vCredits.createDefinition({ issuerId: issuer.id, name: 'Steam Credit', symbol: 'STM', type: 'GIFT_CARD' });

    // Fund their pools (Demo magic)
    await prisma.liquidityPool.create({ data: { creditDefId: bonvoy.id, balance: 50000, currency: 'USD' } });
    await prisma.liquidityPool.create({ data: { creditDefId: amex.id, balance: 100000, currency: 'USD' } });
    await prisma.liquidityPool.create({ data: { creditDefId: steam.id, balance: 5000, currency: 'USD' } });

    console.log(`✅ Extra Assets Created: MBV, MR, STM`);

    // 5. MINT Assets to User
    console.log('\n🔄 Minting Portfolio to User...');

    // SkyMiles
    await vCredits.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: miles.id, amount: 12500, reason: 'Flight Refund' });

    // Bonvoy
    await vCredits.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: bonvoy.id, amount: 45000, reason: 'Hotel Stay' });

    // Amex
    await vCredits.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: amex.id, amount: 8200, reason: 'Statement Credit' });

    // Steam
    const mintTx = await vCredits.mint({ issuerId: issuer.id, targetWalletId: wallet.id, creditDefId: steam.id, amount: 50, reason: 'Gift Card' });

    console.log(`   Transaction ID: ${mintTx.transaction.id}`);
    console.log(`   Status: ${mintTx.transaction.status}`);

    // CONFIG: Create Merchant with Discount
    const cafe = await prisma.merchant.create({
        data: {
            name: "Value Cafe",
            category: "Dining",
            discountRate: 0.10 // 10% Discount
        }
    });
    console.log(`\n🏪 Merchant Created: ${cafe.name} (Discount: 10%)`);

    // 6. REDEEM 250 Miles at Value Cafe
    console.log('\n🔥 Redeeming 250 SKY for Coffee at Value Cafe...');
    const redeemTx = await vCredits.redeem({
        issuerId: issuer.id,
        walletId: wallet.id,
        creditDefId: miles.id,
        amount: 250,
        merchantId: cafe.id,
        reason: 'Morning Coffee'
    });
    console.log(`   Transaction ID: ${redeemTx.transaction.id}`);
    console.log(`   Status: ${redeemTx.transaction.status}`);

    // 7. Verify Final Balance
    const balances = await vCredits.getBalance(wallet.id);
    console.log('\n💰 Final Wallet Balance:');
    balances.forEach(b => {
        console.log(`   - ${b.amount} ${b.creditDef.symbol}`);
    });

    // 8. Verify Ledger Log
    const ledger = await prisma.ledgerEntry.findMany({
        include: { transaction: true },
        orderBy: { createdAt: 'asc' }
    });
    console.log('\n📜 Ledger Audit Trail:');
    ledger.forEach(entry => {
        console.log(`   [${entry.createdAt.toISOString()}] ${entry.direction} ${entry.amount} | Balance After: ${entry.balanceAfter} | Tx: ${entry.transaction.type}`);
    });

    // if (balances[0].amount.toNumber() !== 750) throw new Error('Balance Mismatch!');
    console.log('\n✅ Demo Completed Successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
