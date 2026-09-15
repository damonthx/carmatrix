import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Cpu, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { queryAutomotiveKnowledgeEngine } from '../../utils/automotiveKnowledgeEngine';

const PRESET_PROMPTS = [
  'Best reliable compact SUV under $28,000 with AWD and low maintenance',
  'What hidden mechanical issues to check on a 2020 BMW 330i with 55k miles?',
  'Give me 5 practical negotiation scripts to waive dealer doc fees',
  'Ford F-150 vs. Silverado 1500 vs. Ram 1500: Reliability and transmission gotchas',
  'Lease vs Finance: How to avoid the 72-month loan trap and dealer markup',
  'Used Tesla Model 3 under $25,000: How to qualify for the $4,000 EV Tax Credit'
];

export default function AIAdvisorWidget() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async (queryText?: string) => {
    const textToRun = queryText || prompt;
    if (!textToRun.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
        (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
      
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'You are the CarMatrix Automotive Knowledge Engine. The user is asking: "' + textToRun + '". ' +
            'Provide a clear, structured, actionable response formatted in concise markdown with: ' +
            '1. Top Vehicle Recommendations or Direct Answer\n' +
            '2. Fair Market Price Range & Ownership Cost Watchouts\n' +
            '3. Key Inspection / Reliability Gotchas\n' +
            '4. Dealer Negotiation Tip.\n' +
            'Keep it practical, highly readable, and buyer-friendly.'
        });
        setResponse(res.text || queryAutomotiveKnowledgeEngine(textToRun));
      } else {
        // Fast, high-accuracy offline automotive knowledge engine
        const answer = queryAutomotiveKnowledgeEngine(textToRun);
        setResponse(answer);
      }
    } catch (err) {
      console.warn('Live API query fallback to Automotive Knowledge Engine:', err);
      setResponse(queryAutomotiveKnowledgeEngine(textToRun));
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#29abe2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#29abe2]/15 border border-[#29abe2]/30 rounded-full text-[#29abe2] text-xs font-bold mb-2">
              <Cpu size={14} />
              <span>Consumer Intelligence System</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Automotive Knowledge Engine</h3>
            <p className="text-slate-400 text-sm mt-1">Instant expert vehicle benchmarks, mechanical watchouts, pricing sanity checks, and dealer negotiation scripts.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery();
            }}
            className="relative"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything: e.g. BMW 330i reliability at 55k miles, waiving dealer doc fees, F-150 transmission gotchas..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 focus:border-[#29abe2] transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#29abe2] hover:bg-[#2089b5] text-white p-2 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(p);
                  handleQuery(p);
                }}
                className="text-[11px] font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-1.5 transition-all text-left cursor-pointer hover:text-white"
              >
                {"💡 " + p}
              </button>
            ))}
          </div>

          {response && (
            <div className="mt-6 p-6 md:p-8 bg-slate-800/70 border border-slate-700/80 rounded-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-cyan-400">
                <Cpu size={16} />
                <span>CarMatrix Automotive Knowledge Engine</span>
              </div>
              <div className="text-slate-200 text-xs leading-relaxed space-y-1.5">
                {response.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={i} className="h-1.5" />;
                  if (trimmed.startsWith('###')) {
                    return (
                      <h4 key={i} className="text-base font-extrabold text-white mt-4 mb-2 flex items-center gap-2 border-b border-slate-700/60 pb-2">
                        {trimmed.replace(/^###\s*/, '')}
                      </h4>
                    );
                  }
                  if (/^\d+\.\s+\*\*/.test(trimmed) || (trimmed.startsWith('**') && trimmed.endsWith('**'))) {
                    return (
                      <p key={i} className="font-extrabold text-sm text-[#29abe2] mt-3 mb-1">
                        {renderFormattedText(trimmed)}
                      </p>
                    );
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                      <li key={i} className="ml-4 list-disc text-slate-300 my-1 leading-relaxed pl-1">
                        {renderFormattedText(trimmed.replace(/^[-*]\s+/, ''))}
                      </li>
                    );
                  }
                  if (/^\d+\.\s+/.test(trimmed)) {
                    return (
                      <div key={i} className="text-slate-200 my-1.5 pl-3 border-l-2 border-[#29abe2]/50 bg-slate-800/50 p-2.5 rounded-r-xl font-medium text-xs leading-relaxed">
                        {renderFormattedText(trimmed)}
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-slate-300 my-1 leading-relaxed">
                      {renderFormattedText(trimmed)}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
