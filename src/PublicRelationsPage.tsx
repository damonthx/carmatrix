import React, { useState } from 'react';
import { Mic, Mail, Building, CheckCircle2 } from 'lucide-react';

export default function PublicRelationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', publication: '', details: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <Mic size={14} /> Public Relations & Press
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Media Inquiries & PR
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          For journalists, automotive analysts, and industry professionals looking to connect with CarMatrix editorial communications.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto px-4">
        <div className="light-glass-card rounded-[32px] p-8 md:p-12 shadow-xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Get in touch</h2>
              <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                If you are a member of the media and would like to request an interview, automotive market pulse data citations, or executive commentary, our communications team responds within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Press Email</p>
                    <a href="mailto:press@carmatrix.online" className="text-base font-bold text-slate-900 hover:text-[#29abe2] transition-colors">press@carmatrix.online</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Building size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Publishing Entity</p>
                    <p className="text-base font-bold text-slate-900 leading-snug">
                      Defiant Digital Holdings LLC<br/>
                      <span className="text-sm font-normal text-slate-500">Dallas-Fort Worth Metroplex, Texas</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Direct Media Inquiry</h3>
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900">Inquiry Transmitted</h4>
                  <p className="text-xs text-slate-500">Thank you. Our communications team will respond directly to your newsroom.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Publication / Media Outlet</label>
                    <input 
                      type="text" 
                      value={formData.publication}
                      onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all" 
                      placeholder="Automotive News / Bloomberg / etc." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Inquiry Details</label>
                    <textarea 
                      rows={4} 
                      required
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#29abe2] focus:ring-1 focus:ring-[#29abe2] transition-all resize-none" 
                      placeholder="Deadline, questions, or specific automotive data needed..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-[#29abe2] text-white py-3 rounded-xl font-bold hover:bg-[#2089b5] transition-colors cursor-pointer"
                  >
                    Submit Media Request
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
