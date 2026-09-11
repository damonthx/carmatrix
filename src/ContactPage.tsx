import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Briefcase, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      {/* Hero Section */}
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <MessageSquare size={14} /> Contact Us
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          We'd love to hear from you
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          Whether you have a question about a vehicle, need technical support, or want to explore partnership opportunities.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">First Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Last Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all" placeholder="jane@example.com" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Topic</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Support & Troubleshooting</option>
                  <option>Sales & Dealership Partnerships</option>
                  <option>Press & Media</option>
                  <option>Careers</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <Globe size={16} className="text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Message</label>
              <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all resize-none" placeholder="How can we help you today?"></textarea>
            </div>

            <button type="button" className="w-full bg-[#29abe2] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2089b5] transition-colors shadow-lg shadow-blue-500/20">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info & Locations */}
        <div className="space-y-8">
          {/* Support Channels */}
          <div className="light-glass-card rounded-[24px] p-6 md:p-8 border border-white/60 bg-white/60 backdrop-blur-md">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Support Channels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {/* Call Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#29abe2]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Call Support</h4>
                  <p className="text-xs text-slate-500 mb-2">Mon-Fri, 9am - 6pm EST</p>
                  <a href="tel:1-800-555-0123" className="text-sm md:text-base font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors break-all">1-800-555-0123</a>
                </div>
              </div>

              {/* Email Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[#29abe2]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                  <p className="text-xs text-slate-500 mb-2">We'll respond within 24hrs</p>
                  <a href="mailto:support@carmatrix.com" className="text-sm md:text-base font-bold text-[#29abe2] hover:text-[#2089b5] transition-colors break-all">support@carmatrix.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Departments</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Briefcase size={20} className="text-slate-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Dealership Partnerships</h4>
                  <p className="text-sm text-slate-500">dealers@carmatrix.com</p>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="flex items-start gap-4">
                <MessageSquare size={20} className="text-slate-400 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Press & Public Relations</h4>
                  <p className="text-sm text-slate-500">press@carmatrix.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="relative overflow-hidden rounded-[24px] h-[200px] border border-slate-200">
            {/* Placeholder for map - using a stylized background instead of an iframe for clean UI */}
            <div className="absolute inset-0 bg-slate-200 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 text-white shadow-lg shadow-black/20">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">CarMatrix Headquarters</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">123 Innovation Drive, Austin, TX 78701</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
