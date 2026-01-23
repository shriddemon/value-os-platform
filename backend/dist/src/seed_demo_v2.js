"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding Demo V2 Data (Safe)...');
    let systemIssuer = await prisma.issuer.findUnique({ where: { name: 'Value OS System' } });
    if (!systemIssuer) {
        systemIssuer = await prisma.issuer.create({
            data: {
                name: 'Value OS System',
                slug: 'value-os-system',
                apiKey: 'SYSTEM_KEY_V2'
            }
        });
    }
    console.log('✅ System Issuer:', systemIssuer.id);
    let brandIssuer = await prisma.issuer.findUnique({ where: { name: 'SkyHigh Airlines' } });
    if (!brandIssuer) {
        brandIssuer = await prisma.issuer.create({
            data: {
                name: 'SkyHigh Airlines',
                slug: 'skyhigh-airlines',
                apiKey: 'SKY_KEY_V2'
            }
        });
    }
    console.log('✅ Brand Issuer:', brandIssuer.id);
    let user = await prisma.user.findFirst({ where: { email: 'demo@valueos.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@valueos.com',
                passwordHash: 'demo',
                fullName: 'Jane Doe'
            }
        });
    }
    let wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: { userId: user.id, type: 'CONSUMER' }
        });
    }
    console.log('✅ User Wallet:', wallet.id);
    const valAsset = await prisma.vCreditDefinition.upsert({
        where: { id: 'VAL_ASSET' },
        update: { issuerId: systemIssuer.id },
        create: {
            id: 'VAL_ASSET',
            issuerId: systemIssuer.id,
            name: 'Value OS Liquid',
            symbol: '$VAL',
            type: 'GIFT_CARD',
            decimals: 2,
            exchangeRateBaseUSD: 1.0
        }
    });
    console.log('✅ $VAL Asset:', valAsset.id);
    const milesAsset = await prisma.vCreditDefinition.upsert({
        where: { id: 'SKY_MILES_V2' },
        update: { issuerId: brandIssuer.id },
        create: {
            id: 'SKY_MILES_V2',
            issuerId: brandIssuer.id,
            name: 'Sky Miles',
            symbol: 'SKY',
            type: 'AIRLINE_MILE',
            decimals: 0,
            exchangeRateBaseUSD: 0.012
        }
    });
    console.log('✅ SkyMiles Asset:', milesAsset.id);
    await prisma.balance.upsert({
        where: { walletId_creditDefId: { walletId: wallet.id, creditDefId: milesAsset.id } },
        update: { amount: 10000 },
        create: {
            walletId: wallet.id,
            creditDefId: milesAsset.id,
            amount: 10000
        }
    });
    console.log('✅ Funded User with 10,000 SKY');
    await prisma.balance.updateMany({
        where: { walletId: wallet.id, creditDefId: 'VAL_ASSET' },
        data: { amount: 0 }
    });
    console.log('✅ Reset User $VAL Balance to 0');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_demo_v2.js.map