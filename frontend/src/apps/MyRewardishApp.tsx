import { useState, useEffect } from 'react';

// Client fetcher - reusing the logic but isolating the name
async function fetchMyRewardishWallet(walletId: string) {
    const res = await fetch(`http://localhost:3000/api/v1/vcredits/wallets/${walletId}/stats`);
    if (!res.ok) throw new Error('Failed to fetch wallet');
    return res.json();
}

/**
 * MyRewardish: The Consumer App
 * A separate layout view that only shows what the consumer needs.
 */
export function MyRewardishApp({ walletId }: { walletId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!walletId) return;
        fetchMyRewardishWallet(walletId)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [walletId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-400 animate-pulse">Loading MyRewardish...</div>
        </div>
    );

    const totalBalance = data?.balances?.reduce((sum: number, b: any) => sum + Number(b.amount), 0) || 0;

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans">
            <div className="max-w-md mx-auto space-y-4">

                {/* Header */}
                <div className="flex justify-between items-center py-2">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                        MyRewardish
                    </h1>
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {/* Avatar Placeholder */}
                        <div className="w-full h-full bg-gradient-to-tr from-purple-400 to-blue-300"></div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-50">
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Purchasing Power</div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        ${totalBalance.toFixed(2)}
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-3/4"></div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400 flex justify-between">
                        <span>Safe from expiry</span>
                        <span>Power: High</span>
                    </div>
                </div>

                {/* Wallets */}
                <div className="space-y-2">
                    <div className="text-sm font-bold text-gray-400 px-1">Your Currencies</div>
                    {data?.balances?.map((b: any) => (
                        <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center group active:scale-95 transition-transform">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                    {b.creditDef.symbol[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{b.creditDef.name}</div>
                                    <div className="text-xs text-green-600 font-medium">Active</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900">{Number(b.amount).toFixed(2)}</div>
                                <div className="text-xs text-gray-400">USD Equiv</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expiry Warning (Simulated) */}
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
                    <span className="text-xl">⏳</span>
                    <div>
                        <div className="text-sm font-bold text-yellow-800">Use $10.00 soon</div>
                        <div className="text-xs text-yellow-600">
                            SkyMiles points may expire if inactive for 30 days.
                        </div>
                    </div>
                </div>

                {/* Detailed History */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 text-sm font-bold text-gray-400">Legally Verified History</div>
                    <div className="divide-y divide-gray-50">
                        {data?.recentActivity?.map((tx: any) => (
                            <div key={tx.id} className="p-4 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'MINT' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {tx.type === 'MINT' ? 'EARNED' : 'SPENT'}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 truncate w-32">
                                        {tx.type === 'MINT' ? 'From Issuer' : 'At Merchant'}
                                    </span>
                                    <span className={`font-mono font-bold ${tx.type === 'MINT' ? 'text-green-600' : 'text-gray-800'}`}>
                                        {tx.type === 'MINT' ? '+' : '-'}${Math.abs(tx.ledgerEntries[0]?.amount || 0)}
                                    </span>
                                </div>
                                {tx.type === 'BURN' && (
                                    <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                                        <span>✅ Verified on Ledger</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
