import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export function LandingPage() {
    const navigate = useNavigate();
    const { session, loading } = useAuth();

    useEffect(() => {
        // Prevent race condition where session is null but still tearing down
        if (!loading && session) {
            // Double check if we really have a user (sometimes session object lingers)
            if (Object.keys(session).length === 0) return;

            const intent = localStorage.getItem('valueos_role_intent');
            const target = intent === 'issuer' ? '/issuer' : '/wallet';
            console.log('Session found, redirecting to:', target);
            navigate(target);
        }
    }, [session, loading, navigate]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500">Loading ValueOS...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-950/50 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Value OS</span>
                    </div>
                    <div className="flex gap-6">
                        <button onClick={() => navigate('/login?role=issuer')} className="text-sm font-medium text-slate-400 hover:text-white transition">For Issuers</button>
                        <button onClick={() => navigate('/login?role=consumer')} className="text-sm font-medium text-slate-400 hover:text-white transition">For Users</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
                {/* Background Glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8">
                    Liquidity for <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Locked Assets</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    The Universal Loyalty Adapter. Connect your points, miles, and rewards into a unified liquid asset class.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <button
                            onClick={() => navigate('/login?role=consumer')}
                            className="relative w-64 h-20 bg-slate-900 ring-1 ring-white/10 rounded-xl flex items-center justify-between px-6 hover:bg-slate-800 transition-all"
                        >
                            <div className="text-left">
                                <div className="text-xs text-cyan-400 uppercase tracking-wider font-bold mb-1">Consumer App</div>
                                <div className="font-semibold text-white">Access Wallet</div>
                            </div>
                            <svg className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <button
                            onClick={() => navigate('/login?role=issuer')}
                            className="relative w-64 h-20 bg-slate-900 ring-1 ring-white/10 rounded-xl flex items-center justify-between px-6 hover:bg-slate-800 transition-all"
                        >
                            <div className="text-left">
                                <div className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">For Brands</div>
                                <div className="font-semibold text-white">Issuer Dashboard</div>
                            </div>
                            <svg className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </button>
                    </div>
                </div>

                {/* Visual Demo Placeholder */}
                <div className="mt-24 relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur shadow-2xl overflow-hidden aspect-video group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono">
                        [Interactive Platform Preview]
                    </div>
                </div>
            </main>
        </div>
    );
}
