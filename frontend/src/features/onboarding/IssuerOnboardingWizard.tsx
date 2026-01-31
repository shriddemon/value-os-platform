import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Server, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../../config';

export function IssuerOnboardingWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'RETAIL',
        integrationMode: 'MIRROR',
        settlementCurrency: 'USD',
        taxId: ''
    });

    async function handleComplete() {
        setLoading(true);
        try {
            // Call Backend to update Issuer Profile
            // For now, we simulate a successful onboarding update
            await new Promise(r => setTimeout(r, 1500));
            // In real impl: POST /api/v1/issuers/onboard

            navigate('/issuer');
        } catch (e) {
            alert('Setup failed: ' + e);
        } finally {
            setLoading(false);
        }
    }

    const steps = [
        { id: 1, title: 'Company Identity', icon: Building2 },
        { id: 2, title: 'Technical Setup', icon: Server },
        { id: 3, title: 'Verification', icon: ShieldCheck }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-12">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-cyan-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((s) => {
                        const active = s.id <= step;
                        const current = s.id === step;
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-500'
                                    }`}>
                                    <s.icon size={18} />
                                </div>
                                <span className={`text-xs font-bold ${current ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Wizard Card */}
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Step 1: Identity */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Who is Issuing Assets?</h2>
                            <p className="text-slate-400">Establish your legal entity on the ValueOS ledger.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Organization Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Industry Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white outline-none"
                                >
                                    <option value="RETAIL">Retail / E-Commerce</option>
                                    <option value="AIRLINE">Airline / Travel</option>
                                    <option value="SAAS">SaaS / Digital</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Tax ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                                    placeholder="EIN / VAT"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Tech Setup */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Technical Integration</h2>
                            <p className="text-slate-400">How will you connect to the ledger?</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div
                                onClick={() => setFormData({ ...formData, integrationMode: 'MIRROR' })}
                                className={`p-4 border rounded-xl cursor-pointer transition ${formData.integrationMode === 'MIRROR'
                                    ? 'bg-cyan-500/10 border-cyan-500'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.integrationMode === 'MIRROR' ? 'border-cyan-500 bg-cyan-500' : 'border-slate-500'}`} />
                                    <span className="font-bold text-white">Mirror Mode (Recommended)</span>
                                </div>
                                <p className="text-sm text-slate-400 ml-7">
                                    You keep your existing database as the source of truth. ValueOS mirrors balances via Webhooks.
                                </p>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, integrationMode: 'MASTER' })}
                                className={`p-4 border rounded-xl cursor-pointer transition ${formData.integrationMode === 'MASTER'
                                    ? 'bg-cyan-500/10 border-cyan-500'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.integrationMode === 'MASTER' ? 'border-cyan-500 bg-cyan-500' : 'border-slate-500'}`} />
                                    <span className="font-bold text-white">Master Ledger</span>
                                </div>
                                <p className="text-sm text-slate-400 ml-7">
                                    Use ValueOS as your primary database for points. We handle all logic.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-2">Webhook URL (For Events)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                                placeholder="https://api.yourbrand.com/webhooks/valueos"
                            />
                            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-blue-200">
                                <span className="font-bold block mb-1">ℹ️ What is this?</span>
                                This is an endpoint on <strong>YOUR backend</strong>. ValueOS sends a secure `POST` request here whenever a user spends points, so you can fulfill the order (e.g., enable access, ship product).
                                <br /><br />
                                <span className="opacity-75">Don't have one yet? You can skip this and configure it later in Settings.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Verification */}
                {step === 3 && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-2">Ready to Launch</h2>
                            <p className="text-slate-400 mb-6">Review your configuration.</p>
                        </div>

                        <div className="bg-slate-950 rounded-xl p-6 text-left space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Organization</span>
                                <span className="font-bold">{formData.name || 'Not Set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Type</span>
                                <span className="font-bold">{formData.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Integration</span>
                                <span className="font-bold text-cyan-400">{formData.integrationMode}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            By clicking "Complete Setup", you agree to the ValueOS Network Terms and Liability Standards.
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition"
                        >
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!formData.name && step === 1}
                            className="ml-auto px-8 py-3 bg-cyan-500 text-slate-900 rounded-xl font-bold hover:bg-cyan-400 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={loading}
                            className="ml-auto px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition flex items-center gap-2"
                        >
                            {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : 'Complete Setup'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
