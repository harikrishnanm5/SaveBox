import React from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight } from 'lucide-react';

export const AnalyticsTab = () => {
  return (
    <div className="p-8 h-full overflow-y-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="text-gray-500 text-sm">Deep dive into your spending habits and savings growth.</p>
        </div>
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 outline-none hover:border-emerald-500 transition-colors">
          <option>Last 6 Months</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Net Savings</p>
            <h3 className="text-2xl font-bold text-gray-900">₹22,000</h3>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +5%
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">₹26,000</h3>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Avg. Daily Spend</p>
            <h3 className="text-2xl font-bold text-gray-900">₹866</h3>
         </div>
      </div>

       {/* Savings Trend Line Chart */}
       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Savings Growth Trend</h3>
            <span className="text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">+45% vs last year</span>
          </div>
          
          <div className="relative h-64 w-full group">
            {/* SVG Line Chart */}
             <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="2" />
                ))}
                
                {/* The Line - Smooth Curve */}
                <path 
                  d="M0,80 C20,80 20,60 40,55 C60,50 60,70 80,30 C90,10 100,15 100,5" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="drop-shadow-md"
                />
                
                {/* Area under the line */}
                <path 
                  d="M0,80 C20,80 20,60 40,55 C60,50 60,70 80,30 C90,10 100,15 100,5 V100 H0 Z" 
                  fill="url(#gradient)" 
                  opacity="0.15"
                />
                
                {/* Data Points */}
                <circle cx="0" cy="80" r="1.5" className="fill-white stroke-emerald-500 stroke-2" vectorEffect="non-scaling-stroke" />
                <circle cx="40" cy="55" r="1.5" className="fill-white stroke-emerald-500 stroke-2" vectorEffect="non-scaling-stroke" />
                <circle cx="80" cy="30" r="1.5" className="fill-white stroke-emerald-500 stroke-2" vectorEffect="non-scaling-stroke" />
                <circle cx="100" cy="5" r="1.5" className="fill-white stroke-emerald-500 stroke-2" vectorEffect="non-scaling-stroke" />

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
             </svg>
             
             {/* Tooltip Simulation on Hover */}
             <div className="absolute top-1/4 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
               Current: ₹22,000
             </div>

             {/* X-Axis Labels */}
             <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs font-medium text-gray-400">
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
             </div>
          </div>
       </div>
    </div>
  )
}
