import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, Coffee, ShoppingBag, Briefcase, Zap, Car, Landmark } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsTabProps {
  transactions: Transaction[];
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('food') || c.includes('coffee')) return <Coffee className="w-5 h-5" />;
    if (c.includes('shop') || c.includes('grocery')) return <ShoppingBag className="w-5 h-5" />;
    if (c.includes('salary') || c.includes('income')) return <Briefcase className="w-5 h-5" />;
    if (c.includes('util') || c.includes('bill')) return <Zap className="w-5 h-5" />;
    if (c.includes('transport') || c.includes('uber')) return <Car className="w-5 h-5" />;
    return <Landmark className="w-5 h-5" />;
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Header and filters */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
           <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
           <p className="text-gray-500 text-sm">Keep track of your income and expenses</p>
         </div>
         <div className="flex gap-3 flex-wrap">
           <div className="relative flex-grow md:flex-grow-0">
             <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
             />
           </div>
           <button 
             onClick={() => setFilterType(prev => prev === 'all' ? 'credit' : prev === 'credit' ? 'debit' : 'all')}
             className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors flex items-center gap-2 px-3 text-sm font-medium"
           >
             <Filter className="w-4 h-4" />
             <span className="hidden sm:inline capitalize">{filterType === 'all' ? 'All Types' : filterType}</span>
           </button>
           <button className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors">
             <Download className="w-5 h-5" />
           </button>
         </div>
       </div>

       {/* List */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="hidden md:flex bg-gray-50/50 p-4 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="w-1/2 pl-14">Description</div>
            <div className="w-1/4">Date</div>
            <div className="w-1/4 text-right pr-4">Amount</div>
         </div>
         
         {filteredTransactions.map((t, i) => (
           <div 
            key={t.id} 
            className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${i !== filteredTransactions.length - 1 ? 'border-b border-gray-50' : ''}`}
           >
             <div className="flex items-center space-x-4 w-full md:w-1/2">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 line-clamp-1">{t.title}</h4>
                 <div className="flex items-center space-x-2 text-xs text-gray-500 md:hidden">
                   <span>{t.date}</span>
                   <span>•</span>
                   <span className="capitalize">{t.category}</span>
                 </div>
                 <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        {getCategoryIcon(t.category)}
                        {t.category}
                    </span>
                 </div>
               </div>
             </div>
             
             <div className="hidden md:block w-1/4 text-sm text-gray-500 font-medium">
                {t.date}
             </div>

             <div className={`w-auto md:w-1/4 text-right font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
               {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
             </div>
           </div>
         ))}
         
         {filteredTransactions.length === 0 && (
           <div className="p-12 text-center text-gray-400 flex flex-col items-center">
             <Search className="w-12 h-12 mb-4 opacity-20" />
             <p className="font-medium">No transactions found.</p>
             <p className="text-sm">Try adjusting your filters.</p>
           </div>
         )}
       </div>
    </div>
  );
};
