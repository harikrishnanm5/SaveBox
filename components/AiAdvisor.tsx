import React, { useState } from 'react';
import { Sparkles, Loader2, IndianRupee, Target } from 'lucide-react';
import { getSavingsAdvice } from '../services/gemini';
import { LoadingState, SavingsPlan } from '../types';

export const AiAdvisor: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [income, setIncome] = useState('Steady monthly salary');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [plan, setPlan] = useState<SavingsPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;

    setStatus(LoadingState.LOADING);
    try {
      const result = await getSavingsAdvice(goal, Number(amount), income);
      setPlan(result);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <section id="advisor" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Financial Advisor</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Not sure how to reach your goal? Tell SaveBox what you want, and our Gemini-powered AI will build a custom roadmap for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Input Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-emerald-800">Define Your Goal</h3>
              <p className="text-emerald-600 text-sm mt-2">
                Share your target details below and we'll calculate the best savings path for you.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">What are you saving for?</label>
                <p className="text-xs text-gray-500 mb-2">e.g., A new car, dream vacation, or emergency fund</p>
                <div className="relative">
                  <Target className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="e.g., New MacBook Pro, Bali Vacation"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Amount (₹)</label>
                <p className="text-xs text-gray-500 mb-2">The total amount you need to save</p>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Income Context (Optional)</label>
                <p className="text-xs text-gray-500 mb-2">Helps us tailor the advice to your cash flow</p>
                <select
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                >
                  <option>Steady monthly salary</option>
                  <option>Freelance / Irregular</option>
                  <option>Student allowance</option>
                  <option>Passive income only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status === LoadingState.LOADING}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status === LoadingState.LOADING ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" /> Create My Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="relative min-h-[400px]">
            {status === LoadingState.IDLE && (
              <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <div className="text-center text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your personalized AI plan will appear here.</p>
                </div>
              </div>
            )}
            
            {status === LoadingState.ERROR && (
               <div className="absolute inset-0 flex items-center justify-center border-2 border-red-100 bg-red-50 rounded-3xl p-8">
                <p className="text-red-500">Something went wrong. Please try again.</p>
               </div>
            )}

            {status === LoadingState.SUCCESS && plan && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full animate-fade-in-up">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-emerald-600 font-medium">
                    <span className="bg-emerald-100 px-3 py-1 rounded-full">{plan.estimatedTime}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Action Steps</h4>
                  {plan.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                  <p className="italic text-amber-800 font-medium text-sm">
                    "{plan.motivationalQuote}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};