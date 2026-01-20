import React, { useState } from 'react';
import { Palette, Download, Share2, Loader2, Image as ImageIcon } from 'lucide-react';
import { generatePiggyBankImage } from '../services/gemini';
import { LoadingState } from '../types';

export const PiggyGenerator: React.FC = () => {
  const [style, setStyle] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!style) return;
    setStatus(LoadingState.LOADING);
    setImageUrl(null);
    
    try {
      const url = await generatePiggyBankImage(style);
      setImageUrl(url);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const presetStyles = [
    "Cyberpunk Neon",
    "Vintage Floral Ceramic",
    "Golden Minimalist",
    "Retro Pixel Art",
    "Transparent Glass"
  ];

  return (
    <section id="visualize" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Design Your <span className="text-rose-500">Dream Box</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Visualizing your savings makes you 42% more likely to succeed. Use our AI to generate a custom piggy bank that matches your vibe.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your style</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="e.g. A robotic futuristic safe made of obsidian"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={status === LoadingState.LOADING || !style}
                    className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {status === LoadingState.LOADING ? <Loader2 className="animate-spin" /> : <Palette className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Or try a preset:</p>
                <div className="flex flex-wrap gap-2">
                  {presetStyles.map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square max-w-lg mx-auto bg-gray-50 rounded-3xl border-4 border-gray-100 shadow-2xl overflow-hidden flex items-center justify-center">
              
              {status === LoadingState.IDLE && (
                <div className="text-center text-gray-400 p-8">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Your generated piggy bank will appear here</p>
                </div>
              )}

              {status === LoadingState.LOADING && (
                <div className="flex flex-col items-center text-rose-500">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="font-medium animate-pulse">Designing your SaveBox...</p>
                </div>
              )}

              {status === LoadingState.SUCCESS && imageUrl && (
                <div className="relative group w-full h-full">
                  <img src={imageUrl} alt="Generated SaveBox" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <button className="p-3 bg-white rounded-full hover:scale-110 transition-transform text-gray-900">
                       <Download className="w-6 h-6" />
                     </button>
                     <button className="p-3 bg-white rounded-full hover:scale-110 transition-transform text-gray-900">
                       <Share2 className="w-6 h-6" />
                     </button>
                  </div>
                </div>
              )}

              {status === LoadingState.ERROR && (
                <div className="text-center text-red-500 p-8">
                  <p>Failed to generate image.</p>
                  <button onClick={handleGenerate} className="mt-4 text-sm underline">Try again</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};