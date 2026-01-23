"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policyRouter = void 0;
const express_1 = require("express");
const policy_service_1 = require("./policy.service");
const router = (0, express_1.Router)();
const policyService = new policy_service_1.PolicyService();
router.post('/evaluate-test', async (req, res) => {
    try {
        const result = await policyService.evaluateTransaction(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.policyRouter = router;
//# sourceMappingURL=policy.routes.js.map