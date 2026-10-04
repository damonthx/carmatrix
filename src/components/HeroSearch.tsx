import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { supabase } from '../supabaseClient';
import { getMakes, getModelsForMake } from '../services/nhtsa';
// @ts-ignore
import heroBgImage from '../assets/hero-bg.png';

interface HeroSearchProps {
  onSearch: (filters: any) => void;
  onSell: () => void;
}

export default function HeroSearch({ onSearch, onSell }: HeroSearchProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [heroBg, setHeroBg] = useState(heroBgImage);
  const [error, setError] = useState('');

  // Classic Search States
  const [searchMode, setSearchMode] = useState<'ai' | 'classic'>('ai');
  const [classicMake, setClassicMake] = useState('');
  const [classicModel, setClassicModel] = useState('');
  const [classicYear, setClassicYear] = useState('');
  const [classicBodyType, setClassicBodyType] = useState('');
  const [classicMaxPrice, setClassicMaxPrice] = useState(100000);
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      // Load hero background
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'hero_background')
        .single();
      if (data) setHeroBg(data.value);

      // Load NHTSA makes
      const makes = await getMakes();
      setAvailableMakes(makes);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadModels() {
      setIsModelsLoading(true);
      const models = await getModelsForMake(classicMake);
      setAvailableModels(models);
      setClassicModel('');
      setIsModelsLoading(false);
    }
    if (classicMake) {
      loadModels();
    } else {
      setAvailableModels([]);
      setClassicModel('');
    }
  }, [classicMake]);

  const handleAiSearch = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setError('');
    
    try {
      // In Vite, env vars are exposed via import.meta.env
      // Also fallback to a window.env or similar if it's injected, but let's assume it's in process.env for standard AI Studio setup
      // Note: we're using the standard config pattern from the existing code
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);

      if (!apiKey) {
         console.warn("No Gemini API key found, please configure it.");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze this user's car search request: "${aiPrompt}". Extract the constraints and return suggested car attributes as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              make: { type: Type.STRING, description: "Suggested car make (e.g. Toyota)" },
              model: { type: Type.STRING, description: "Suggested car model (e.g. Camry)" },
              bodyType: { type: Type.STRING, description: "e.g. SUV, Sedan, Pickup Truck, Coupe, Hatchback" },
              fuelType: { type: Type.STRING, description: "e.g. Gas, Electric, Hybrid" },
              maxPrice: { type: Type.INTEGER, description: "Maximum price in dollars if specified" },
              searchTerm: { type: Type.STRING, description: "A general search keyword if make/model aren't specific enough" },
              reason: { type: Type.STRING, description: "Brief friendly explanation of why you selected these filters based on their prompt" }
            },
            required: ["reason"]
          } as Schema
        }
      });
      
      const result = JSON.parse(response.text);
      
      onSearch({
        make: result.make || '',
        model: result.model || '',
        bodyTypes: result.bodyType ? [result.bodyType] : [],
        fuelTypes: result.fuelType ? [result.fuelType] : [],
        maxPrice: result.maxPrice || 100000,
        searchTerm: result.searchTerm || '',
        aiReasoning: result.reason
      });
    } catch (error: any) {
      console.error("AI Search Error:", error);
      setError("I had trouble understanding that. Please try phrasing it differently or check your API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiSearch();
    }
  };

  const handleClassicSearch = () => {
    onSearch({
      make: classicMake,
      model: classicModel,
      year: classicYear ? parseInt(classicYear) : undefined,
      bodyTypes: classicBodyType ? [classicBodyType] : [],
      fuelTypes: [],
      maxPrice: classicMaxPrice,
      searchTerm: '',
      aiReasoning: '' // No AI reasoning for classic searches
    });
  };

  return (
    <div className="relative w-full min-h-[650px] lg:h-[750px] flex items-center px-4 md:px-20 py-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 brightness-[0.9] contrast-[1.1]"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-slate-900/30" />
      </div>

      {/* Apple Glassmorphic Content Box & Tagline Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20">
        {/* Apple Glassmorphic Content Box */}
        <div className="w-full max-w-[480px] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] rounded-[32px] p-6 md:p-8 flex flex-col">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight drop-shadow-sm">
            Find the perfect car <br/>for your life.
          </h1>

          <div className="flex gap-6 border-b border-white/40 mb-6 font-extrabold text-[14px]">
            <button 
              onClick={() => setActiveTab('buy')}
              className={`pb-3 transition-all relative ${activeTab === 'buy' ? 'text-slate-900 drop-shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Find a car
              {activeTab === 'buy' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
            </button>
            <button 
              onClick={() => setActiveTab('sell')}
              className={`pb-3 transition-all relative ${activeTab === 'sell' ? 'text-slate-900 drop-shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Sell your car
              {activeTab === 'sell' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
            </button>
          </div>

          {activeTab === 'buy' ? (
            <div className="space-y-4">
              {/* Search Mode Toggles */}
              <div className="flex bg-white/30 backdrop-blur-md p-1 rounded-xl mb-4 shadow-inner border border-white/40">
                <button 
                  onClick={() => setSearchMode('ai')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${searchMode === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  AI Matchmaker
                </button>
                <button 
                  onClick={() => setSearchMode('classic')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${searchMode === 'classic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  Classic Search
                </button>
              </div>

              {searchMode === 'ai' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-2">
                    <label className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2 drop-shadow-sm">
                      <Sparkles size={16} className="text-[#29abe2]" /> 
                      Describe your lifestyle or needs
                    </label>
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="I need a safe SUV for a family of 5, mostly city driving, under $35k..."
                      className="w-full bg-white/70 border border-white/60 rounded-2xl p-4 text-[15px] font-medium text-slate-900 focus:ring-2 focus:ring-[#29abe2]/50 outline-none h-32 resize-none placeholder:text-slate-500 shadow-inner backdrop-blur-md transition-all"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-xs font-bold bg-red-100/80 p-2.5 rounded-lg flex items-start gap-2 backdrop-blur-md">
                      <Info size={14} className="shrink-0 mt-0.5" /> {error}
                    </div>
                  )}

                  <button 
                    onClick={handleAiSearch}
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Thinking...
                      </>
                    ) : (
                      'Find my car'
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-slate-700 font-medium mt-3 drop-shadow-sm">
                    Our AI will analyze your needs and search our live inventory to find the best matches.
                  </p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-800 font-bold text-sm mb-2 drop-shadow-sm">Make</label>
                      <select 
                        value={classicMake} onChange={(e) => setClassicMake(e.target.value)}
                        className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl p-3 text-[14px] font-semibold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all cursor-pointer"
                      >
                        <option value="">Any Make</option>
                        {availableMakes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-slate-800 font-bold text-sm mb-2 drop-shadow-sm">Model</label>
                      <select 
                        value={classicModel} onChange={(e) => setClassicModel(e.target.value)}
                        disabled={isModelsLoading || availableModels.length === 0}
                        className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl p-3 text-[14px] font-semibold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <option value="">{availableModels.length === 0 ? 'Select Make First' : 'Any Model'}</option>
                        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {isModelsLoading && (
                        <div className="absolute right-8 top-10">
                          <Loader2 className="animate-spin text-slate-400" size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-800 font-bold text-sm mb-2 drop-shadow-sm">Year</label>
                      <select 
                        value={classicYear} onChange={(e) => setClassicYear(e.target.value)}
                        className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl p-3 text-[14px] font-semibold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all cursor-pointer"
                      >
                        <option value="">Any Year</option>
                        {Array.from({ length: new Date().getFullYear() + 2 - 1900 }, (_, i) => new Date().getFullYear() + 1 - i).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-800 font-bold text-sm mb-2 drop-shadow-sm">Body Type</label>
                      <select 
                        value={classicBodyType} onChange={(e) => setClassicBodyType(e.target.value)}
                        className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl p-3 text-[14px] font-semibold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all cursor-pointer"
                      >
                        <option value="">Any Body Type</option>
                        {['SUV', 'Sedan', 'Pickup Truck', 'Coupe', 'Hatchback', 'Minivan'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 drop-shadow-sm">
                      <label className="text-slate-800 font-bold text-sm">Max Price</label>
                      <span className="text-[#29abe2] font-black">${classicMaxPrice.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" min="10000" max="100000" step="5000"
                      value={classicMaxPrice} onChange={(e) => setClassicMaxPrice(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
                    />
                  </div>
                  
                  <button 
                    onClick={handleClassicSearch}
                    className="w-full bg-[#29abe2] hover:bg-[#2089b5] text-white font-black py-3.5 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-[15px] mt-4"
                  >
                    Search Inventory
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center bg-white/30 rounded-2xl border border-white/40 shadow-inner">
               <h2 className="text-xl font-bold text-slate-900 mb-2 drop-shadow-sm">Ready to sell?</h2>
               <p className="text-slate-700 font-medium text-sm mb-6 max-w-[250px] mx-auto drop-shadow-sm">
                 Get an instant offer from dealerships near you.
               </p>
               <button 
                onClick={onSell}
                className="bg-[#29abe2] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2089b5] shadow-lg transition-colors"
               >
                  Get my offer
               </button>
            </div>
          )}
        </div>

        {/* Tagline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl text-center lg:text-left mt-8 lg:mt-0"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Same Data.<br className="hidden lg:inline" />Better Decisions.
          </h1>
        </motion.div>
      </div>

      {/* Sponsored Badge */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="bg-white/20 backdrop-blur-2xl rounded-[28px] p-5 border border-white/30 flex items-center gap-5 text-white max-w-[320px] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-2xl tracking-tighter">T</div>
          <div>
            <div className="text-[10px] opacity-80 font-black uppercase tracking-[0.15em] mb-1">Sponsored Innovation</div>
            <div className="text-lg font-black leading-tight mb-1 drop-shadow-md">2027 Toyota Camry</div>
            <div className="text-[11px] opacity-90 font-medium leading-relaxed">Everyday drives deserve everyday thrills. Explore the new Camry.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
