import React from 'react';

// A simple Shell layout with a Sidebar and Main Content area
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
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
                    <NavItem icon="ChartBar" label="Overview" active />
                    <NavItem icon="BuildingLibrary" label="Issuers" />
                    <NavItem icon="Storefront" label="Merchants" />

                    <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</div>
                    <NavItem icon="Banknotes" label="Transactions" />
                    <NavItem icon="Scale" label="Policy Engine" />
                    <NavItem icon="ShieldCheck" label="Compliance" />
                </nav>

                <div className="p-6 border-t border-white/5 bg-slate-900/30">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                <span className="font-bold text-cyan-400">A</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">Admin User</div>
                            <div className="text-xs text-slate-500">admin@valueos.io</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10">
                {/* Floating Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-transparent">
                    <div>
                        <h2 className="text-xl font-medium text-slate-100 flex items-center gap-2">
                            Dashboard <span className="text-slate-600">/</span> <span className="text-cyan-400">Overview</span>
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-5 py-2.5 text-xs font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-full border border-white/5 transition-all">
                            Feedback
                        </button>
                        <button className="px-5 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
                            Connect Wallet
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 pt-2">
                    {children}
                </div>
            </main>
        </div>
    );
};

// Mock Icons for cleaner code
const Icons: any = {
    ChartBar: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    BuildingLibrary: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    Storefront: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
    Banknotes: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Scale: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    ShieldCheck: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
};

const NavItem: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active }) => {
    const Icon = Icons[icon] || Icons.ChartBar;
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
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
