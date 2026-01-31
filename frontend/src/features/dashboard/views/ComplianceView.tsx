export function ComplianceView() {
    return (
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold text-slate-300 mb-4">Compliance Node</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm">
                    <div className="text-green-600 font-bold mb-2">KYB Verified</div>
                    <div className="text-sm text-slate-500">Entity: SkyHigh Airlines Inc.</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm opacity-60">
                    <div className="text-slate-400 font-bold mb-2">Tax Reporting</div>
                    <div className="text-sm text-slate-500">1099-K Integration Pending</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm opacity-60">
                    <div className="text-slate-400 font-bold mb-2">AML Check</div>
                    <div className="text-sm text-slate-500">Daily Screening Active</div>
                </div>
            </div>
        </div>
    );
}
