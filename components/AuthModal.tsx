import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !name) return;
    setLoading(true);

    try {
      const user = await loginUser(phoneNumber, name);

      if (user) {
        localStorage.setItem('userId', user.id);
      }
      localStorage.setItem('phoneNumber', phoneNumber);
      localStorage.setItem('userName', name);

      onLoginSuccess();

      // Reset
      setTimeout(() => {
        setPhoneNumber('');
        setName('');
      }, 300);

    } catch (error: any) {
      console.error("Error logging in:", error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to SaveBox</h2>
          <p className="text-gray-500 mt-2">Login or create an account to start saving.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="John Doe"
              autoFocus
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-gray-400 font-medium border-r border-gray-200 pr-3 mr-3">
                +91
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="98765 43210"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phoneNumber.length < 10 || name.length < 2}
            className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Start Saving <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};