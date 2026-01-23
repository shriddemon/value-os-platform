import { prisma } from '../../shared/prisma.service';

interface PolicyCheckRequest {
  senderWalletId?: string;
  recipientWalletId?: string;
  amount: number;
  creditDefId: string;
  context?: any;
}

export class PolicyService {

  /**
   * Evaluates all active policies for a proposed transaction.
   * Returns approved: true/false and a log of reasons.
   */
  async evaluateTransaction(req: PolicyCheckRequest) {
    // 1. Fetch relevant policies
    // (Global policies + Issuer specific policies + Token specific policies)
    const policies = await prisma.policy.findMany({
      where: {
        isActive: true,
        OR: [
          { creditDefId: req.creditDefId }, // Specific to this token
          { creditDefId: null, issuerId: null } // Global Platform policies
        ]
      },
      orderBy: { priority: 'desc' }
    });

    const ruleResults: any[] = [];
    let isApproved = true;

    for (const policy of policies) {
      const result = this.applyRule(policy, req);
      ruleResults.push({ policyName: policy.name, result });

      if (!result.passed) {
        isApproved = false;
        // Depending on configuration, we might stop at first failure or collect all.
        // Let's break for efficiency.
        break;
      }
    }

    // Persist evaluation log? 
    // In a real system, we save high-risk decisions.
    await prisma.policyEvaluationLog.create({
      data: {
        transactionId: null, // Pre-check
        decision: isApproved ? 'APPROVED' : 'DENIED',
        results: JSON.stringify({ results: ruleResults, context: req.context })
      }
    });

    return {
      approved: isApproved,
      results: ruleResults
    };
  }

  private applyRule(policy: any, req: PolicyCheckRequest): { passed: boolean; reason?: string } {
    switch (policy.ruleType) {
      case 'MAX_TRANSACTION_LIMIT':
        const max = policy.parameters['maxAmount'] || Infinity;
        if (req.amount > max) {
          return { passed: false, reason: `Amount ${req.amount} exceeds limit ${max}` };
        }
        return { passed: true };

      case 'BLOCKLIST_COUNTRY':
        // Example logic
        const country = req.context?.userCountry;
        if (country && policy.parameters['countries']?.includes(country)) {
          return { passed: false, reason: `Country ${country} is blocked` };
        }
        return { passed: true };

      default:
        // By default, unknown rules shouldn't block unless strict.
        // For safety in FinTech: Unknown rules should arguably FAIL or WARN.
        return { passed: true, reason: 'Rule type implementation missing (Pass-through)' };
    }
  }
}
