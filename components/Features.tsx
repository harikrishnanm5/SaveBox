import React from 'react';
import { Target, TrendingUp, Lock, Smartphone } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      title: "Goal Tracking",
      desc: "Set unlimited savings goals with custom deadlines and track your progress in real-time."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
      title: "Smart Analytics",
      desc: "Understand your spending habits and find hidden opportunities to save more every month."
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
      title: "Secure Vaults",
      desc: "Your data is encrypted. Lock specific goals to prevent accidental spending before the deadline."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      color: "bg-rose-500",
      title: "Mobile First",
      desc: "Designed for your lifestyle. Manage your money on the go with our beautiful iOS and Android apps."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why use SaveBox?</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to master your savings.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-6 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};