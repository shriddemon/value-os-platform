import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Settings, LayoutGrid, Zap, Store, ChevronRight } from 'lucide-react';
import { StatCard } from './DashboardView'; // Reusing base logic, just styling wrap

// Mock Data for "Products"
const MOCK_PRODUCTS = [
    { id: 1, name: 'Business Class Upgrade', price: 25000, img: '✈️' },
    { id: 2, name: 'Lounge Access Pass', price: 5000, img: '🛋️' },
    { id: 3, name: 'Priority Boarding', price: 2500, img: '🎫' },
    { id: 4, name: 'Extra Baggage (+23kg)', price: 7500, img: '🧳' },
];

async function fetchBrandStats(brandId: string) {
    const res = await fetch(`http://localhost:3000/api/v1/vcredits/brands/${brandId}/stats`);
    if (!res.ok) throw new Error('Failed to fetch brand stats');
    return res.json();
}

export function PremiumBrandView({ brandId }: { brandId: string }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        if (!brandId) return;
        fetchBrandStats(brandId).then(setStats).finally(() => setLoading(false));
    }, [brandId]);

    async function handleRedeem(product: any) {
        if (processingId) return;
        setProcessingId(product.id);
        console.log("ValueOS: Redeem Initiated", product.id);

        try {
            // Mock Redemption Flow
            const userWalletId = (await (await fetch('http://localhost:3000/api/v1/vcredits/demo/ids')).json()).walletId;
            const creditDef = (await (await fetch('http://localhost:3000/api/v1/vcredits/definitions')).json())[0];

            if (!creditDef) throw new Error("No Credit Definition Found");

            const res = await fetch('http://localhost:3000/api/v1/vcredits/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletId: userWalletId,
                    creditDefId: creditDef.id,
                    amount: product.price,
                    description: `Purchase: ${product.name}`,
                    metadata: { brandId } // Tagging for Brand Stats
                })
            });

            if (!res.ok) throw new Error((await res.json()).error);

            alert("Redemption Successful! Ledger updated.");
            fetchBrandStats(brandId).then(setStats); // Refresh UI
        } catch (e: any) {
            alert("Redemption Failed: " + e.message);
        } finally {
            setProcessingId(null);
        }
    }

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Brand Portal...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex text-slate-900">

            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-8">
                        <Store className="text-orange-600" /> MerchantOS
                    </div>
                    <nav className="space-y-1">
                        <NavItem icon={<LayoutGrid size={18} />} label="Overview" active />
                        <NavItem icon={<ShoppingBag size={18} />} label="Products" />
                        <NavItem icon={<Zap size={18} />} label="Integrations" />
                        <NavItem icon={<Settings size={18} />} label="Settings" />
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-gray-50">
                    <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-xs font-bold text-orange-800 mb-1">Value OS Connected</div>
                        <div className="text-xs text-orange-600">Network Status: Online</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Store Dashboard</h1>
                        <p className="text-slate-500 text-sm">Manage your integration and redemption rules.</p>
                    </div>
                    <button className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-orange-200 hover:bg-orange-700 transition flex items-center gap-2">
                        <Zap size={18} /> New Campaign
                    </button>
                </header>

                {/* Integration Status Banner */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl mb-8 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">🔗</div>
                        <div>
                            <div className="font-bold text-lg">Value OS Integration Active</div>
                            <div className="text-slate-300 text-sm">Accepting $SKY and $POINTS at checkout via API Mode.</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono">{stats?.totalRedeemed.toLocaleString()} pts</div>
                        <div className="text-xs text-slate-400">Redeemed this month</div>
                    </div>
                </motion.div>

                {/* Products Grid (The "Shopify" integration view) */}
                <h2 className="text-lg font-bold text-slate-900 mb-4">Redeemable Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {MOCK_PRODUCTS.map((prod) => (
                        <div
                            key={prod.id}
                            onClick={() => handleRedeem(prod)}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer active:scale-95"
                        >
                            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
                                {prod.img}
                            </div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-sm text-slate-500 mb-3">Inventory: ∞</div>
                            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                <span className="font-mono font-bold text-orange-600">{prod.price} pts</span>
                                <span className={`text-xs px-2 py-1 rounded transition ${processingId === prod.id
                                    ? 'bg-orange-600 text-white animate-pulse'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700'
                                    }`}>
                                    {processingId === prod.id ? 'Redeeming...' : 'Redeem'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <h2 className="text-lg font-bold text-slate-900 mb-4">Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Net Settlement</div>
                        <div className="text-3xl font-bold text-slate-900">${stats?.netSettlement || '0.00'}</div>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-2">
                            <ArrowUpRight size={12} /> Ready for payout
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Processing Fees</div>
                        <div className="text-3xl font-bold text-slate-900">${stats?.feesPaid || '0.00'}</div>
                        <div className="text-xs text-gray-400 mt-2">1.0% Platform Fee</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <div className="text-gray-500 text-sm mb-1">Blocked Transactions</div>
                        <div className="text-3xl font-bold text-slate-900">{stats?.blockedAttempts || 0}</div>
                        <div className="text-xs text-orange-500 mt-2">Fraud Prevention</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active }: any) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${active ? 'bg-orange-50 text-orange-700 font-medium' : 'text-slate-500 hover:bg-gray-50'}`}>
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
}

// Helper for icon
const ArrowUpRight = ({ size }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
);
