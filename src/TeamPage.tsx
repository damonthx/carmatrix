import React from 'react';
import { Users, Shield, Award, Cpu, BarChart3, Mail } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Damon Perry',
      role: 'Founder & Creative Technologist',
      initials: 'DP',
      bio: 'The creative technologist behind CarMatrix. Focused on empowering buyers to get the best deal they can, without getting taken advantage of by unscrupulous salesmen and dealership practices. An ex-Turo business owner, he has friends and family in the industry and understands the way they operate. This platform gives real-time data and advice from industry insiders and experts.',
      badges: ['Creative Technologist', 'Automotive AI', 'Executive']
    },
    {
      name: 'Automotive Intelligence Desk',
      role: 'Quantitative Valuation & Market Pulse',
      initials: 'CM',
      bio: 'Specialized analysts tracking national wholesale auto auction indices, BLS CPI automotive metrics, statutory doc fee caps, and depreciation modeling across all 50 states.',
      badges: ['Data Science', 'Market Analytics', '50-State Audit']
    },
    {
      name: 'Consumer Advocacy & Compliance',
      role: 'Editorial Standards & Regulatory Integrity',
      initials: 'CA',
      bio: 'Ensuring 100% adherence to FTC 16 CFR Part 255 endorsement guidelines, strict separation between commercial affiliate partnerships and editorial algorithmic valuations.',
      badges: ['FTC Compliance', 'Consumer Advocacy', 'Editorial']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      {/* Header */}
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <Users size={14} /> Leadership & Editorial Staff
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          The minds behind CarMatrix
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[720px] mx-auto leading-relaxed">
          The combination of a Creative Technologist, custom AI Agents, automotive market analysts, and consumer advocates committed to bringing total transparency to vehicle shopping.
        </p>
      </div>

      {/* Team Grid */}
      <div className="max-w-[1100px] mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-[28px] p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#29abe2] to-sky-700 flex items-center justify-center text-white font-black text-2xl mb-6 shadow-md shadow-sky-500/20">
                  {member.initials}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-slate-500 mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  {member.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                {member.badges.map((badge, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Principles & Independence */}
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-[700px] relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#29abe2] text-xs font-bold tracking-widest uppercase">
              <Shield size={14} /> Editorial Independence
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Our pledge of radical consumer transparency
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              CarMatrix was built to level the playing field between car dealers and everyday buyers. Our tools—from the Junk Fee Auditor to our 5-Year TCO Calculators—are driven strictly by public regulatory data, Bureau of Labor Statistics indices, and mathematically rigorous valuation formulas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[#29abe2] font-bold text-lg mb-1 flex items-center gap-1.5">
                  <Award size={18} /> Zero Payola
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Dealers cannot pay to alter safety recall results or hide junk fees.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[#29abe2] font-bold text-lg mb-1 flex items-center gap-1.5">
                  <Cpu size={18} /> Algorithmic
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  All calculations run on transparent, open mathematical models.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[#29abe2] font-bold text-lg mb-1 flex items-center gap-1.5">
                  <BarChart3 size={18} /> Live Data
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Direct NHTSA VPIC feeds and verified statistical trends.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
              <span>Have editorial feedback or corrections?</span>
              <a href="mailto:support@carmatrix.online" className="text-[#29abe2] font-semibold flex items-center gap-1.5 hover:underline">
                <Mail size={14} /> support@carmatrix.online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
