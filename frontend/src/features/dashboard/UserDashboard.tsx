import { useState, useEffect } from 'react';

// Client fetcher
async function fetchUserStats(walletId: string) {
    const res = await fetch(`http://localhost:3000/api/v1/vcredits/wallets/${walletId}/stats`);
    if (!res.ok) throw new Error('Failed to fetch user stats');
    return res.json();
}

export function UserDashboard({ walletId }: { walletId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!walletId) return;
        fetchUserStats(walletId)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [walletId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Wallet...</div>;

    const totalBalance = data?.balances?.reduce((sum: number, b: any) => sum + Number(b.amount), 0) || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h2>
                    <p className="text-slate-400 mt-1 text-sm">Real-time spend capacity and asset breakdown.</p>
                </div>
                <div className="text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
                    ID: {walletId.substring(0, 8)}...
                </div>
            </div>

            {/* Main Balance Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl glass-panel group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors duration-700" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-colors duration-700" />

                <div className="relative z-10">
                    <div className="text-cyan-200 font-medium text-sm mb-2 uppercase tracking-wider">Total Liquidity</div>
                    <div className="text-6xl font-bold mb-6 text-white text-glow drop-shadow-lg tracking-tighter">
                        ${totalBalance.toFixed(2)}
                    </div>

                    <div className="flex gap-4 text-sm">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/15 transition-colors cursor-default">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                            3 Active Currencies
                        </span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/15 transition-colors cursor-default">
                            🛡️ Ledger Secured
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Balance Breakdown */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="font-bold text-lg text-slate-200 mb-6 flex items-center gap-2">
                        <span className="text-cyan-400">❖</span> Wallet Assets
                    </h3>
                    <div className="space-y-3">
                        {data?.balances?.map((b: any) => (
                            <div key={b.id} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-lg text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors shadow-inner">
                                        {b.creditDef.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{b.creditDef.name}</div>
                                        <div className="text-xs text-slate-500">{b.creditDef.issuerId}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-white tracking-tight">{Number(b.amount).toFixed(2)}</div>
                                    <div className="text-xs text-slate-500 font-mono">{b.creditDef.symbol}</div>
                                </div>
                            </div>
                        ))}
                        {data?.balances?.length === 0 && <div className="text-slate-500 italic p-4 text-center">No assets found.</div>}
                    </div>
                </div>

                {/* Modern Spend Section */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-slate-100">Use it Everywhere</h3>
                        <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View All Partners →</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Travel */}
                        <div className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-lg">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-cyan-500/10 transition-colors z-10" />
                            <img src="/assets/images/travel.png" alt="Travel" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20" />
                            <div className="absolute bottom-0 left-0 p-5 z-30 transform transition-transform duration-500 group-hover:-translate-y-1">
                                <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Global Connectivity</div>
                                <h4 className="text-lg font-bold text-white group-hover:text-glow">Travel & Leisure</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Redeem for flights, hotels, and exclusive experiences.</p>
                            </div>
                        </div>

                        {/* Card 2: Dining */}
                        <div className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-lg">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-purple-500/10 transition-colors z-10" />
                            <img src="/assets/images/dining.png" alt="Dining" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20" />
                            <div className="absolute bottom-0 left-0 p-5 z-30 transform transition-transform duration-500 group-hover:-translate-y-1">
                                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Fine Living</div>
                                <h4 className="text-lg font-bold text-white group-hover:text-glow">Dining & Events</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Access premium restaurants and curated events.</p>
                            </div>
                        </div>

                        {/* Card 3: Shopping */}
                        <div className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-lg">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-blue-500/10 transition-colors z-10" />
                            <img src="/assets/images/shopping.png" alt="Shopping" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20" />
                            <div className="absolute bottom-0 left-0 p-5 z-30 transform transition-transform duration-500 group-hover:-translate-y-1">
                                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Next Gen Retail</div>
                                <h4 className="text-lg font-bold text-white group-hover:text-glow">Tech & Shopping</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Shop at over 500+ tech and retail partners.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specific Locations List (Optional / Secondary) */}
                <div className="md:col-span-2 bg-slate-900/30 border border-white/5 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-3">Active Merchant Network</div>
                    <div className="flex flex-wrap gap-2">
                        {data?.usableLocations?.map((loc: any) => (
                            <div key={loc.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-colors cursor-default">
                                <span className="text-sm">🏪</span>
                                <span className="text-sm font-medium text-slate-300">{loc.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Read-Only History */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-lg text-slate-200 mb-4 flex items-center gap-2">
                    <span className="text-cyan-400">⏱</span> Recent Activity
                </h3>
                <div className="space-y-2">
                    {data?.recentActivity?.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center text-sm p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                            <span className="text-slate-300 font-mono tracking-wide">{tx.type}</span>
                            <span className="text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                            <span className={`font-mono font-bold ${tx.type === 'MINT' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`}>
                                {tx.type === 'MINT' ? '+' : '-'}${Math.abs(tx.ledgerEntries[0]?.amount || 0)}
                            </span>
                        </div>
                    ))}
                    {data?.recentActivity?.length === 0 && <div className="text-slate-500 italic text-center p-4">No recent transactions.</div>}
                </div>
            </div>
        </div>
    );
}
