"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const vcredits_service_1 = require("../src/modules/vcredits/vcredits.service");
const prisma = new client_1.PrismaClient();
const vCredits = new vcredits_service_1.VCreditService();
async function main() {
    console.log('🚀 Starting Value OS Demo Flow...\n');
    await prisma.ledgerEntry.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.balance.deleteMany();
    await prisma.vCreditDefinition.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.issuer.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database Cleaned.');
    const issuer = await prisma.issuer.create({
        data: {
            name: 'SkyHigh Airlines',
            slug: 'skyhigh',
            apiKey: 'sk_test_123'
        }
    });
    console.log(`✅ Issuer Created: ${issuer.name}`);
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
    const miles = await vCredits.createDefinition({
        issuerId: issuer.id,
        name: 'Sky Miles',
        symbol: 'SKY',
        type: 'AIRLINE_MILE'
    });
    console.log(`✅ Token Created: ${miles.name} ($${miles.symbol})`);
    console.log('\n🔄 Minting 1000 SKY to User...');
    const mintTx = await vCredits.mint({
        issuerId: issuer.id,
        targetWalletId: wallet.id,
        creditDefId: miles.id,
        amount: 1000,
        reason: 'New Signup Bonus'
    });
    console.log(`   Transaction ID: ${mintTx.transaction.id}`);
    console.log(`   Status: ${mintTx.transaction.status}`);
    console.log('\n🔥 Redeeming 250 SKY for Lounge Access...');
    const redeemTx = await vCredits.redeem({
        issuerId: issuer.id,
        walletId: wallet.id,
        creditDefId: miles.id,
        amount: 250,
        reason: 'Lounge Access SFO'
    });
    console.log(`   Transaction ID: ${redeemTx.transaction.id}`);
    console.log(`   Status: ${redeemTx.transaction.status}`);
    const balances = await vCredits.getBalance(wallet.id);
    console.log('\n💰 Final Wallet Balance:');
    balances.forEach(b => {
        console.log(`   - ${b.amount} ${b.creditDef.symbol}`);
    });
    const ledger = await prisma.ledgerEntry.findMany({
        include: { transaction: true },
        orderBy: { createdAt: 'asc' }
    });
    console.log('\n📜 Ledger Audit Trail:');
    ledger.forEach(entry => {
        console.log(`   [${entry.createdAt.toISOString()}] ${entry.direction} ${entry.amount} | Balance After: ${entry.balanceAfter} | Tx: ${entry.transaction.type}`);
    });
    if (balances[0].amount.toNumber() !== 750)
        throw new Error('Balance Mismatch!');
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
//# sourceMappingURL=demo_flow.js.map