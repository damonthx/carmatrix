import React, { useState } from 'react';
import { 
  Sparkles, Award, Star, ShieldCheck, Zap, 
  ArrowRight, Users, CheckCircle2, Play, 
  Instagram, Youtube, Send, FileText
} from 'lucide-react';

export default function InfluencersPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    platform: 'youtube',
    handle: '',
    followers: '',
    link: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24 selection:bg-[#29abe2]/30">
      
      {/* Hero Section */}
      {/* [Design Element: Dark radial mesh background with high-contrast blue/indigo ambient glow] */}
      <div 
        className="relative pt-28 pb-36 px-4 text-center overflow-hidden border-b border-white/5"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% -20%, #1e3a8a 0%, #030712 100%)'
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Floating background blur circles for depth */}
        <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-36 right-1/4 w-80 h-80 rounded-full bg-[#29abe2]/5 blur-3xl"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* [Design Element: Liquid glass badge, highly reflective white border, semi-transparent backdrop] */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-350 text-[11px] font-extrabold tracking-widest uppercase mb-8 backdrop-blur-xl">
            <Sparkles size={13} className="text-[#29abe2]" /> Exclusive Creator Invitation
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] max-w-[1000px] mx-auto">
            Drive the Narrative. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] via-blue-400 to-[#63b3ed]">
              Own the Future of Auto.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 font-medium max-w-[700px] mx-auto mb-10 leading-relaxed">
            CarMatrix is merging AI diagnostics and blockchain authentication to build the ultimate trust-first automotive platform. We are looking for foundational creators to pilot our launch.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#apply-form" 
              className="inline-flex items-center gap-2 bg-[#29abe2] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2089b5] transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20 text-sm"
            >
              Request Partnership Access <ArrowRight size={16} />
            </a>
            <a 
              href="#value-prop" 
              className="px-8 py-4 rounded-full font-bold border border-white/10 hover:bg-white/5 transition-colors text-slate-300 text-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* The Value Proposition */}
      {/* [Design Element: Deep contrast dark grid with reflective container cards] */}
      <div id="value-prop" className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="text-center mb-16">
          <span className="text-[#29abe2] font-black text-xs uppercase tracking-widest">Co-Creators, Not Just Affiliates</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3 text-white">Why partner with CarMatrix?</h2>
          <div className="w-16 h-1 bg-[#29abe2] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Val Prop 1 */}
          {/* [Design Element: Dark glassmorphic card with a subtle top-light border highlight] */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group hover:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mb-6">
              <Zap size={22} className="text-[#29abe2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Institutional Monetization</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Earn premium, multi-tiered revenue splits on platform transactions. Receive recurring lifetime referral percentages on every digital vehicle passport certified by your audience.
            </p>
          </div>

          {/* Val Prop 2 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group hover:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mb-6">
              <Award size={22} className="text-[#29abe2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Foundational Authority</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Be established as a verified CarMatrix Automotive Advisor. Review and display your expert content badges directly on vehicle detail pages to drive high-conversion views to your channel.
            </p>
          </div>

          {/* Val Prop 3 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group hover:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mb-6">
              <ShieldCheck size={22} className="text-[#29abe2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Next-Gen Content Tools</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Utilize our private blockchain vehicle ledger and AI spec-diagnostic tools in your vlogs. Instantly scan VINs to uncover deep history details, generating unique hooks for your videos.
            </p>
          </div>

          {/* Val Prop 4 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group hover:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-500/20 flex items-center justify-center mb-6">
              <Users size={22} className="text-[#29abe2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elite Insider VIP Perks</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Receive all-expenses-paid invitations to high-profile automotive track days, private press launches, and exclusive preview events alongside top builders and industry insiders.
            </p>
          </div>

        </div>
      </div>

      {/* Partnership Tiers */}
      {/* [Design Element: Dark clean layout. Three premium columns showing levels of partnerships with glassy cards] */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="text-center mb-16">
          <span className="text-[#29abe2] font-black text-xs uppercase tracking-widest">Partnership Tiers</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 text-white">Select Your Alignment</h2>
          <div className="w-16 h-1 bg-[#29abe2] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tier 1 */}
          {/* [Design Element: Standard dark glass card] */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-8 shadow-2xl hover:border-white/10 transition-all flex flex-col justify-between">
            <div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Level 01</div>
              <h3 className="text-2xl font-black text-white mb-6">Brand Ambassador</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-8">
                Ideal for growing creators who want to represent the new standard of trust in car buying.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  [Insert Revenue Share %] on referrals
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Custom tracking dashboards
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Early platform feature access
                </li>
              </ul>
            </div>
            <a href="#apply-form" className="w-full text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl border border-white/10 text-xs transition-colors mt-auto">
              Request Tier Access
            </a>
          </div>

          {/* Tier 2 (Highlighted) */}
          {/* [Design Element: Highly detailed reflective liquid glass card, thicker border, bright accent top glow] */}
          <div className="bg-gradient-to-b from-blue-900/20 to-slate-950 border-2 border-[#29abe2]/45 rounded-[28px] p-8 shadow-[0_20px_50px_rgba(41,171,226,0.1)] hover:border-[#29abe2]/70 transition-all flex flex-col justify-between relative transform -translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#29abe2] text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Most Selected
            </div>
            <div>
              <div className="text-[#29abe2] font-black text-xs uppercase tracking-widest mb-1">Level 02</div>
              <h3 className="text-2xl font-black text-white mb-6">Content Partner</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-8">
                Designed for active auto reviewers, vloggers, and technical writers with established audiences.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  [Insert Revenue Share %] premium split
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Embed content on vehicle pages
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  [Insert Exclusive Event Access] invites
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Complimentary AI diagnostics API
                </li>
              </ul>
            </div>
            <a href="#apply-form" className="w-full text-center bg-[#29abe2] hover:bg-[#2089b5] text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-xs transition-colors mt-auto">
              Request Tier Access
            </a>
          </div>

          {/* Tier 3 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-8 shadow-2xl hover:border-white/10 transition-all flex flex-col justify-between">
            <div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Level 03</div>
              <h3 className="text-2xl font-black text-white mb-6">Strategic Advisor</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-8">
                For top-tier media voices and key opinion leaders shaping the automotive landscape.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Custom corporate advisory splits
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Direct product council roadmap vote
                </li>
                <li className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 size={16} className="text-[#29abe2] shrink-0" />
                  Founding member blockchain tokens
                </li>
              </ul>
            </div>
            <a href="#apply-form" className="w-full text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl border border-white/10 text-xs transition-colors mt-auto">
              Request Tier Access
            </a>
          </div>

        </div>
      </div>

      {/* Profile & Mock Testimonial Section */}
      <div className="max-w-[1100px] mx-auto px-4 mt-28">
        <div className="bg-[#0b0f19] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            
            {/* Left Column - Ideal Profile */}
            <div className="w-full lg:w-1/2">
              <span className="text-[#29abe2] font-black text-xs uppercase tracking-widest">Alignment Profile</span>
              <h2 className="text-3xl font-black text-white mt-2 mb-6">Who we're looking for</h2>
              <p className="text-slate-450 font-medium text-sm leading-relaxed mb-6">
                CarMatrix creators are objective, technically curious, and highly valued by their audiences. We partner with:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-900/30 p-1.5 rounded-lg border border-blue-500/25 shrink-0 mt-0.5"><Users size={14} className="text-[#29abe2]"/></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Engaged Auto Reviewers</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5">Creators reviewing builds, specs, and testing real-world limits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-900/30 p-1.5 rounded-lg border border-blue-500/25 shrink-0 mt-0.5"><Play size={14} className="text-[#29abe2]"/></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Tech & Finance Vloggers</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5">Explaining automotive cost metrics, trade-ins, and finance options.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Partner Testimonial Placeholder */}
            {/* [Design Element: Glowing mockup placeholder for a video review or creator interview] */}
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-center items-center group shadow-xl">
                {/* Visual guideline overlay to look like a placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-black/80"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 filter blur-[2px]"></div>
                
                <div className="relative z-10 text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-[#29abe2]/15 border border-[#29abe2] flex items-center justify-center mx-auto mb-4 cursor-pointer group-hover:scale-105 transition-transform duration-300">
                    <Play size={20} className="text-[#29abe2] fill-current ml-1" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">[Creator Testimonial Video]</h4>
                  <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                    "Partnering with CarMatrix added incredible transparency to my builds and unlocked massive revenue streams."
                  </p>
                  <span className="inline-block mt-3 text-[10px] font-black uppercase text-[#29abe2] tracking-wider">@AutomotiveVlogs (450k Subs)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Application Form Section */}
      <div id="apply-form" className="max-w-[850px] mx-auto px-4 mt-28">
        <div className="bg-[#0b0f19] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Join the CarMatrix Network</h2>
            <p className="text-slate-450 font-semibold text-xs mt-1">Submit your partnership credentials below. Access is strictly limited.</p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-blue-950/20 border border-[#29abe2]/20 rounded-2xl p-6 flex flex-col items-center">
              <CheckCircle2 size={48} className="text-[#29abe2] mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Application Received!</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">Thank you. Our partnership relations team will audit your channel and email you in 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white"
                    placeholder="Alex Mercer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Main Platform</label>
                  <div className="relative">
                    <select 
                      value={formData.platform}
                      onChange={e => setFormData({...formData, platform: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white appearance-none cursor-pointer"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="other">Blog / Media Outlet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Channel Handle</label>
                  <input 
                    type="text" 
                    required
                    value={formData.handle}
                    onChange={e => setFormData({...formData, handle: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white"
                    placeholder="@ApexAutoVlogs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Estimated Follower Count</label>
                  <input 
                    type="text" 
                    required
                    value={formData.followers}
                    onChange={e => setFormData({...formData, followers: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white"
                    placeholder="250,000+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Link to Your Content</label>
                <input 
                  type="url" 
                  required
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white"
                  placeholder="https://youtube.com/c/ApexAutoVlogs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wide">Why do you fit the CarMatrix brand?</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-xs outline-none focus:bg-slate-900 focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all text-white resize-none"
                  placeholder="Describe your audience niche and why you support radical trust in auto..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#29abe2] hover:bg-[#2089b5] text-white py-4 rounded-xl font-black transition-all text-xs shadow-lg shadow-blue-500/10 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Send size={14} /> Submit Application Request
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
