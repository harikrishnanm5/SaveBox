import React, { useState, useEffect } from 'react';
import { Target, IndianRupee, Plus, ChevronLeft, Sparkles, Loader2, Save, Smartphone, Flame, Crown, Plane, Car, Home } from 'lucide-react';
import { getSavingsAdvice } from '../services/gemini';
import { Goal, SavingsPlan, LoadingState } from '../types';

interface GoalsTabProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

// Helper functions
const getIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('phone') || lower.includes('iphone')) return <Smartphone className="w-5 h-5 text-white" />;
  if (lower.includes('trip') || lower.includes('travel') || lower.includes('vacation')) return <Plane className="w-5 h-5 text-white" />;
  if (lower.includes('car') || lower.includes('vehicle')) return <Car className="w-5 h-5 text-white" />;
  if (lower.includes('home') || lower.includes('house')) return <Home className="w-5 h-5 text-white" />;
  return <Target className="w-5 h-5 text-white" />;
};

const getColor = (index: number) => {
  const colors = ['bg-purple-500', 'bg-orange-500', 'bg-blue-500', 'bg-rose-500', 'bg-emerald-500'];
  return colors[index % colors.length];
};

// Goal Item Component with Animation
const GoalItem: React.FC<{ goal: Goal; index: number }> = ({ goal, index }) => {
  const [progress, setProgress] = useState(0);
  const targetPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  useEffect(() => {
    // Delay setting progress to trigger CSS transition on mount
    const timer = setTimeout(() => {
      setProgress(targetPercentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [targetPercentage]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${getColor(index)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
          {getIcon(goal.title)}
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900 block">{Math.round(progress)}%</span>
          {goal.plan && <span className="text-[10px] text-gray-400 font-medium">AI Plan Active</span>}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.title}</h3>
      <div className="flex justify-between items-end mb-3">
        <p className="text-gray-400 text-xs font-medium">Target: ₹{goal.targetAmount.toLocaleString()}</p>
        <p className="text-emerald-600 text-sm font-bold">₹{goal.currentAmount.toLocaleString()}</p>
      </div>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor(index)}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export const GoalsTab: React.FC<GoalsTabProps> = ({ goals, setGoals }) => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [generatedPlan, setGeneratedPlan] = useState<SavingsPlan | null>(null);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    setStatus(LoadingState.LOADING);
    try {
      // Generate AI Plan
      const plan = await getSavingsAdvice(name, Number(amount), "Steady monthly income");
      setGeneratedPlan(plan);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleSaveGoal = () => {
    if (!name || !amount) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: name,
      targetAmount: Number(amount),
      currentAmount: 0,
      icon: 'target',
      color: 'bg-emerald-500',
      plan: generatedPlan || undefined
    };

    setGoals([...goals, newGoal]);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setGeneratedPlan(null);
    setStatus(LoadingState.IDLE);
    setView('list');
  };

  if (view === 'create') {
    return (
      <div className="p-6 h-full overflow-y-auto pb-32">
        <button 
          onClick={() => setView('list')}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Goals
        </button>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Goal</h2>
          <p className="text-gray-500 mb-8">Let AI help you structure your savings journey.</p>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleCreatePlan} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name of your goal</label>
                <div className="relative">
                  <Target className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="e.g., New MacBook Pro, Bali Vacation"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              {/* AI Plan Display Area */}
              <div className="relative min-h-[300px] border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 mt-8">
                {status === LoadingState.IDLE && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <Sparkles className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">Your personalized AI plan will appear here.</p>
                  </div>
                )}

                {status === LoadingState.LOADING && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600">
                    <Loader2 className="w-10 h-10 animate-spin mb-3" />
                    <p className="font-bold animate-pulse">Formulating Plan...</p>
                  </div>
                )}

                {status === LoadingState.SUCCESS && generatedPlan && (
                  <div className="p-6 bg-white rounded-2xl h-full border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{generatedPlan.title}</h3>
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{generatedPlan.estimatedTime}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {generatedPlan.steps.slice(0, 3).map((step, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">{idx+1}</span>
                          {step}
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border-l-4 border-amber-400">
                      <p className="text-xs text-amber-800 italic">"{generatedPlan.motivationalQuote}"</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {status !== LoadingState.SUCCESS ? (
                  <button
                    type="submit"
                    disabled={status === LoadingState.LOADING}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center disabled:opacity-70"
                  >
                    {status === LoadingState.LOADING ? 'Generating...' : <><Sparkles className="w-5 h-5 mr-2" /> Create My Plan</>}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center animate-in zoom-in"
                  >
                    <Save className="w-5 h-5 mr-2" /> Save Goal to List
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Goals</h2>
          <p className="text-gray-500 text-sm">Track your dreams and achievements</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <GoalItem key={goal.id} goal={goal} index={index} />
        ))}

        {/* Empty State Add Button */}
        <button 
          onClick={() => setView('create')}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-300 hover:text-emerald-600 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Create New Goal</span>
        </button>
      </div>
    </div>
  );
};
