import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, Users, CheckCircle2, 
  MessageSquare, Download, ArrowRight, Shield, 
  Activity, Star, Mail, Phone, Building, MapPin, 
  CheckCircle, ArrowUpRight, AlertCircle
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function DealersPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dealershipName: '',
    zipCode: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('dealer_inquiries')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dealership_name: formData.dealershipName,
            zip_code: formData.zipCode,
            status: 'pending'
          }
        ]);

      if (submitError) throw submitError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Section */}
      <div 
        className="relative bg-black pt-20 pb-28 px-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% -20%, #1a365d 0%, #000000 100%)'
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15 mix-blend-overlay"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            <Activity size={14} className="text-[#29abe2]" /> CarMatrix for Dealers
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] max-w-[900px] mx-auto">
            More shoppers. <span className="text-[#29abe2]">More intelligence.</span> More sales.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-[750px] mx-auto mb-10 leading-relaxed">
            Reaching the largest audience of ready-to-buy automotive shoppers is just the start. Fuel your dealership's growth with CarMatrix's AI-driven platform.
          </p>
          <a 
            href="#inquiry-form" 
            className="inline-flex items-center gap-2 bg-[#29abe2] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2089b5] shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            Get Started Today <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Live Intelligence Stats Block */}
      <div className="max-w-[1100px] mx-auto px-4 -mt-16 relative z-20">
        <div className="light-glass-card rounded-[32px] p-8 md:p-12 shadow-2xl backdrop-blur-xl border border-white/60 bg-white/80">
          
          {/* Dynamic Valuation Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-b border-slate-100 pb-12">
            
            {/* Car 1 */}
            <div className="bg-white/50 border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:bg-white transition-all group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">2021 Volvo XC40</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Acquired
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">$32,583</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">CarMatrix Instant Offer Valuation</div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=400&q=80" 
                alt="Volvo XC40" 
                className="w-full h-32 object-contain mt-6 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Car 2 */}
            <div className="bg-white/50 border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:bg-white transition-all group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">2022 Ford F-150</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-[#29abe2]/10 text-[#29abe2] px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#29abe2] animate-pulse"></span>
                    Active
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">$39,950</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">Live Marketplace Listing Price</div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=400&q=80" 
                alt="Ford F-150" 
                className="w-full h-32 object-contain mt-6 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Car 3 */}
            <div className="bg-white/50 border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:bg-white transition-all group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">2019 Volvo XC40</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-slate-100 text-slate-650 px-2.5 py-1 rounded-full">
                    Sold
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">$29,867</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">Transaction Settled via Partner Portal</div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80" 
                alt="Volvo XC40 Sold" 
                className="w-full h-32 object-contain mt-6 group-hover:scale-105 transition-transform duration-300 filter grayscale-[20%]"
              />
            </div>

          </div>

          {/* Key ROI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#29abe2] tracking-tighter">44.3M</div>
              <h4 className="text-sm font-bold text-slate-800 mt-2">Active Shoppers Monthly</h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold max-w-[250px] mx-auto">Connecting you directly to high-intent buyers looking to lock in deals.</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">#1 ROI</div>
              <h4 className="text-sm font-bold text-slate-800 mt-2">Valued Partner Returns</h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold max-w-[250px] mx-auto">Outperforming legacy listing sites in lead conversion and cost per sale.</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#29abe2] tracking-tighter">53%</div>
              <h4 className="text-sm font-bold text-slate-800 mt-2">More Vehicle Views</h4>
              <p className="text-xs text-slate-500 mt-1 font-semibold max-w-[250px] mx-auto">Boosted search presence and AI-driven match recommendations.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Solutions to fuel your growth and success</h2>
          <p className="text-slate-600 font-medium text-sm mt-3">CarMatrix is here to help your dealership find success at every step of the lifecycle.</p>
          <div className="w-16 h-1 bg-[#29abe2] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solution 1 */}
          <div className="light-glass rounded-[24px] p-6 hover:bg-white/80 transition-all flex flex-col justify-between shadow-sm group">
            <div>
              <div className="rounded-2xl overflow-hidden h-[180px] mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80" 
                  alt="Inventory Solutions" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inventory</h3>
              <p className="text-slate-650 text-[13px] font-medium leading-relaxed mb-6">
                List your inventory directly into our high-performance marketplace. Streamline syndication, ensure accurate spec mapping, and optimize listings for maximum visibility.
              </p>
            </div>
            <a href="#inquiry-form" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors">
              Explore Inventory Packages <ArrowRight size={14} />
            </a>
          </div>

          {/* Solution 2 */}
          <div className="light-glass rounded-[24px] p-6 hover:bg-white/80 transition-all flex flex-col justify-between shadow-sm group">
            <div>
              <div className="rounded-2xl overflow-hidden h-[180px] mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80" 
                  alt="Marketing Solutions" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Marketing</h3>
              <p className="text-slate-650 text-[13px] font-medium leading-relaxed mb-6">
                Target in-market shoppers with pinpoint precision. Access exclusive advertising slots, AI-driven retargeting campaigns, and native sponsorship placements.
              </p>
            </div>
            <a href="#inquiry-form" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors">
              View Marketing Solutions <ArrowRight size={14} />
            </a>
          </div>

          {/* Solution 3 */}
          <div className="light-glass rounded-[24px] p-6 hover:bg-white/80 transition-all flex flex-col justify-between shadow-sm group">
            <div>
              <div className="rounded-2xl overflow-hidden h-[180px] mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80" 
                  alt="Conversion Solutions" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Conversion</h3>
              <p className="text-slate-650 text-[13px] font-medium leading-relaxed mb-6">
                Turn clicks into customers. Seamlessly integrate digital retailing tools, accept online finance pre-qualifications, and capture verified cash trade-in offers.
              </p>
            </div>
            <a href="#inquiry-form" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors">
              Learn About Retail Tools <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Insight Section (Data to Sales Dashboard Mockup) */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="light-glass-card rounded-[32px] p-8 md:p-12 border border-white/60 bg-white/75 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Dashboard Mockup Graphics */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-xl bg-slate-950">
                {/* Simulated App Header */}
                <div className="h-8 bg-slate-900 flex items-center px-4 gap-1.5 border-b border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] text-slate-500 font-bold ml-4">CarMatrix Partner Portal - Insights Dashboard</span>
                </div>
                {/* Screenshot Image representing turn times, margins, charts */}
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                  alt="Analytics Dashboard Mockup" 
                  className="w-full h-auto object-cover max-h-[350px] opacity-90"
                />
                <div className="absolute bottom-6 left-6 right-6 light-glass-card p-4 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/90 border border-slate-200 shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-800 font-bold">Drive faster turn time and improved margins</span>
                    <span className="text-[#29abe2] font-black">+14.2%</span>
                  </div>
                  <p className="text-slate-500 text-[10px]">Real-time regional demand analytics optimized for your inventory layout.</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4">
                <BarChart3 size={12} /> Regional Intelligence
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Turn data into sales.
              </h2>
              <p className="text-[#0f1111] font-medium text-base mb-6 leading-relaxed">
                Stay ahead of the curve. Access granular regional pricing, search query volumes, and local trade demand reports dynamically driven by our AI analytical engine.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  "Real-time market velocity pricing indexes",
                  "Local trade-in acquisition predictive pipelines",
                  "AI match propensity rating for every listed vehicle"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[14px] font-semibold text-slate-700">
                    <CheckCircle2 size={16} className="text-[#29abe2]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a 
                href="#inquiry-form" 
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all text-sm"
              >
                Request Access to Insights <ArrowUpRight size={14} />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Partners in your success</h2>
          <p className="text-slate-500 font-semibold text-xs mt-1">Hear what our dealership network partners say about us.</p>
        </div>

        <div className="bg-[#1a365d] rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="max-w-[800px] mx-auto relative z-10">
            <div className="flex justify-center gap-1 text-amber-400 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" stroke="none" />)}
            </div>
            <p className="text-xl md:text-2xl font-bold leading-relaxed italic mb-8">
              "CarMatrix has been the best investment for our dealership! The lead quality from the AI Matchmaker is exceptional, their support team is amazing, and their real-time market data lets us price vehicles with absolute confidence."
            </p>
            <div className="font-extrabold text-lg text-white">Kevin Wood</div>
            <div className="text-slate-300 text-xs font-semibold mt-0.5">Director of Operations • Apex Automotive</div>
          </div>
        </div>
      </div>

      {/* Featured Insights Block */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Featured Insights</h2>
            <p className="text-slate-500 font-semibold text-xs mt-1">Deep dives, whitepapers, and guides for dealership communications.</p>
          </div>
          <a href="#" className="text-xs font-bold text-slate-900 underline underline-offset-[3px] hover:text-[#29abe2] transition-colors">
            View All Reports
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "CarMatrix Dealer Intelligence Report: Q2 2026",
              category: "Industry Report",
              image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Cybersecurity & Incident Best Practices for Auto Retail",
              category: "Compliance & Security",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Q2 Used Vehicle Price Index and Valuation Swings",
              category: "Market Index",
              image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "Digital Finance Retail Integration: Maximizing Closings",
              category: "Finance & Strategy",
              image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80"
            }
          ].map((item, idx) => (
            <div key={idx} className="cursor-pointer group bg-white border border-slate-100 hover:border-slate-200 rounded-[20px] p-2 hover:shadow-lg transition-all">
              <div className="rounded-[16px] overflow-hidden h-[130px] mb-4 relative bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>
              <div className="px-2 pb-3">
                <span className="text-[10px] font-black uppercase text-[#29abe2] tracking-wider">{item.category}</span>
                <h4 className="font-extrabold text-[13px] text-slate-900 leading-snug mt-1 group-hover:underline underline-offset-2">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sell More Cars Request Form */}
      <div id="inquiry-form" className="max-w-[900px] mx-auto px-4 mt-28">
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-2/5">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Sell more cars with CarMatrix</h2>
            <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6">
              Let us help you connect with high-intent shoppers, streamline transactions, and maximize your profitability.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 font-semibold text-xs">
                <Shield size={16} className="text-[#29abe2]" /> Zero long-term lock-in contracts
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-semibold text-xs">
                <Users size={16} className="text-[#29abe2]" /> Access 40M+ monthly shoppers
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-semibold text-xs">
                <TrendingUp size={16} className="text-[#29abe2]" /> Maximize lead conversions
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            {submitted ? (
              <div className="text-center py-10 bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col items-center">
                <CheckCircle size={48} className="text-emerald-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-900 mb-1">Inquiry Submitted!</h3>
                <p className="text-slate-600 font-semibold text-sm">Thank you for your interest. A CarMatrix Partnerships manager will reach out within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold mb-4">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Business Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="jane@apexauto.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dealership Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.dealershipName}
                      onChange={e => setFormData({...formData, dealershipName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="Apex Automotive Group"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ZIP Code</label>
                    <input 
                      type="text" 
                      required
                      value={formData.zipCode}
                      onChange={e => setFormData({...formData, zipCode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all"
                      placeholder="78701"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#29abe2] hover:bg-[#2089b5] text-white py-3.5 rounded-xl font-bold transition-all text-xs shadow-md mt-4 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting request...' : 'Submit Partnership Request'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
