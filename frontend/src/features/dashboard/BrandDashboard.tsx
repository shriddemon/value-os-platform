import { useState, useEffect } from 'react';
import { StatCard } from './DashboardView';

// Client-side fetcher
async function fetchBrandStats(brandId: string) {
    const res = await fetch(`http://localhost:3000/api/v1/vcredits/brands/${brandId}/stats`);
    if (!res.ok) throw new Error('Failed to fetch brand stats');
    return res.json();
}

export function BrandDashboard({ brandId }: { brandId: string }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!brandId) return;
        fetchBrandStats(brandId)
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [brandId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Brand Data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Brand Partner Terminal</h2>
                <div className="flex gap-3">
                    {/* MINT BUTTON EXPLICITLY OMITTED */}
                    <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2">
                        <span className="text-lg">⚡</span> Redeem Value (POS)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Redeemed Value"
                    value={`$${stats?.totalRedeemed || 0}`}
                    change="Gross Revenue"
                />
                <StatCard
                    title="Processing Fees Paid"
                    value={`$${stats?.feesPaid || 0}`}
                    change="1%"
                />
                <StatCard
                    title="Net Settlement"
                    value={`$${stats?.netSettlement || 0}`}
                    change="Cash Receivable"
                />
                <StatCard
                    title="Blocked Attempts"
                    value={stats?.blockedAttempts || 0}
                    change="Fraud Prevention"
                    alert={stats?.blockedAttempts > 0}
                />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-bold text-orange-900 mb-2">Policy Enforcement log</h3>
                <p className="text-sm text-orange-800 mb-4">
                    Recent transactions blocked by Issuer policies (Geo-fence, Expiry, Velocity).
                </p>
                {stats?.blockedAttempts > 0 ? (
                    <div className="bg-white p-3 rounded border border-orange-100 text-xs font-mono text-red-600">
                        [LOG] Transaction denied: POLICY_GEO_BLOCK (Country: KP)
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 italic">No recent blocks. System healthy.</div>
                )}
            </div>
        </div>
    );
}
