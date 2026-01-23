import { Router } from 'express';
import { PolicyService } from './policy.service';

const router = Router();
const policyService = new PolicyService();

router.post('/evaluate-test', async (req, res) => {
  try {
    const result = await policyService.evaluateTransaction(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const policyRouter = router;
