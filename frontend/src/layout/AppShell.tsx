import React, { useState } from 'react';

// A simple Shell layout with a Sidebar and Main Content area
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// A simple Shell layout with a Sidebar and Main Content area
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30 bg-slate-950">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Responsive */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            Value OS
                        </h1>
                        <span className="text-xs text-slate-500 font-medium tracking-wider uppercase ml-11 mt-1 block">Operating System</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon="ChartBar" label="Overview" path="/issuer" active={window.location.pathname === '/issuer'} />
                    {/* ... other nav items ... */}
                    <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</div>
                    <NavItem icon="Banknotes" label="Transactions" path="/issuer/transactions" active={window.location.pathname.includes('transactions')} />
                    <NavItem icon="Scale" label="Policy Engine" path="/issuer/policy" active={window.location.pathname.includes('policy')} />
                    <NavItem icon="ShieldCheck" label="Compliance" path="/issuer/compliance" active={window.location.pathname.includes('compliance')} />
                    <NavItem icon="Storefront" label="Merchants" path="/issuer/merchants" active={window.location.pathname.includes('merchants')} />
                </nav>

                {/* Mobile Logout (since Header might be small) */}
                <div className="p-4 md:hidden border-t border-white/5">
                    <button
                        className="w-full px-5 py-3 text-sm font-medium bg-slate-800/50 text-slate-300 rounded-xl border border-white/5"
                        onClick={async () => {
                            await signOut();
                            navigate('/');
                        }}
                    >
                        Log Out
                    </button>
                </div>

                <div className="p-6 border-t border-white/5 bg-slate-900/30 hidden md:block">
                    {/* Desktop User Profile Footer */}
                    <div className="flex items-center gap-4 group cursor-pointer">
                        {/* ... existing profile code ... */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                <span className="font-bold text-cyan-400">A</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-200">Issuer Admin</div>
                            <div className="text-xs text-slate-500">admin@valueos.io</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
                {/* Floating Header */}
                <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-transparent">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h2 className="text-lg md:text-xl font-medium text-slate-100 flex items-center gap-2">
                            <span className="hidden md:inline text-slate-600">Dashboard /</span> <span className="text-cyan-400">Overview</span>
                        </h2>
                    </div>
                    {/* Desktop Logout Button */}
                    <button
                        className="hidden md:block px-5 py-2.5 text-xs font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-full border border-white/5 transition-all"
                        onClick={async () => {
                            await signOut();
                            navigate('/');
                        }}
                    >
                        Log Out
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

// ... Icons ...

import { BarChart3, Banknote, Scale, ShieldCheck, Store, ChevronRight } from 'lucide-react';

const Icons: any = {
    ChartBar: BarChart3,
    Banknotes: Banknote,
    Scale: Scale,
    ShieldCheck: ShieldCheck,
    Storefront: Store,
};

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
