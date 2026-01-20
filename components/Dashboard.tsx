import React, { useState, useEffect } from 'react';
import {
  Home, Target, History, User, Bell,
  Crown, Smartphone, Flame, LayoutDashboard,
  LogOut, TrendingUp, ArrowUpRight,
  ArrowDownLeft, Plus, Wallet, PieChart, Sparkles, ChevronRight, Menu,
  CreditCard, Landmark, QrCode, CheckCircle, X, Loader2
} from 'lucide-react';
import { getFinancialInsight } from '../services/gemini';
import { GoalsTab } from './GoalsTab';
import { TransactionsTab } from './TransactionsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ProfileTab } from './ProfileTab';
import { Goal, Transaction } from '../types';

export const Dashboard: React.FC = () => {
  // Shared state for goals to persist across views (simulated)
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: "New Phone", targetAmount: 3000, currentAmount: 1250, icon: 'smartphone', color: 'bg-purple-500' },
    { id: '2', title: "Goa Trip", targetAmount: 25000, currentAmount: 15000, icon: 'flame', color: 'bg-orange-500' },
    { id: '3', title: "Emergency Fund", targetAmount: 100000, currentAmount: 45000, icon: 'crown', color: 'bg-yellow-500' }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', title: 'Salary Credited', date: 'Today, 9:00 AM', amount: 45000, type: 'credit', category: 'Salary' },
    { id: '2', title: 'Grocery Shopping', date: 'Yesterday, 6:30 PM', amount: 2450, type: 'debit', category: 'Food' },
    { id: '3', title: 'Netflix Subscription', date: 'Nov 24, 10:00 AM', amount: 649, type: 'debit', category: 'Entertainment' },
    { id: '4', title: 'Freelance Payment', date: 'Nov 23, 2:15 PM', amount: 8000, type: 'credit', category: 'Income' },
    { id: '5', title: 'Uber Ride', date: 'Nov 22, 8:45 AM', amount: 350, type: 'debit', category: 'Transport' },
    { id: '6', title: 'Transfer to Savings', date: 'Nov 21, 9:00 AM', amount: 5000, type: 'debit', category: 'Savings' },
    { id: '7', title: 'Electric Bill', date: 'Nov 20, 11:30 AM', amount: 1200, type: 'debit', category: 'Utilities' },
    { id: '8', title: 'Coffee Shop', date: 'Nov 19, 4:00 PM', amount: 280, type: 'debit', category: 'Food' },
    { id: '9', title: 'Gym Membership', date: 'Nov 18, 7:00 AM', amount: 1500, type: 'debit', category: 'Health' },
    { id: '10', title: 'Dividend Payout', date: 'Nov 15, 10:00 AM', amount: 1200, type: 'credit', category: 'Investment' },
  ]);

  // Custom Piggy Bank Image State
  const [piggyImage, setPiggyImage] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { transform: translateY(-150px) scale(0.8); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
        .ease-spring {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
        @keyframes happy-jump {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.05) translateY(-15px) rotate(-2deg); }
          50% { transform: scale(1.1) translateY(-5px) rotate(2deg); }
          75% { transform: scale(1.05) translateY(-8px) rotate(-1deg); }
          100% { transform: scale(1) translateY(0) rotate(0); }
        }
        .animate-happy {
          animation: happy-jump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes burst-ring {
          0% { transform: scale(0.8); opacity: 0; border-width: 20px; }
          50% { opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; border-width: 0; }
        }
        .animate-burst {
          animation: burst-ring 0.6s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-bounce-slower {
          animation: bounce 4s infinite;
        }
      `}</style>
      {/* Mobile View: Visible only on small screens. Using h-[100dvh] for better mobile browser support */}
      <div className="block lg:hidden h-[100dvh] w-full overflow-hidden">
        <MobileDashboard
          goals={goals}
          setGoals={setGoals}
          transactions={transactions}
          piggyImage={piggyImage}
          setPiggyImage={setPiggyImage}
        />
      </div>

      {/* Desktop View: Visible only on large screens */}
      <div className="hidden lg:flex h-screen bg-gray-50 w-full font-sans text-gray-900">
        <DesktopDashboard
          goals={goals}
          setGoals={setGoals}
          transactions={transactions}
          piggyImage={piggyImage}
          setPiggyImage={setPiggyImage}
        />
      </div>
    </>
  );
};

// ==========================================
// PAYMENT MODAL COMPONENT
// ==========================================
const PaymentModal: React.FC<{
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, amount, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'net'>('upi');
  const [status, setStatus] = useState<'select' | 'processing' | 'success'>('select');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');

  useEffect(() => {
    if (isOpen) setStatus('select');
  }, [isOpen]);

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl transform transition-all animate-in slide-in-from-bottom-full duration-300">

        {status === 'select' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add Money</h3>
                <p className="text-gray-500 text-sm">Secure Payment Gateway</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-8 text-center bg-emerald-50 py-6 rounded-2xl border border-emerald-100 border-dashed">
              <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Amount to Pay</span>
              <span className="text-4xl font-extrabold text-emerald-700">₹{amount}</span>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Select Payment Method</h4>

              {/* UPI Option */}
              <div
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${method === 'upi' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setMethod('upi')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">UPI</div>
                    <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'upi' ? 'border-emerald-500' : 'border-gray-300'}`}>
                    {method === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>

                {method === 'upi' && (
                  <div className="grid grid-cols-4 gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
                    {['gpay', 'phonepe', 'paytm', 'bhim'].map((app) => (
                      <button
                        key={app}
                        onClick={(e) => { e.stopPropagation(); setUpiApp(app as any); }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${upiApp === app ? 'bg-white border-emerald-200 shadow-md' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                      >
                        {/* Simple colored circles to represent apps for prototype */}
                        <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white font-bold text-xs ${app === 'gpay' ? 'bg-blue-500' :
                          app === 'phonepe' ? 'bg-purple-500' :
                            app === 'paytm' ? 'bg-cyan-400' : 'bg-orange-500'
                          }`}>
                          {app[0].toUpperCase()}
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 capitalize">{app}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Option */}
              <div
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${method === 'card' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Cards</div>
                    <div className="text-xs text-gray-500">Credit or Debit Card</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-emerald-500' : 'border-gray-300'}`}>
                    {method === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>
              </div>

              {/* Net Banking */}
              <div
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${method === 'net' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setMethod('net')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-orange-600">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Net Banking</div>
                    <div className="text-xs text-gray-500">All Indian banks supported</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'net' ? 'border-emerald-500' : 'border-gray-300'}`}>
                    {method === 'net' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center text-lg"
            >
              Pay ₹{amount}
            </button>
          </>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <LockIcon className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
            <p className="text-gray-500 text-center max-w-xs">Please do not close this window or press back.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500">₹{amount} has been added to your piggy bank.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// ==========================================
// SHARED PIGGY BANK COMPONENT
// ==========================================
const PiggyBankInteract: React.FC<{
  initialBalance: number,
  fullScreen?: boolean,
  customImage?: string | null
}> = ({ initialBalance, fullScreen = false, customImage }) => {
  const [balance, setBalance] = useState(initialBalance);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coins, setCoins] = useState<{ id: number, x: number, y: number, delay: number }[]>([]);
  const [clickCoins, setClickCoins] = useState<{ id: number, left: number }[]>([]);
  const [customAmount, setCustomAmount] = useState('');

  // Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  // Load user and fetch real balance
  useEffect(() => {
    const loadUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        try {
          const { getSavingsAccount } = await import('../services/database');
          const account = await getSavingsAccount(storedUserId);
          setBalance(parseFloat(account.balance));
        } catch (error) {
          console.error('Error loading balance:', error);
        }
      }
    };
    loadUserData();

    // Initialize background floating coins
    const initialCoins = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setCoins(initialCoins);
  }, []);

  const initiatePayment = (amount: number) => {
    setPendingAmount(amount);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    // Save to database if user is logged in
    if (userId) {
      try {
        const { addMoney } = await import('../services/database');
        const newBalance = await addMoney(userId, pendingAmount, `Added ₹${pendingAmount}`);
        setBalance(newBalance);
      } catch (error) {
        console.error('Error saving transaction:', error);
        // Fallback to local update
        setBalance(prev => prev + pendingAmount);
      }
    } else {
      // Not logged in, just update locally
      setBalance(prev => prev + pendingAmount);
    }

    setIsAnimating(true);

    // Trigger click coin animation
    const newId = Date.now();
    setClickCoins(prev => [...prev, { id: newId, left: Math.random() * 60 + 20 }]);

    // Reset animations
    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => {
      setClickCoins(prev => prev.filter(c => c.id !== newId));
    }, 1000);
  };

  const handleMainButtonFeed = () => {
    const custom = parseInt(customAmount);
    if (!isNaN(custom) && custom > 0) {
      initiatePayment(custom);
      setCustomAmount('');
    } else {
      initiatePayment(500);
    }
  };

  // Dynamic Base Scale Calculation
  const maxGrowthBalance = 100000;
  const growthRatio = Math.min(Math.max(0, balance) / maxGrowthBalance, 1);
  const baseScale = 1 + (growthRatio * 0.35);

  const displayCustomAmount = !isNaN(parseInt(customAmount)) && parseInt(customAmount) > 0 ? customAmount : "500";

  // Dynamic Piggy Bank Images based on balance
  const getPiggyImageForBalance = (balance: number): string => {
    // If user has custom image, use it
    if (customImage) return customImage;

    // Otherwise, use dynamic AI-generated piggies based on balance
    if (balance >= 90000) {
      return "/piggies/piggy_overflowing_1768734988041.png"; // Overflowing state
    } else if (balance >= 60000) {
      return "/piggies/piggy_almost_full_1768734972791.png"; // Almost full
    } else if (balance >= 30000) {
      return "/piggies/piggy_half_1768734957183.png"; // Half full
    } else if (balance >= 10000) {
      return "/piggies/piggy_quarter_1768734937504.png"; // Quarter full
    } else {
      return "/piggies/piggy_empty_1768734918522.png"; // Empty/starting
    }
  };

  return (
    <>
      <PaymentModal
        isOpen={showPayment}
        amount={pendingAmount}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Updated container: Reduced top/bottom padding for mobile to fit content better */}
      <div className={`relative flex flex-col items-center w-full ${fullScreen ? 'min-h-full pt-2 sm:pt-6 pb-28 justify-start' : 'h-full justify-center overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm p-8'}`}>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[50%] bg-emerald-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-[40%] -left-[20%] w-[60%] h-[40%] bg-teal-100/40 rounded-full blur-3xl"></div>

          {/* Permanent Floating Background Coins */}
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="absolute text-xl animate-float-slow opacity-60 text-yellow-400 drop-shadow-sm"
              style={{
                left: `${coin.x}%`,
                top: `${coin.y}%`,
                animationDelay: `${coin.delay}s`
              }}
            >
              🪙
            </div>
          ))}
        </div>

        {/* Click Feedback Coins */}
        {clickCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute top-1/2 text-4xl animate-float-up pointer-events-none z-30 filter drop-shadow-lg"
            style={{ left: `${coin.left}%` }}
          >
            💰
          </div>
        ))}

        {/* Piggy Character Section: Reduced max size and margin on mobile */}
        <div className="relative w-full max-w-[200px] sm:max-w-[280px] aspect-square mb-2 sm:mb-6 flex items-center justify-center z-10 shrink-0">

          {/* Animated Burst Ring on Feed */}
          {isAnimating && (
            <div className="absolute inset-0 m-auto w-full h-full rounded-full border-emerald-400 animate-burst pointer-events-none z-0"></div>
          )}

          {/* Crown */}
          <div
            className={`absolute top-0 z-20 transition-all duration-500 ease-spring origin-bottom`}
            style={{
              // Crown moves with the pig's scale and animation
              transform: `translateY(${isAnimating ? '-40px' : '-55px'}) scale(${baseScale}) rotate(${isAnimating ? '15deg' : '0deg'})`
            }}
          >
            <Crown className="w-14 h-14 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
          </div>

          {/* Glow effect behind pig */}
          <div
            className={`absolute inset-8 bg-emerald-400/20 rounded-full blur-3xl transition-all duration-500 ${isAnimating ? 'bg-emerald-400/50 scale-125' : 'animate-pulse-slow'}`}
          ></div>

          {/* Piggy Image Container - Applies base scale smoothly */}
          <div
            className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-700 ease-spring"
            style={{ transform: `scale(${baseScale})` }}
          >
            {/* Inner animation container for the happy jump */}
            <div className={`w-full h-full flex items-center justify-center ${isAnimating ? 'animate-happy' : ''}`}>
              <img
                src={getPiggyImageForBalance(balance)}
                alt="Piggy Bank"
                className="w-[90%] h-[90%] object-contain drop-shadow-2xl transition-opacity duration-500"
              />
            </div>
          </div>

          {/* Decorative floating badges - Positioned relative to container size */}
          <div className="absolute top-[10%] right-[0%] w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-bounce-slow z-20">
            <span className="text-yellow-900 font-bold text-lg">₹</span>
          </div>
          <div className="absolute bottom-[10%] left-[0%] w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-bounce-slower z-20">
            <span className="text-yellow-900 font-bold text-xs">₹</span>
          </div>
        </div>

        {/* Balance Display: Reduced margin on mobile */}
        <div className="text-center mb-4 sm:mb-6 relative w-full z-10 shrink-0">
          <h1 className="text-5xl font-extrabold text-emerald-950 tracking-tight mb-2 sm:mb-3 transition-all font-display">
            ₹{balance.toLocaleString()}
          </h1>

          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2 sm:mb-3">
            <span className="text-base font-medium">Saved for New Phone</span>
            <Smartphone className="w-4 h-4 text-gray-800" />
          </div>

          <div className="inline-flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-500">7-day saving streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
        </div>

        {/* Unified Control Container for Alignment */}
        <div className="w-full max-w-sm px-4 sm:px-0 z-20 flex flex-col gap-3 mt-2 sm:mt-4 shrink-0">

          {/* Custom Amount Input */}
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-emerald-600 font-bold">₹</span>
            </div>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMainButtonFeed()}
              placeholder="Enter custom amount..."
              className="block w-full pl-8 pr-10 py-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm text-center font-bold text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Plus className="w-5 h-5 text-emerald-500 opacity-50" />
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-2 w-full">
            {[10, 20, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => initiatePayment(amt)}
                className="bg-white/80 hover:bg-white text-emerald-900 font-bold py-3 rounded-xl border border-yellow-100 active:scale-95 transition-all shadow-sm text-base sm:text-lg relative overflow-hidden group backdrop-blur-sm pointer-events-auto"
              >
                <span className="relative z-10">₹{amt}</span>
              </button>
            ))}
          </div>

          {/* Main Feed Button - Aligned inside the container */}
          <button
            onClick={handleMainButtonFeed}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex flex-col items-center justify-center group relative overflow-hidden pointer-events-auto"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="text-xl font-bold relative z-10">Feed the Pig (₹{displayCustomAmount})</span>
            {fullScreen && (
              <div className="flex items-center space-x-2 mt-1 opacity-90 relative z-10">
                <span className="text-[10px] font-medium tracking-wide">UPI • Instant • Safe</span>
              </div>
            )}
          </button>
        </div>

      </div>
    </>
  );
};

// ==========================================
// COMPONENT HELPERS
// ==========================================

const StatCard: React.FC<{
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, trend, trendUp, subtext, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    {subtext && <p className="text-xs text-gray-400 mt-2 font-medium">{subtext}</p>}
  </div>
);

const GoalCard: React.FC<{
  title: string;
  target: number;
  current: number;
  icon: React.ReactNode;
  bg: string;
  bar: string;
}> = ({ title, target, current, icon, bg, bar }) => {
  const progress = Math.min((current / target) * 100, 100);
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className={`w-12 h-12 rounded-xl ${bar} flex items-center justify-center shadow-sm mr-4`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-bold text-gray-900 text-sm">{title}</span>
          <span className="text-xs font-bold text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${bar}`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">₹{current.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400">₹{target.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
      }`}
  >
    {React.cloneElement(icon as React.ReactElement, {
      className: `w-5 h-5 ${active ? 'text-emerald-600' : 'text-gray-400'}`,
    })}
    <span>{label}</span>
  </button>
);

// ==========================================
// DESKTOP DASHBOARD IMPLEMENTATION
// ==========================================
interface InsightData {
  insight: string;
  suggestion: string;
  actionLabel: string;
}

interface DashboardProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  transactions: Transaction[];
  piggyImage?: string | null;
  setPiggyImage?: (url: string) => void;
}

const DesktopDashboard: React.FC<DashboardProps> = ({ goals, setGoals, transactions, piggyImage, setPiggyImage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [insightData, setInsightData] = useState<InsightData>({
    insight: "Analyzing your finances...",
    suggestion: "Please wait a moment.",
    actionLabel: "Loading..."
  });
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    // Fetch AI insight on mount
    const fetchInsight = async () => {
      try {
        // Passing mocked data for the AI context
        const result = await getFinancialInsight("₹32,568", "₹8,450", "New Phone (40%), Goa Trip (60%), Emergency Fund (45%)");
        setInsightData(result);
      } catch (e) {
        setInsightData({
          insight: "You're saving 15% more than last month.",
          suggestion: "Top up your goal to reach it faster.",
          actionLabel: "Top Up"
        });
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'goals':
        return <GoalsTab goals={goals} setGoals={setGoals} />;
      case 'history':
        return <TransactionsTab transactions={transactions} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'profile':
        return <ProfileTab setCustomPiggy={setPiggyImage} />;
      case 'overview':
      default:
        return (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Balance"
                value="₹32,568"
                trend="+12%"
                trendUp={true}
                icon={<Wallet className="w-6 h-6 text-white" />}
                color="bg-emerald-500"
              />
              <StatCard
                label="Monthly Savings"
                value="₹8,450"
                trend="+5%"
                trendUp={true}
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                color="bg-blue-500"
              />
              <StatCard
                label="Active Goals"
                value={goals.length.toString()}
                subtext="2 nearing completion"
                icon={<Target className="w-6 h-6 text-white" />}
                color="bg-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Center: Piggy Bank Interaction (Replaces Analytics & Recent Transactions) */}
              <div className="lg:col-span-2 min-h-[500px]">
                <PiggyBankInteract initialBalance={32568} customImage={piggyImage} />
              </div>

              {/* Right Side: Goals & AI Insight */}
              <div className="space-y-6">

                {/* AI Insight Card - Improved */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative bg-gray-900 rounded-[1.7rem] p-6 text-white overflow-hidden">

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200">AI Financial Insight</h3>
                      </div>

                      <p className="text-lg font-medium leading-relaxed mb-4 text-white/95 min-h-[3.5rem]">
                        {loadingInsight ? "Analyzing..." : insightData.insight}
                      </p>

                      {!loadingInsight && (
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                          <p className="text-xs text-gray-300 uppercase font-bold mb-1">Recommended Action</p>
                          <p className="text-sm text-purple-100 mb-3">{insightData.suggestion}</p>
                          <button className="w-full bg-white text-purple-900 font-bold py-2.5 rounded-lg text-sm hover:bg-purple-50 transition-colors flex items-center justify-center">
                            {insightData.actionLabel}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Your Goals</h3>
                    <button
                      onClick={() => setActiveTab('goals')}
                      className="text-emerald-600 text-sm font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-6">
                    {goals.slice(0, 3).map((g, i) => (
                      <GoalCard
                        key={g.id}
                        title={g.title}
                        target={g.targetAmount}
                        current={g.currentAmount}
                        icon={g.icon === 'smartphone' ? <Smartphone className="w-5 h-5 text-white" /> : g.icon === 'flame' ? <Flame className="w-5 h-5 text-white" /> : <Crown className="w-5 h-5 text-white" />}
                        bg={g.color?.replace('500', '100') || 'bg-gray-100'}
                        bar={g.color || 'bg-gray-500'}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-8 flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SaveBox</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem icon={<Home />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Target />} label="My Goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
          <SidebarItem icon={<History />} label="Transactions" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarItem icon={<PieChart />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold shadow-sm">JD</div>
              <div>
                <p className="text-sm font-bold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors w-full rounded-xl hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-sm text-gray-500">Welcome back, let's save some money today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> New Goal
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

// ==========================================
// MOBILE DASHBOARD IMPLEMENTATION
// ==========================================
const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors group p-2 rounded-xl ${active ? 'text-emerald-600' : 'text-gray-400 hover:bg-gray-50'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, {
      className: `w-6 h-6 transition-colors duration-300 ${active ? 'text-emerald-600 fill-emerald-600/10' : 'text-gray-400 group-hover:text-gray-600'}`
    })}
    <span className={`text-[10px] font-bold transition-colors duration-300 ${active ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600'}`}>{label}</span>
  </button>
);

const MobileDashboard: React.FC<DashboardProps> = ({ goals, setGoals, transactions, piggyImage, setPiggyImage }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 bg-white sticky top-0 z-20">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">JD</div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
                    <p className="text-lg font-bold text-gray-900">John Doe</p>
                  </div>
                </div>
                <button className="p-2 rounded-full bg-gray-100 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
              </div>
            </div>
            <PiggyBankInteract initialBalance={32568} fullScreen={true} customImage={piggyImage} />
          </div>
        )}
        {activeTab === 'goals' && <GoalsTab goals={goals} setGoals={setGoals} />}
        {activeTab === 'history' && <TransactionsTab transactions={transactions} />}
        {activeTab === 'profile' && <ProfileTab setCustomPiggy={setPiggyImage} />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-6 z-50 safe-area-bottom">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Target />} label="Goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
          <NavItem icon={<History />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </div>
    </div>
  );
};