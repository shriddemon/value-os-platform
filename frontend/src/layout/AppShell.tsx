import React from 'react';

// A simple Shell layout with a Sidebar and Main Content area
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// A simple Shell layout with a Sidebar and Main Content area
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">

            {/* ... (sidebar content) ... */}

            {/* ... (inside header button) ... */}
            <button
                className="px-5 py-2.5 text-xs font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-full border border-white/5 transition-all"
                onClick={async () => {
                    await signOut();
                    navigate('/');
                }}
            >
                Log Out
            </button>
            {/* Sidebar - Glass Effect */}
            <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
                <div className="p-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        Value OS
                    </h1>
                    <span className="text-xs text-slate-500 font-medium tracking-wider uppercase ml-11 mt-1 block">Operating System</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon="ChartBar" label="Overview" path="/issuer" active={window.location.pathname === '/issuer'} />

                    <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</div>
                    <NavItem icon="Banknotes" label="Transactions" path="/issuer/transactions" active={window.location.pathname.includes('transactions')} />
                    <NavItem icon="Scale" label="Policy Engine" path="/issuer/policy" active={window.location.pathname.includes('policy')} />
                    <NavItem icon="ShieldCheck" label="Compliance" path="/issuer/compliance" active={window.location.pathname.includes('compliance')} />
                    <NavItem icon="Storefront" label="Merchants" path="/issuer/merchants" active={window.location.pathname.includes('merchants')} />
                </nav>

                {/* ... User Profile ... */}
            </aside>

            {/* ... Main Content ... */}
        </div>
    );
};

// ... Icons ...

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; path: string }> = ({ icon, label, active, path }) => {
    const Icon = Icons[icon] || Icons.ChartBar;
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            ${active
                    ? 'bg-slate-800/80 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:translate-x-1'
                }`}>
            <Icon className={`w-5 h-5 ${active ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'group-hover:text-slate-200'}`} />
            <span className={`text-sm font-medium ${active ? 'text-glow' : ''}`}>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />}
        </button>
    );
};
