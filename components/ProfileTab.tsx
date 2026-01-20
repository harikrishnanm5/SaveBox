import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Save, Loader2, Palette, Sparkles, Image as ImageIcon, CheckCircle, Pencil } from 'lucide-react';
import { generatePiggyBankImage } from '../services/gemini';
import { LoadingState } from '../types';

interface ProfileTabProps {
  setCustomPiggy?: (url: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ setCustomPiggy }) => {
  const [name, setName] = useState('John Doe');
  const [isEditing, setIsEditing] = useState(false);
  
  // Piggy Generator State
  const [theme, setTheme] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!theme) return;
    setStatus(LoadingState.LOADING);
    try {
      const url = await generatePiggyBankImage(theme);
      setGeneratedImage(url);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleUseThis = () => {
    if (generatedImage && setCustomPiggy) {
      setCustomPiggy(generatedImage);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative group flex-shrink-0">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-50 flex items-center justify-center text-4xl font-bold text-emerald-700 overflow-hidden border-4 border-white shadow-xl">
             {generatedImage ? (
               <img src={generatedImage} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User className="w-16 h-16 opacity-20" />
             )}
           </div>
           <button className="absolute bottom-1 right-1 p-2 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition-colors shadow-lg border-2 border-white">
             <Camera className="w-4 h-4" />
           </button>
        </div>
        
        <div className="flex-1 w-full space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Display Name</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`flex-1 px-5 py-3 rounded-2xl border ${isEditing ? 'border-emerald-500 bg-white ring-2 ring-emerald-100' : 'border-transparent bg-gray-50'} transition-all font-bold text-xl text-gray-900 focus:outline-none`}
              />
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-3 rounded-2xl font-bold transition-all active:scale-95 ${isEditing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'}`}
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 text-gray-600 border border-gray-100/50">
              <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">john.doe@example.com</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 text-gray-600 border border-gray-100/50">
              <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Piggy Generator Section - Updated Colors */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-8 border border-emerald-800 shadow-xl text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-emerald-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Design Your Dream Box</h3>
              <p className="text-emerald-100 text-sm">Generate a custom piggy avatar that matches your unique style.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-100 ml-1">Describe your theme</label>
                <textarea 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., A cyberpunk robot piggy bank made of neon glass, glowing circuitry..."
                    className="w-full h-32 p-5 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-emerald-200/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none resize-none transition-all backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                 {['Cyberpunk', 'Floral Ceramic', 'Gold Bullion', 'Crystal'].map(t => (
                   <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-emerald-50 transition-colors"
                   >
                     {t}
                   </button>
                 ))}
              </div>

              <button 
                  onClick={handleGenerate}
                  disabled={status === LoadingState.LOADING || !theme}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 transition-all border border-white/10"
              >
                  {status === LoadingState.LOADING ? <Loader2 className="animate-spin" /> : <Palette className="w-5 h-5" />}
                  Generate Custom Avatar
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="aspect-square bg-black/30 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                  {status === LoadingState.IDLE && !generatedImage && (
                    <div className="text-center text-emerald-100/60 p-6">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Your preview will appear here</p>
                      <p className="text-xs mt-2 opacity-70">The piggy will face forward with visible coins inside.</p>
                    </div>
                  )}
                  {status === LoadingState.LOADING && (
                    <div className="text-center text-emerald-300">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                      <p className="font-bold tracking-wide animate-pulse">Designing...</p>
                    </div>
                  )}
                  {generatedImage && (
                      <div className="relative w-full h-full">
                        <img src={generatedImage} alt="Generated Piggy" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                           <span className="text-white font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Generated with Gemini</span>
                        </div>
                      </div>
                  )}
                  {status === LoadingState.ERROR && (
                    <div className="text-center text-rose-300 p-6">
                      <p>Failed to generate image. Please try a different prompt.</p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <button 
                    onClick={handleUseThis}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Use This Avatar
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}