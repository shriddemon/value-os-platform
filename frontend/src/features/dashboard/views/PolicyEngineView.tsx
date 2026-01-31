export function PolicyEngineView() {
    return (
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold text-slate-300 mb-4">Policy Engine</h2>
            <div className="max-w-md mx-auto bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <p className="text-slate-600 mb-6">Define spending rules, expiry logic, and cross-border restrictions.</p>
                <div className="space-y-3 opacity-50 pointer-events-none">
                    <div className="flex justify-between p-3 bg-white rounded-lg border">
                        <span className="font-bold">Max Transaction Limit</span>
                        <span className="text-blue-600">$500.00</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg border">
                        <span className="font-bold">Geo-Fencing</span>
                        <span className="text-green-600">Enabled (US Only)</span>
                    </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold">Configure Rules (Coming Soon)</button>
            </div>
        </div>
    );
}
