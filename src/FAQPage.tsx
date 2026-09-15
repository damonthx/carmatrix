import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Mail, Search, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQPageProps {
  onNavigate?: (path: string) => void;
}

export default function FAQPage({ onNavigate }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Research Tools', 'Data & Recalls', 'Affiliate & Pricing', 'Consumer Rights'];

  const faqs = [
    {
      category: 'Research Tools',
      question: 'How does the Automotive Knowledge Engine work?',
      answer: 'Our Automotive Knowledge Engine runs on specialized AI models trained on institutional vehicle specifications, historical depreciation curves, and dealer negotiation tactics. You can ask complex multi-variable questions—such as comparing hybrid battery warranties, analyzing out-the-door lease fees, or understanding real-world maintenance costs.'
    },
    {
      category: 'Research Tools',
      question: 'How does the Dealer Quote Auditor identify junk fees?',
      answer: 'The Auditor cross-references each line item on your dealer buyer’s order against statutory 50-state caps (like document fees) and flags questionable dealer-installed accessories (such as nitrogen tires, paint sealant, etch protection, or reconditioning fees) with recommended negotiation counter-language.'
    },
    {
      category: 'Data & Recalls',
      question: 'Where does CarMatrix source vehicle safety recalls?',
      answer: 'All recall information, safety bulletins, and factory specifications are fetched directly from the United States National Highway Traffic Safety Administration (NHTSA) VPIC databases. We present open safety campaigns cleanly without alteration or dealer filtering.'
    },
    {
      category: 'Research Tools',
      question: 'How is the 5-Year Total Cost of Ownership (TCO) calculated?',
      answer: 'Our TCO engine combines regional fuel economy averages, state-specific insurance rate indexes, actuarial maintenance schedules, financing interest projections, and algorithmic depreciation curves to give you the true financial impact of owning a vehicle beyond the sticker price.'
    },
    {
      category: 'Affiliate & Pricing',
      question: 'Is CarMatrix 100% free for consumers?',
      answer: 'Yes. All calculators, VIN decoders, audit widgets, market pulse indices, and knowledge engine queries are completely free to car shoppers without paywalls or subscriptions.'
    },
    {
      category: 'Affiliate & Pricing',
      question: 'How does CarMatrix support its platform without charging users?',
      answer: 'In compliance with FTC guidelines, we maintain transparent affiliate and referral partnerships with verified automotive service providers (such as pre-qualification lenders, insurance comparison platforms, and inspection networks). When you choose to use our partners, we may earn a referral fee at zero additional cost to you. This compensation never influences our calculations or algorithmic scores.'
    },
    {
      category: 'Consumer Rights',
      question: 'Can dealers legally force me to pay non-statutory doc fees?',
      answer: 'Documentation fees are regulated on a state-by-state level. Over a dozen states mandate strict statutory doc fee caps, while in unregulated states, dealers can charge whatever they choose. Our State Doc Fee Guide provides state-by-state legal caps and step-by-step strategies for negotiating excessive dealer fees.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      <div className="max-w-[800px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <HelpCircle size={14} /> Knowledge Base & FAQ
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          Learn how our institutional research tools, valuation models, and consumer advocacy platform operate.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-[600px] mx-auto mt-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search questions, doc fees, TCO formulas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-6 text-base md:text-lg outline-none focus:ring-4 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar Categories */}
        <div className="md:col-span-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Categories</h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat}>
                <button 
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-[#29abe2] text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ Accordion */}
        <div className="md:col-span-9">
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100">
                <p className="text-slate-500 font-medium">No results found for "{searchQuery}".</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden transition-all hover:shadow-md">
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-bold text-base md:text-lg text-slate-900 pr-8">{faq.question}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[#29abe2] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <ChevronDown size={18} className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-2 text-sm md:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 light-glass-card rounded-[32px] p-8 text-center border border-white/60 bg-gradient-to-br from-blue-50 to-white backdrop-blur-md">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Still have questions?</h3>
            <p className="text-slate-600 font-medium mb-6">Our research desk and consumer support team are available to help you navigate your vehicle purchase.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => onNavigate ? onNavigate('contact') : window.location.href = 'mailto:support@carmatrix.online'}
                className="flex items-center justify-center gap-2 bg-[#29abe2] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2089b5] transition-colors cursor-pointer"
              >
                <MessageCircle size={18} /> Contact Support Desk
              </button>
              <a 
                href="mailto:support@carmatrix.online" 
                className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <Mail size={18} /> Email support@carmatrix.online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
