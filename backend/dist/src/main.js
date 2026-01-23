"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const vcredits_routes_1 = require("./modules/vcredits/vcredits.routes");
const policy_routes_1 = require("./modules/policy/policy.routes");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, max, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ValueOS-Core', timestamp: new Date() });
});
app.use('/api/v1/vcredits', vcredits_routes_1.vCreditRouter);
app.use('/api/v1/policy', policy_routes_1.policyRouter);
app.use((err, req, res, next) => {
    console.error('[GlobalError]', err);
    res.status(500).json({ error: 'Internal System Error', reference: err.message });
});
const PORT = process.env.PORT || 3000;
async function bootstrap() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to Database (SQLite)');
        app.listen(PORT, () => {
            console.log(`🚀 Value OS Core running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map