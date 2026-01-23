"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyService = void 0;
const prisma_service_1 = require("../../shared/prisma.service");
class PolicyService {
    async evaluateTransaction(req) {
        const policies = await prisma_service_1.prisma.policy.findMany({
            where: {
                isActive: true,
                OR: [
                    { creditDefId: req.creditDefId },
                    { creditDefId: null, issuerId: null }
                ]
            },
            orderBy: { priority: 'desc' }
        });
        const ruleResults = [];
        let isApproved = true;
        for (const policy of policies) {
            const result = this.applyRule(policy, req);
            ruleResults.push({ policyName: policy.name, result });
            if (!result.passed) {
                isApproved = false;
                break;
            }
        }
        await prisma_service_1.prisma.policyEvaluationLog.create({
            data: {
                transactionId: null,
                decision: isApproved ? 'APPROVED' : 'DENIED',
                results: JSON.stringify({ results: ruleResults, context: req.context })
            }
        });
        return {
            approved: isApproved,
            results: ruleResults
        };
    }
    applyRule(policy, req) {
        var _a, _b;
        switch (policy.ruleType) {
            case 'MAX_TRANSACTION_LIMIT':
                const max = policy.parameters['maxAmount'] || Infinity;
                if (req.amount > max) {
                    return { passed: false, reason: `Amount ${req.amount} exceeds limit ${max}` };
                }
                return { passed: true };
            case 'BLOCKLIST_COUNTRY':
                const country = (_a = req.context) === null || _a === void 0 ? void 0 : _a.userCountry;
                if (country && ((_b = policy.parameters['countries']) === null || _b === void 0 ? void 0 : _b.includes(country))) {
                    return { passed: false, reason: `Country ${country} is blocked` };
                }
                return { passed: true };
            default:
                return { passed: true, reason: 'Rule type implementation missing (Pass-through)' };
        }
    }
}
exports.PolicyService = PolicyService;
//# sourceMappingURL=policy.service.js.map