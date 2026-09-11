import React from 'react';
import { Mic, Mail, Building } from 'lucide-react';

export default function PublicRelationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <Mic size={14} /> Public Relations
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Media Inquiries & PR
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          For journalists, analysts, and media professionals looking to connect with the CarMatrix communications team.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto px-4">
        <div className="light-glass-card rounded-[32px] p-8 md:p-12 shadow-xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Get in touch</h2>
              <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                If you are a member of the media and would like to request an interview, more information about our platform, or a statement from our executive team, please reach out to our dedicated PR desk.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Email</p>
                    <a href="mailto:contact@car-meta.com" className="text-lg font-bold text-slate-900 hover:text-[#29abe2] transition-colors">contact@car-meta.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Building size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Headquarters</p>
                    <p className="text-lg font-bold text-slate-900 leading-snug">
                      123 Innovation Drive<br/>
                      Dallas, TX
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Direct Inquiry</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Name</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Publication / Outlet</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all" placeholder="Tech Crunch" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Inquiry Details</label>
                  <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full bg-[#29abe2] text-white py-3 rounded-xl font-bold hover:bg-[#2089b5] transition-colors">
                  Submit Inquiry
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
