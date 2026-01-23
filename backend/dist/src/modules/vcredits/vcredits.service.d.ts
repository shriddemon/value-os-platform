export declare class VCreditService {
    createDefinition(data: {
        issuerId: string;
        name: string;
        symbol: string;
        type: 'LOYALTY_POINT' | 'GIFT_CARD' | 'AIRLINE_MILE';
    }): Promise<{
        symbol: string;
        id: string;
        type: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        issuerId: string;
        decimals: number;
        exchangeRateBaseUSD: import("@prisma/client/runtime/library").Decimal;
    }>;
    mint(data: {
        issuerId: string;
        targetWalletId: string;
        creditDefId: string;
        amount: number;
        reason?: string;
    }): Promise<{
        transaction: {
            id: string;
            referenceRef: string | null;
            type: string;
            status: string;
            recipientWalletId: string | null;
            metadata: string | null;
            createdAt: Date;
            finalizedAt: Date | null;
            senderWalletId: string | null;
            policyLogId: string | null;
        };
        entries: any[];
    }>;
    redeem(data: {
        issuerId: string;
        walletId: string;
        creditDefId: string;
        amount: number;
        reason?: string;
    }): Promise<{
        transaction: {
            id: string;
            referenceRef: string | null;
            type: string;
            status: string;
            recipientWalletId: string | null;
            metadata: string | null;
            createdAt: Date;
            finalizedAt: Date | null;
            senderWalletId: string | null;
            policyLogId: string | null;
        };
        entries: any[];
    }>;
    getBalance(walletId: string): Promise<({
        creditDef: {
            symbol: string;
            id: string;
            type: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            issuerId: string;
            decimals: number;
            exchangeRateBaseUSD: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        walletId: string;
        creditDefId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        updatedAt: Date;
    })[]>;
    getSystemStats(): Promise<{
        totalIssued: number;
        totalRedeemed: number;
        txCount_24h: number;
        policyBlockCount: number;
    }>;
    getIssuerStats(issuerId: string): Promise<{
        totalIssued: number;
        totalRedeemed: number;
        outstandingLiability: number;
        velocity24h: number;
        expiringWithin30Days: number;
    }>;
    getBrandStats(brandId: string): Promise<{
        totalRedeemed: number;
        feesPaid: number;
        netSettlement: number;
        blockedAttempts: number;
    }>;
    getUserWalletStats(walletId: string): Promise<{
        balances: {
            expiringAmount: number;
            nextExpiryDate: any;
            creditDef: {
                symbol: string;
                id: string;
                type: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                issuerId: string;
                decimals: number;
                exchangeRateBaseUSD: import("@prisma/client/runtime/library").Decimal;
            };
            id: string;
            walletId: string;
            creditDefId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            updatedAt: Date;
        }[];
        recentActivity: ({
            policyLog: {
                id: string;
                createdAt: Date;
                transactionId: string | null;
                decision: string;
                results: string;
            };
            ledgerEntries: {
                id: string;
                createdAt: Date;
                walletId: string;
                creditDefId: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                direction: string;
                balanceAfter: import("@prisma/client/runtime/library").Decimal;
                transactionId: string;
            }[];
        } & {
            id: string;
            referenceRef: string | null;
            type: string;
            status: string;
            recipientWalletId: string | null;
            metadata: string | null;
            createdAt: Date;
            finalizedAt: Date | null;
            senderWalletId: string | null;
            policyLogId: string | null;
        })[];
        usableLocations: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            apiKey: string;
        }[];
    }>;
    exchange(walletId: string, amount: number, fromCreditDefId: string): Promise<{
        success: boolean;
        swapped: number;
    }>;
    getDemoIds(): Promise<{
        issuerId: string;
        brandId: string;
        walletId: string;
    }>;
}
