import React, { useState, useEffect } from 'react';
import { ShieldCheck, Scale, FileText, Lock, CheckCircle2, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';

export type LegalTab = 'affiliate' | 'privacy' | 'terms';

interface LegalCompliancePageProps {
  initialTab?: LegalTab;
  onBack?: () => void;
}

export default function LegalCompliancePage({ 
  initialTab = 'affiliate', 
  onBack 
}: LegalCompliancePageProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#29abe2] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Research Suite</span>
            </button>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#29abe2]/10 border border-[#29abe2]/30 text-[#29abe2] text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck size={14} /> Trust & Legal Compliance
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Legal Disclosures & Policies
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Operated by Defiant Digital Holdings LLC • Last updated: September 2026
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> FTC Compliant
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 flex items-center gap-1.5">
                <Lock size={13} /> SSL Secured
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'affiliate'
                ? 'bg-[#29abe2] text-white shadow-lg shadow-[#29abe2]/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck size={15} />
            <span>FTC Affiliate Disclosure</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#29abe2] text-white shadow-lg shadow-[#29abe2]/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Lock size={15} />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#29abe2] text-white shadow-lg shadow-[#29abe2]/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Scale size={15} />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Panels */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl space-y-8 leading-relaxed text-slate-300 text-sm">
          
          {/* TAB 1: FTC AFFILIATE DISCLOSURE */}
          {activeTab === 'affiliate' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/50 text-sky-200">
                <div className="flex items-center gap-2 font-bold text-sm mb-1 text-sky-300">
                  <AlertCircle size={16} />
                  <span>Federal Trade Commission (FTC) 16 CFR Part 255 Notice</span>
                </div>
                <p className="text-xs text-sky-200/90 leading-normal">
                  In compliance with FTC guidelines concerning the use of endorsements and testimonials in advertising, this page explains the affiliate and commercial relationships of CarMatrix and Defiant Digital Holdings LLC.
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">1. How CarMatrix Operates and Stays Free</h2>
                <p>
                  CarMatrix (<strong className="text-white">carmatrix.app</strong>) is an independent automotive intelligence and consumer advocacy platform owned and operated by <strong className="text-white">Defiant Digital Holdings LLC</strong>. Our mission is to provide car shoppers with 100% free, institutional-grade tools—including VIN decoders, 5-year total cost of ownership calculators, dealer fee auditors, and valuation models.
                </p>
                <p>
                  To keep all tools, calculators, guides, and market reports free to consumers without paywalls, we partner with reputable third-party companies, affiliate networks, and financial institutions.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">2. Affiliate Relationships & Compensation</h2>
                <p>
                  When you click certain links on CarMatrix and subsequently request a quote, apply for pre-qualification, purchase a vehicle history report, schedule a mobile inspection, or complete a transaction, CarMatrix may receive monetary compensation from the partner company.
                </p>
                <p>
                  This compensation comes at <strong className="text-white">zero additional cost to you</strong>. In many cases, our partner agreements allow us to highlight discounted rates, exclusive promotional pricing, or free soft-pull pre-approvals that are not publicly available on dealer lots.
                </p>
                <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#29abe2]">Our Active Commercial Categories Include:</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                    <li><strong className="text-white">Auto Loan Financing & Refinancing:</strong> Direct lenders, digital brokerages, and soft-credit pre-qualification portals (e.g., myAutoloan, LightStream, AutoPay, SuperMoney).</li>
                    <li><strong className="text-white">Auto Insurance Comparison:</strong> Licensed online insurance agencies and rate comparison marketplaces (e.g., The Zebra, Insurify, Policygenius).</li>
                    <li><strong className="text-white">Vehicle History & Title Records:</strong> Independent reporting agencies analyzing title branding, odometer rollbacks, and insurance loss records (e.g., EpicVIN, VinAudit, CarVertical).</li>
                    <li><strong className="text-white">Pre-Purchase Mechanical Inspections:</strong> Nationwide networks of certified mobile master mechanics (e.g., Lemon Squad, POMCAR).</li>
                    <li><strong className="text-white">Instant Cash Trade-In & Wholesale Buyouts:</strong> Direct vehicle purchasers providing algorithmic cash offers (e.g., Peddle, Carvana).</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">3. Radical Editorial & Algorithmic Independence</h2>
                <p>
                  Our commercial relationships <strong className="text-white">never dictate or influence</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Our dealer quote audit junk-fee detection algorithms (we flag predatory add-ons regardless of dealer or lender affiliation).</li>
                  <li>Our 50-state statutory doc fee caps, tax rules, or trade-in credit calculations.</li>
                  <li>Official NHTSA safety recall data, which is pulled directly from government records without modification.</li>
                  <li>Our vehicle depreciation curves, wholesale market trend indexes, or 5-year total ownership cost projections.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">4. Affiliate Networks</h2>
                <p>
                  Tracking links on our platform may be served or managed through verified affiliate marketing networks including <strong className="text-white">Impact.com (Impact Radius)</strong>, <strong className="text-white">CJ Affiliate (Commission Junction)</strong>, <strong className="text-white">ShareASale</strong>, and direct enterprise partner integrations.
                </p>
              </section>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                Questions regarding our advertising or affiliate practices? Contact our compliance desk at <a href="mailto:affiliates@carmatrix.app" className="text-[#29abe2] underline">affiliates@carmatrix.app</a>.
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">1. Overview & Scope</h2>
                <p>
                  This Privacy Policy describes how <strong className="text-white">Defiant Digital Holdings LLC</strong> ("CarMatrix", "we", "us", or "our") collects, uses, and safeguards information when you visit <strong className="text-white">carmatrix.app</strong> and utilize our automotive intelligence toolbelt.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">2. Information We Collect</h2>
                <div className="space-y-2">
                  <p><strong className="text-white">a. Information You Voluntarily Provide:</strong> If you sign up for price alerts, contact support, or register an account, we may collect your email address, name, and search preferences.</p>
                  <p><strong className="text-white">b. Automotive Search Queries:</strong> Vehicle Identification Numbers (VINs), vehicle years, makes, models, ZIP codes, and loan parameters you input into our calculators are processed in real time to generate calculations and fetch public NHTSA safety records. We do not correlate your public VIN lookups with personal private registered owner identities.</p>
                  <p><strong className="text-white">c. Automated Log Data & Analytics:</strong> Like most web services, we automatically log browser types, device specifications, operating systems, referring URLs, and interaction timestamps to optimize platform speed and mobile responsiveness.</p>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">3. Cookies, Web Beacons & Affiliate Attribution</h2>
                <p>
                  We utilize standard functional cookies to remember your preferences (such as your active toolkit filters or state selection).
                </p>
                <p>
                  When you click on third-party links or affiliate partner buttons (such as insurance quote or pre-qualification tools), the destination partner and affiliate networks (such as Impact.com) may set cookies on your browser to attribute referrals and verify transactions. These cookies are subject to the privacy policies of the respective third-party providers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">4. Data Security & Storage</h2>
                <p>
                  We implement industry-standard Transport Layer Security (TLS 1.3 / SSL) encryption across all endpoints. We do not sell your personal identifying information to third-party data brokers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">5. Your Rights (CCPA / GDPR)</h2>
                <p>
                  Depending on your state or jurisdiction, you have the right to request access to, correction of, or deletion of any personal data we maintain. To exercise any data privacy rights, please submit a request to <a href="mailto:privacy@carmatrix.app" className="text-[#29abe2] underline">privacy@carmatrix.app</a>.
                </p>
              </section>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                Entity: Defiant Digital Holdings LLC • Contact: <a href="mailto:privacy@carmatrix.app" className="text-[#29abe2] underline">privacy@carmatrix.app</a>.
              </div>
            </div>
          )}

          {/* TAB 3: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using <strong className="text-white">carmatrix.app</strong>, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using the platform.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">2. Algorithmic Tools & Informational Disclaimer</h2>
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                    <AlertCircle size={15} /> Not Financial, Legal, or Certified Appraisal Advice
                  </div>
                  <p>
                    All mathematical models, 5-year total cost of ownership (TCO) estimates, depreciation curves, loan amortization calculations, and state doc fee guides provided on CarMatrix are for general informational, educational, and preliminary consumer comparison purposes only.
                  </p>
                </div>
                <p>
                  Actual vehicle purchase prices, financing APRs, loan terms, insurance premiums, taxes, and dealer documentation fees vary based on your personal creditworthiness, individual dealer policies, state statutory revisions, and final contract execution. CarMatrix is not a certified lender, insurance agency, or automobile dealership.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">3. NHTSA Data & Third-Party Information</h2>
                <p>
                  Factory specifications and safety recall information are queried from the United States National Highway Traffic Safety Administration (NHTSA) VPIC databases. While we strive to maintain real-time accuracy, consumers should verify open safety recalls with authorized franchised franchise dealerships.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">4. Intellectual Property</h2>
                <p>
                  All proprietary algorithms, user interface designs, custom calculators, graphics, and code are the property of <strong className="text-white">Defiant Digital Holdings LLC</strong> and protected by United States and international copyright laws.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">5. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Defiant Digital Holdings LLC and its officers, directors, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of the site or decisions made based on its calculators.
                </p>
              </section>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                Governing Law: State of Delaware, United States • Corporate Inquiries: <a href="mailto:legal@carmatrix.app" className="text-[#29abe2] underline">legal@carmatrix.app</a>.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
