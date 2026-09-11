import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, PhoneCall, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Buying', 'Selling', 'Financing', 'Account'];

  const faqs = [
    {
      category: 'Buying',
      question: 'How does the AI Matchmaker work?',
      answer: 'Our AI Matchmaker uses advanced natural language processing to understand your unique lifestyle needs, budget constraints, and preferences. It then cross-references our comprehensive database of vehicles to recommend the perfect matches, explaining exactly why each car was chosen.'
    },
    {
      category: 'Buying',
      question: 'Are the prices shown on CarMatrix negotiable?',
      answer: 'The prices listed on CarMatrix are set directly by the dealers or private sellers. While CarMatrix focuses on radical transparency to ensure you see fair market value upfront, the final price is negotiated between you and the seller.'
    },
    {
      category: 'Selling',
      question: 'How much does it cost to list my car on CarMatrix?',
      answer: 'Basic listings for private sellers are completely free. We also offer premium listing options that boost your vehicles visibility and provide detailed analytics on buyer engagement for a small flat fee.'
    },
    {
      category: 'Selling',
      question: 'How do you calculate the estimated trade-in value?',
      answer: 'We use real-time market data, including recent sales of similar vehicles in your area, auction data, and depreciation curves, to calculate a highly accurate trade-in estimate. This ensures you know exactly what your car is worth before stepping onto a lot.'
    },
    {
      category: 'Financing',
      question: 'Does getting pre-qualified affect my credit score?',
      answer: 'No. Getting pre-qualified through CarMatrix uses a "soft pull" on your credit report, which does not impact your credit score. A "hard pull" will only occur when you formally apply for the loan with the lender.'
    },
    {
      category: 'Account',
      question: 'How do I save a vehicle to my favorites?',
      answer: 'Simply click the heart icon on any vehicle listing. The car will be saved to your dashboard where you can track its price history, compare it side-by-side with other favorites, and receive alerts if the price drops.'
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
          <HelpCircle size={14} /> Knowledge Base
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          How can we help?
        </h1>
        
        {/* Search Bar */}
        <div className="relative max-w-[600px] mx-auto mt-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-6 text-lg outline-none focus:ring-4 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all shadow-sm"
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
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
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
                <p className="text-slate-500 font-medium">No results found for your search.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden transition-all hover:shadow-md">
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-lg text-slate-900 pr-8">{faq.question}</span>
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
                        <div className="px-6 pb-6 pt-2 text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-2">
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
            <p className="text-slate-600 font-medium mb-6">Our support team is ready to help you navigate your car buying journey.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-[#29abe2] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2089b5] transition-colors">
                <MessageCircle size={18} /> Chat with Support
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-sm">
                <PhoneCall size={18} /> Call Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
