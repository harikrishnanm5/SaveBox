import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onOpenAuth: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuth }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(72);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-32 transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6 border border-emerald-100 dark:border-emerald-900">
            <Zap className="w-4 h-4 mr-2 fill-emerald-500 dark:fill-emerald-400" />
            New: AI-Powered Savings Plans
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
            Saving money just got <span className="text-emerald-500 dark:text-emerald-400">smart</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
            SaveBox isn't just a piggy bank; it's an intelligent financial companion. Visualize your goals, get AI-driven advice, and watch your savings grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onOpenAuth}
              className="flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 dark:shadow-emerald-900/20 hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
            >
              Start Saving Free
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500 dark:text-emerald-400" />
              Bank-level Security
            </div>
            <div className="flex items-center">
               <span className="flex mr-1">
                 {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
               </span>
               4.9/5 Rating
            </div>
          </div>
        </div>

        {/* Visual Content */}
        <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-800 aspect-[4/5] md:aspect-square max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
             <img 
               src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2080&auto=format&fit=crop" 
               alt="App Interface" 
               className="object-cover w-full h-full opacity-90 dark:opacity-80"
             />
             <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Japan Trip Fund</span>
                   <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹1,45,000 / ₹2,00,000</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 dark:bg-emerald-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};