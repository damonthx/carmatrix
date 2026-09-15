import React, { useState } from 'react';
import { Mail, Clock, MapPin, MessageSquare, Briefcase, Globe, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      {/* Hero Section */}
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <MessageSquare size={14} /> Contact & Support
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          We'd love to hear from you
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[650px] mx-auto leading-relaxed">
          Have questions about our research tools, data methodology, or partner programs? Our editorial and support team is here to assist.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h2>
          <p className="text-sm text-slate-500 mb-8">Our team responds to all consumer and partner inquiries within 24 business hours.</p>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 my-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900">Message Received!</h3>
              <p className="text-sm text-emerald-700 max-w-sm mx-auto">
                Thank you, <span className="font-semibold">{formData.firstName || 'there'}</span>. A member of our support desk has received your request and will reach out to <span className="font-semibold">{formData.email}</span> shortly.
              </p>
              <button 
                onClick={() => { setFormSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', topic: 'General Inquiry', message: '' }); }}
                className="mt-4 px-6 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" 
                    placeholder="Jane" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" 
                    placeholder="Doe" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" 
                  placeholder="jane@example.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Topic</label>
                <div className="relative">
                  <select 
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Research Tools & Data Support</option>
                    <option>Affiliate & Commercial Partnerships</option>
                    <option>Editorial & Corrections</option>
                    <option>Press & Media</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Globe size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Message</label>
                <textarea 
                  rows={5} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all resize-none" 
                  placeholder="How can our automotive research desk assist you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#29abe2] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2089b5] transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Verified Entity */}
        <div className="space-y-8">
          {/* Support Channels */}
          <div className="light-glass-card rounded-[24px] p-6 md:p-8 border border-white/60 bg-white/60 backdrop-blur-md">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Direct Support Channels</h3>
            <div className="space-y-6">
              {/* Email Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[#29abe2]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Consumer Help Desk</h4>
                  <p className="text-xs text-slate-500 mb-1">Direct inquiries & technical feedback</p>
                  <a href="mailto:support@carmatrix.online" className="text-sm md:text-base font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors break-all">support@carmatrix.online</a>
                </div>
              </div>

              {/* Hours / Response Commitment */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#29abe2]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Support Hours</h4>
                  <p className="text-xs text-slate-500 mb-1">Monday – Friday: 8:00 AM – 6:00 PM CST</p>
                  <p className="text-xs text-slate-600 font-medium">Guaranteed response within 1 business day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Directory */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Department Directory</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Briefcase size={20} className="text-slate-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Commercial & Affiliate Partnerships</h4>
                  <a href="mailto:support@carmatrix.online" className="text-sm font-semibold text-[#29abe2] hover:underline">support@carmatrix.online</a>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="flex items-start gap-4">
                <MessageSquare size={20} className="text-slate-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Press & Editorial Relations</h4>
                  <p className="text-xs text-slate-500 mb-1">Media requests & market data citations</p>
                  <a href="mailto:dperry@carmatrix.online" className="text-sm font-semibold text-[#29abe2] hover:underline">dperry@carmatrix.online</a>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Entity & Office */}
          <div className="bg-slate-900 text-white rounded-[24px] p-8 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#29abe2]">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Publishing Entity</h3>
                <p className="text-xs text-slate-400">Defiant Digital Holdings LLC</p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div>
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Operations & Editorial Office</p>
                <p className="font-medium text-slate-200 mt-0.5">Plano, TX</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
