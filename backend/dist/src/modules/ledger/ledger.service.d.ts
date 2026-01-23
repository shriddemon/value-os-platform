export declare enum LedgerTransactionType {
    MINT = "MINT",
    TRANSFER = "TRANSFER",
    BURN = "BURN"
}
interface LedgerEntryParams {
    walletId: string;
    creditDefId: string;
    amount: number;
    direction: 'DEBIT' | 'CREDIT';
}
export declare class LedgerService {
    recordTransaction(type: LedgerTransactionType, entries: LedgerEntryParams[], metadata?: any): Promise<{
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
}
export {};
