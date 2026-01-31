import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, Clock, ArrowUpRight, Zap, Coffee, ShieldCheck, Link } from 'lucide-react';

import { getApiUrl } from '../config';
import { useAuth } from '../context/AuthContext';

async function fetchUserStats(walletId: string) {
    const res = await fetch(getApiUrl(`/api/v1/vcredits/wallets/${walletId}/stats`));
    if (!res.ok) throw new Error('Failed to fetch user stats');
    return res.json();
}

// Brand Logo Component (Vector Assets)
const BrandLogo = ({ id, className }: { id: string, className?: string }) => {
    switch (id) {
        // Travel
        case 't1': // Delta
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20h-13L12 5.5z" fill="#E31837" /><path d="M12 2L2 22h20L12 2z" fill="#003A70" opacity="0.3" /></svg>;
        case 't2': // Marriott
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M2 12l10-10 10 10-10 10L2 12zm2.8 0l7.2 7.2 7.2-7.2-7.2-7.2-7.2 7.2z" fill="#FF8C00" /></svg>; // Abstract Star/M
        case 't3': // Uber
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="4" fill="black" /><path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" /></svg>; // Abstract Frame

        // Dining
        case 'd1': // Starbucks
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><circle cx="12" cy="12" r="10" fill="#00704A" /><path d="M12 16c-2 0-3-1-3-3s1-2 3-2 3 1 3 2-1 3-3 3z" fill="white" /></svg>; // Abstract Siren
        case 'd2': // Chipotle
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><circle cx="12" cy="12" r="10" fill="#8C1515" /><path d="M12 6l-2 4h4l-2-4zm-3 5l2 8 2-8h-4z" fill="white" /></svg>; // Abstract Pepper
        case 'd3': // Nobu
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><rect x="2" y="8" width="20" height="8" rx="1" fill="black" /><text x="12" y="15" fontSize="8" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="bold">NOBU</text></svg>;

        // Retail
        case 'r1': // Amazon
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M17 14c-1.5 2-4 2.5-6 2-2 0-4-1-4-3s2-2.5 3-3c1-.5 3-.5 4 .5v1.5z" fill="#FF9900" /><path d="M4 16c2 3 6 4 9 3 3-1 4-3 5-5" stroke="#FF9900" strokeWidth="2" fill="none" /></svg>;
        case 'r2': // Nike
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M6 14c3 3 9 3 14-3-3 4-9 4-14 3z" fill="white" transform="rotate(-15 12 12)" /></svg>; // Swoosh approx
        case 'r3': // Steam
            return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><circle cx="12" cy="12" r="10" fill="#1b2838" /><circle cx="12" cy="12" r="3" fill="white" /><path d="M12 9v6M9 12h6" stroke="#1b2838" strokeWidth="2" /></svg>;
        default:
            return <span className="text-2xl">🏢</span>;
    }
}

export function PremiumUserApp({ walletId }: { walletId: string }) {
    const { user, signOut } = useAuth();
    const [statsWalletId, setStatsWalletId] = useState<string>(walletId); // Default to demo, update if real user found
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any | null>(null);

    // V3 State
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [selectedConnectBrand, setSelectedConnectBrand] = useState<string | null>(null);
    const [payBrand, setPayBrand] = useState<any | null>(null);

    useEffect(() => {
        async function loadUserWallet() {
            if (!user) return;
            try {
                // 1. Try to find existing wallet for this Auth User
                // Note: We need a new endpoint for this: GET /api/v1/vcredits/me/wallet
                // For now, let's assume we can fetch it or use a fallback
                console.log("Checking wallet for user:", user.email);

                // Temporary: If user is "demo@valueos.com", use the known demo wallet
                // Real implementation requires Backend Endpoint update
            } catch (e) {
                console.error("Auto-provision failed", e);
            }
        }
        loadUserWallet();
    }, [user]);

    // ... rest of component

    // V3 Handlers
    async function handleConnect(brandName: string) {
        setSubmitting(true);
        try {
            await new Promise(r => setTimeout(r, 1500));
            // Demo logic
            alert(`✅ Connected to ${brandName}! \n\nImported 5,000 Points.`);
            setConnectModalOpen(false);
        } catch (e) {
            alert("Connection Failed");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (!walletId) return;
        fetchUserStats(walletId).then(setData).finally(() => setLoading(false));
    }, [walletId]);

    async function handleSwap(balance: any) {
        if (submitting) return;
        setSubmitting(true);

        const amount = Number(balance.amount);
        const rate = 0.01;

        console.log("Values OS: Swap Initiated");

        try {
            const res = await fetch(getApiUrl('/api/v1/vcredits/exchange'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletId,
                    amount: amount, // Logic handled in backend or mock
                    fromCreditDefId: balance.creditDef.id
                })
            });

            if (!res.ok) throw new Error("API Error");

            alert("Swap Successful!");
            fetchUserStats(walletId).then(setData);
        } catch (e) {
            alert("Swap Failed!");
        } finally {
            setSubmitting(false);
        }
    }

    const totalBalance = data?.balances?.reduce((sum: number, b: any) => sum + Number(b.amount), 0) || 0;

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans pb-20 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-900/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                        MyRewardish
                    </h1>
                    <p className="text-xs text-slate-400">Value OS Secured</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setConnectModalOpen(true)}
                        className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition flex items-center gap-2"
                    >
                        <Link size={14} className="text-white" /> Link Account
                    </button>
                    <button
                        onClick={() => {
                            // useAuth hook available here
                            window.location.href = '/'; // Simple redirect for now
                        }}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full text-xs font-bold transition"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={() => fetchUserStats(walletId).then(setData)}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                    >
                        <Clock size={16} className="text-white" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <span className="text-sm font-bold">JD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Balance Hero */}
            <div className="px-6 mb-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-slate-400 text-sm font-medium mb-1"
                >
                    Total Purchasing Power
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl font-extrabold tracking-tight text-white mb-4"
                >
                    ${totalBalance.toFixed(2)}
                </motion.div>
                <div className="flex gap-3">
                    <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                        <Zap size={16} className="fill-slate-900" /> Pay
                    </button>
                    <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-700 transition">
                        <ArrowUpRight size={16} /> Send
                    </button>
                </div>
            </div>



            {/* Cards Carousel (Horizontal Scroll Fix) */}
            <div className="mb-10">
                <div className="px-6 flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold text-white">Your Wallet</h2>
                    <span className="text-xs text-violet-400">View All</span>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 overflow-x-auto px-6 pb-8 snap-x scrollbar-hide">
                    {data?.balances?.map((b: any, index: number) => {
                        const isVal = b.creditDef.id === 'VAL_ASSET';
                        return (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isVal) setSelectedCard(b);
                                }}
                                className={`
                                flex-shrink-0 w-80 h-48 rounded-2xl p-6 relative overflow-hidden snap-center cursor-pointer
                                shadow-2xl transition-transform hover:scale-105
                                ${isVal
                                        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-cyan-500/30'
                                        : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 border border-white/10'
                                    }
                            `}
                            >
                                {/* Card Background Decoration */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {isVal ? <Zap className="text-cyan-400" size={20} /> : <Wallet className="text-white/80" size={20} />}
                                            <span className={`font-bold text-lg tracking-wide ${isVal ? 'text-cyan-50' : 'text-white'}`}>
                                                {b.creditDef.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-md border border-white/5">
                                            {b.creditDef.symbol}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-3xl font-bold text-white tracking-widest mb-1">
                                            {Number(b.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] text-white/50 flex items-center gap-1 uppercase tracking-wider">
                                                {isVal ? 'Liquid Balance' : 'Loyalty Asset'}
                                            </div>
                                            {!isVal && (
                                                <div className="bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                                    Convert
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Partner Ecosystem (Brand Grid) */}
            <div className="px-6 pb-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Partner Ecosystem</h2>
                    <span className="text-xs text-violet-400">View All 42 Partners</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { id: 't1', name: 'Delta Airlines', cat: 'Travel', discount: 15, color: 'from-blue-900 to-blue-700' },
                        { id: 't2', name: 'Marriott Bonvoy', cat: 'Travel', discount: 20, color: 'from-orange-800 to-orange-600' },
                        { id: 't3', name: 'Uber Rides', cat: 'Travel', discount: 10, color: 'from-slate-900 to-black border-slate-700' },

                        { id: 'd1', name: 'Starbucks', cat: 'Dining', discount: 12, color: 'from-green-900 to-green-700' },
                        { id: 'd2', name: 'Chipotle', cat: 'Dining', discount: 10, color: 'from-red-900 to-red-700' },
                        { id: 'd3', name: 'Nobu', cat: 'Dining', discount: 25, color: 'from-stone-900 to-stone-800' },

                        { id: 'r1', name: 'Amazon', cat: 'Retail', discount: 5, color: 'from-slate-800 to-slate-600' },
                        { id: 'r2', name: 'Nike', cat: 'Retail', discount: 20, color: 'from-slate-900 to-black' },
                        { id: 'r3', name: 'Steam', cat: 'Retail', discount: 35, color: 'from-blue-950 to-indigo-900' }
                    ].map(brand => (
                        <motion.div
                            key={brand.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPayBrand(brand)}
                            className={`
                                relative h-32 rounded-2xl p-4 overflow-hidden cursor-pointer shadow-lg border border-white/5
                                bg-gradient-to-br ${brand.color} group
                            `}
                        >
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl -mr-5 -mt-5" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-90 transform">
                                <BrandLogo id={brand.id} className="w-16 h-16 drop-shadow-2xl" />
                            </div>

                            <div className="absolute top-0 right-0 p-2 z-10">
                                <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white backdrop-blur-sm shadow-sm border border-white/10">
                                    SAVE {brand.discount}%
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent w-full">
                                <div className="font-bold text-white text-base leading-tight drop-shadow-md flex items-center gap-2">
                                    {brand.name}
                                </div>
                                <div className="text-[10px] text-white/70 font-medium">{brand.cat}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Advanced Convert Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} className="bg-slate-900 rounded-3xl w-full max-w-md border border-slate-700 p-6 relative overflow-hidden">
                            <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>

                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ArrowUpRight className="text-violet-500" /> Convert Assets
                            </h3>

                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-6">
                                <div className="text-sm text-slate-400 mb-2">Converting from</div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-white">{selectedCard.creditDef.name}</span>
                                    <span className="text-lg text-slate-300">{selectedCard.amount} <small>{selectedCard.creditDef.symbol}</small></span>
                                </div>
                                <div className="w-full h-px bg-slate-700 my-4" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Exchange Rate</span>
                                    <span className="text-green-400 font-mono">100 {selectedCard.creditDef.symbol} = 1.00 $VAL</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount to Convert</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        defaultValue={selectedCard.amount}
                                        id="convert_amount"
                                        className="w-full bg-slate-950 border border-slate-700 text-white text-3xl font-bold p-4 rounded-xl focus:border-violet-500 outline-none"
                                        onChange={(e) => {
                                            const val = Number(e.target.value) * 0.01;
                                            const el = document.getElementById('calc_val');
                                            if (el) el.innerText = val.toFixed(2);
                                        }}
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-slate-800 text-violet-400 px-2 py-1 rounded"
                                        onClick={() => {
                                            const input = document.getElementById('convert_amount') as HTMLInputElement;
                                            if (input) {
                                                input.value = selectedCard.amount;
                                                const val = Number(input.value) * 0.01;
                                                const el = document.getElementById('calc_val');
                                                if (el) el.innerText = val.toFixed(2);
                                            }
                                        }}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="bg-violet-900/20 p-4 rounded-xl border border-violet-500/30 mb-6 flex justify-between items-center">
                                <span className="text-sm text-violet-200">You Receive</span>
                                <div className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-violet-400">$VAL</span>
                                    <span id="calc_val">{(Number(selectedCard.amount) * 0.01).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const amount = Number((document.getElementById('convert_amount') as HTMLInputElement).value);
                                    handleSwap({ ...selectedCard, amount });
                                    setSelectedCard(null);
                                }}
                                disabled={submitting}
                                className="w-full py-4 bg-white text-slate-900 font-bold text-lg rounded-xl hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <div className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full" /> : 'Confirm Conversion'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connect Account Modal */}
            {connectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-slate-900 rounded-3xl w-full max-w-md border border-slate-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Link Loyalty Account</h3>
                            <button onClick={() => setConnectModalOpen(false)} className="text-slate-400">✕</button>
                        </div>

                        {!selectedConnectBrand ? (
                            <div className="space-y-3">
                                <div onClick={() => setSelectedConnectBrand('Delta SkyMiles')} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer">
                                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">✈️</div>
                                    <div className="text-white font-bold">Delta SkyMiles</div>
                                </div>
                                <div onClick={() => setSelectedConnectBrand('Marriott Bonvoy')} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer">
                                    <div className="w-10 h-10 bg-orange-700 rounded-full flex items-center justify-center">🏨</div>
                                    <div className="text-white font-bold">Marriott Bonvoy</div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto bg-blue-900 rounded-full flex items-center justify-center text-2xl mb-2">✈️</div>
                                    <h4 className="text-lg font-bold text-white">Login to {selectedConnectBrand}</h4>
                                    <p className="text-sm text-slate-400">Securely import your points balance.</p>
                                </div>
                                <input type="text" placeholder="Membership Number / Email" className="w-full bg-slate-800 border-slate-700 text-white p-3 rounded-xl" />
                                <input type="password" placeholder="Password" className="w-full bg-slate-800 border-slate-700 text-white p-3 rounded-xl" />
                                <button onClick={() => handleConnect(selectedConnectBrand)} className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl mt-2">
                                    {submitting ? 'Linking...' : 'Secure Connect'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Pay with $VAL Modal (Dynamic Discount) */}
            {payBrand && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl w-full max-w-md border border-indigo-500/50 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                        <button onClick={() => setPayBrand(null)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>

                        <div className="relative z-10 text-center">
                            <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${(payBrand as any).color} rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-slate-900 overflow-hidden`}>
                                <BrandLogo id={(payBrand as any).id} className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Pay {(payBrand as any).name}</h3>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                                    {(payBrand as any).discount}% BOOST ACTIVE
                                </span>
                            </div>

                            <div className="bg-black/30 p-4 rounded-2xl border border-white/10 mb-6 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase">Purchase Amount ($)</label>
                                <input
                                    type="number"
                                    defaultValue={100}
                                    className="w-full bg-transparent text-4xl font-bold text-white outline-none border-b border-white/10 focus:border-violet-500 py-2 mb-4"
                                    onChange={(e) => {
                                        const amt = Number(e.target.value);
                                        const discount = (payBrand as any).discount;
                                        const saved = amt * (discount / 100);
                                        const pay = amt - saved;
                                        const valNeeded = pay * 100; // 1 VAL = $0.01

                                        const elPay = document.getElementById('pay_val');
                                        const elSave = document.getElementById('save_val');
                                        if (elPay) elPay.innerText = valNeeded.toLocaleString();
                                        if (elSave) elSave.innerText = saved.toFixed(2);
                                    }}
                                />

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="text-sm text-slate-300">
                                        <div className="text-xs text-slate-500 mb-0.5">You Pay in $VAL</div>
                                        <div className="font-bold text-xl flex items-center gap-1">
                                            <Zap size={14} className="fill-white" />
                                            <span id="pay_val">{(100 * (1 - ((payBrand as any).discount / 100)) * 100).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-emerald-500 mb-0.5">You Save</div>
                                        <div className="font-bold text-xl text-emerald-400">
                                            $<span id="save_val">{(100 * ((payBrand as any).discount / 100)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => { alert(`Paid ${(payBrand as any).name}! You saved with ${(payBrand as any).discount}% efficiency.`); setPayBrand(null); }} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2">
                                <Zap size={18} className="fill-slate-900" /> Confirm Payment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
}
