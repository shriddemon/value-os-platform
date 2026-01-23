interface PolicyCheckRequest {
    senderWalletId?: string;
    recipientWalletId?: string;
    amount: number;
    creditDefId: string;
    context?: any;
}
export declare class PolicyService {
    evaluateTransaction(req: PolicyCheckRequest): Promise<{
        approved: boolean;
        results: any[];
    }>;
    private applyRule;
}
export {};
