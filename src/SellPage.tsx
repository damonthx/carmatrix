import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ChevronDown, ChevronRight, Star, 
  ArrowUp, MonitorSmartphone, BadgeDollarSign, Building2,
  CarFront, MapPin, Search, AlertCircle
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function SellPage() {
  const [activeTab, setActiveTab] = useState<'make'|'vin'>('make');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  
  // Form State
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("Please sign in to list your vehicle.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: submitError } = await supabase
        .from('listings')
        .insert([
          {
            user_id: session.user.id,
            make: activeTab === 'make' ? make : 'Manual Entry',
            model: activeTab === 'make' ? model : 'Manual Entry',
            year: activeTab === 'make' ? parseInt(year) || 0 : 0,
            vin: activeTab === 'vin' ? vin : null,
            status: 'pending'
          }
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      // Reset form
      setMake(''); setModel(''); setYear(''); setVin('');
    } catch (err: any) {
      setError(err.message || "Failed to submit listing.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { 
      q: "What are my options to sell my car?", 
      a: "With CarMatrix, you can sell your car to a local dealer in four easy steps.\n1. Enter your car's details - License plate, VIN, mileage, etc.\n2. Get instant offers - View the best prices from local dealers.\n3. Choose the best offer - Bring it to the dealer along with your ID and supporting documents.\n4. Get paid right away - The dealer will inspect your car, verify the offer, and pay you the same day." 
    },
    { 
      q: "How does the offer process work?", 
      a: "First, enter some basic details about your car, including your license plate number or VIN, mileage, and condition. We'll send you the best offers from local dealers. You can then compare multiple offers in one place and select the one that best meets your needs based on the offer amount and the convenience of the dealership's location.\nNext Steps: Drop off your car at the selected dealership, have it inspected, and get paid once the sale is complete.\nAvailable in select markets." 
    },
    { q: "How do you determine my offer?", a: "We use aggregated local market data, recent sales history, and specific vehicle condition metrics to generate the most competitive instant offers available in your area." },
    { q: "How long is my offer valid for?", a: "Instant offers are typically valid for 7 days or an additional 250 miles, whichever comes first, giving you time to consider your options without pressure." },
    { q: "What are my payment options and when do I get paid?", a: "Once you drop off the vehicle and the dealership verifies its condition, you get paid on the spot. Most dealers offer a direct check or ACH transfer." },
    { q: "Will I always receive an offer?", a: "We strive to provide offers for most vehicles. However, heavily damaged, extremely rare, or very old vehicles might require in-person appraisals rather than an instant online offer." },
    { q: "Can I sell a car if I haven't paid it off?", a: "Yes. In most cases, the dealer will handle the payoff directly with your lender. Any positive equity will be paid directly to you." },
    { q: "Can I sell a car without a title?", a: "Typically, a clear title is required to complete the sale. If you've lost it, you may need to apply for a duplicate from your state's DMV prior to selling." },
    { q: "Will I pay taxes if I sell a car?", a: "Taxes depend on your state and whether you are making a profit on the sale. If you trade in your vehicle, many states offer a tax credit towards your new purchase." },
    { q: "Will selling a financed car hurt my credit?", a: "No, typically selling a financed car and paying off the loan results in a closed account in good standing, which may actually improve your credit profile over time." },
    { q: "Can I sell my car privately on CarMatrix?", a: "Currently, our Instant Cash Offer connects you directly with certified local dealerships to ensure a fast, safe, and guaranteed transaction." }
  ];

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const vehicleImage = "https://www.image2url.com/r2/default/images/1777076688091-58e09a91-5b3b-4dd7-b654-601a5c63f23f.png"; // SUV from earlier
  const truckImage = "https://www.image2url.com/r2/default/images/1777076717445-1b9247fb-8052-48e7-8c93-12ae7eab3246.png"; 

  return (
    <div className="bg-white min-h-screen text-slate-800 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="bg-[#0f2d5c] pt-20 pb-48 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Sell your car for <span className="text-[#3fc1fa]">the best price</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 font-medium">
            Compare multiple offers in under 2 minutes.
          </p>

          <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-2xl p-2 md:p-8">
            {/* Toggle */}
            <div className="flex justify-center mb-8 relative -top-6 md:-top-12">
              <div className="bg-white rounded-full shadow-lg p-1 flex border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setActiveTab('make')}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'make' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Make/Model
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('vin')}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'vin' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  License Plate/Vin
                </button>
              </div>
            </div>

            {/* Form */}
            {activeTab === 'make' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">Make</label>
                  <input 
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Toyota"
                    required={activeTab === 'make'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none font-semibold"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">Model</label>
                  <input 
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Camry"
                    required={activeTab === 'make'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none font-semibold"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">Year</label>
                  <input 
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2022"
                    required={activeTab === 'make'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">License Plate or VIN</label>
                  <input 
                    type="text" 
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    placeholder="Enter Plate or VIN" 
                    required={activeTab === 'vin'}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none font-semibold" 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">State</label>
                  <select 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none font-semibold"
                  >
                    <option value="">Select State</option>
                    <option value="TX">TX</option>
                    <option value="CA">CA</option>
                    <option value="NY">NY</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-xl text-xs font-bold">
                <CheckCircle2 size={14} />
                Your listing has been submitted successfully!
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#29abe2] hover:bg-[#2089b5] text-white font-bold rounded-xl py-4 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Get Your Offers"}
            </button>
          </form>
        </div>

        {/* Decorative Background Curve */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white to-transparent transform translate-y-1/2 rounded-t-[100%] scale-x-150"></div>
      </section>

      {/* Floating Car Display Area */}
      <div className="max-w-[800px] mx-auto px-4 relative z-20 -mt-36 mb-20">
        <div className="relative w-full aspect-video md:aspect-[21/9] flex items-center justify-center pointer-events-none">
          <img src={vehicleImage} alt="Car illustration" className="w-[80%] md:w-[60%] object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700" />
          
          {/* Offer Badges */}
          <div className="absolute top-[20%] left-[10%] md:left-[20%] bg-white rounded-full px-4 py-2 shadow-xl border border-slate-100 z-20 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Offer 1:</span>
            <span className="text-lg font-black text-slate-900">$24,900</span>
          </div>
          <div className="absolute top-[30%] right-[5%] md:right-[15%] bg-white rounded-full px-4 py-2 shadow-xl border border-slate-100 z-20 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Offer 2:</span>
            <span className="text-lg font-black text-slate-900">$26,500</span>
          </div>
          <div className="absolute bottom-[20%] left-[15%] md:left-[25%] bg-white rounded-full px-4 py-2 shadow-xl border border-slate-100 z-20 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Offer 3:</span>
            <span className="text-lg font-black text-slate-900">$28,340</span>
          </div>
        </div>
      </div>

      {/* Quick Describe Box */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-r from-[#d9304f] to-[#59306b] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="md:w-1/3 text-white">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Star className="fill-white w-6 h-6" /> Describe your car to get multiple offers instantly
            </h3>
          </div>
          <div className="md:w-2/3 w-full">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tell us about the car you're selling or ask any question." 
                className="w-full bg-white rounded-xl py-4 pl-6 pr-14 outline-none text-slate-800 font-medium shadow-inner"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#29abe2] hover:bg-[#2089b5] rounded-lg w-10 flex items-center justify-center text-white transition-colors">
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Sell With Us */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 py-12 border-t border-slate-200">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Why sell with<br/>CarMatrix?</h2>
            <button className="mt-8 bg-[#29abe2] hover:bg-[#2089b5] text-white font-bold rounded-full px-8 py-3 transition-colors">
              Get your offers
            </button>
          </div>
          <div className="space-y-10">
            <div className="flex gap-6">
              <div className="shrink-0 text-[#29abe2]">
                <MonitorSmartphone size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Instant offers, all in one place</h4>
                <p className="text-slate-600 font-medium">Enter your car's details and get multiple offers from local dealers.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 text-[#29abe2]">
                <BadgeDollarSign size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Know your best price</h4>
                <p className="text-slate-600 font-medium">Compare offers side-by-side so you can sell with confidence.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 text-[#29abe2]">
                <Building2 size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Cash or trade-in. Your choice</h4>
                <p className="text-slate-600 font-medium">Drop your car off for inspection, then get your payment or trade-in value.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#0f2d5c] py-24">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Take it from our happy sellers</h2>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <ChevronDown className="rotate-90" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <ChevronDown className="-rotate-90" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 text-center mb-4 leading-tight">Great experience. Fast response. Honest</h3>
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-[#ffb703] text-[#ffb703]" />)}
                </div>
                <p className="text-slate-600 text-center font-medium text-sm leading-relaxed mb-8">
                  Great experience. Fast response. Honest throughout. Kept their word on price /offer. Made it quick and easy. Highly recommend.
                </p>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-900 text-sm block">Jeff W</span>
                <span className="text-xs text-slate-500 font-medium">Verified seller | August, 2025</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 text-center mb-4 leading-tight">Great experience</h3>
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-[#ffb703] text-[#ffb703]" />)}
                </div>
                <p className="text-slate-600 text-center font-medium text-sm leading-relaxed mb-8">
                  It was great, very smooth and quick process. This is my first experience selling my car this way. Will encourage family and friends to use this great services.
                </p>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-900 text-sm block">Salem A</span>
                <span className="text-xs text-slate-500 font-medium">Verified seller | August, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VS Section */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16 tracking-tight">
          Why get an instant cash offer vs. selling it yourself?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative flex justify-center">
             <img src={truckImage} alt="Red Truck" className="w-[90%] object-contain" />
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1">
                <CheckCircle2 size={24} className="text-[#3fc1fa] fill-[#3fc1fa] opacity-20" strokeWidth={0} />
                <CheckCircle2 size={24} className="text-[#29abe2] absolute -mt-[24px]" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Get offers instantly</h4>
                <p className="text-slate-600 font-medium text-sm mt-1">vs. waiting for interested buyers to reach out.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1">
                <CheckCircle2 size={24} className="text-[#3fc1fa] fill-[#3fc1fa] opacity-20" strokeWidth={0} />
                <CheckCircle2 size={24} className="text-[#29abe2] absolute -mt-[24px]" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Choose your best offer</h4>
                <p className="text-slate-600 font-medium text-sm mt-1">vs. negotiating with private buyers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1">
                <CheckCircle2 size={24} className="text-[#3fc1fa] fill-[#3fc1fa] opacity-20" strokeWidth={0} />
                <CheckCircle2 size={24} className="text-[#29abe2] absolute -mt-[24px]" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Hassle-free handoff</h4>
                <p className="text-slate-600 font-medium text-sm mt-1">vs. coordinating with private buyers.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-[#29abe2] hover:bg-[#2089b5] text-white font-bold rounded-full px-8 py-3 transition-colors shadow-lg">
            Get started
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-slate-100/50 py-24 border-y border-slate-200/60">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tips on selling your car</h2>
            <button className="text-[#29abe2] font-bold text-sm hover:underline">View all</button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-slate-200 aspect-video relative">
                 <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Reviewing offers" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 leading-snug">Reviewing Instant Cash Offers for Your Car</h3>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-slate-200 aspect-video relative">
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Documents" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 leading-snug">What Documents Do I Need to Sell my Car?</h3>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-slate-200 aspect-video relative">
                <img src="https://www.image2url.com/r2/default/images/1777314139065-e16e689b-9454-40ba-93be-e179b7ab557d.avif" className="w-full h-full object-cover" alt="Car showcase" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 leading-snug">How To Sell a Car You Haven't Paid Off Yet</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Room */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">Frequently asked questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 pb-2">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
                {expandedFaq === index ? (
                  <span className="text-slate-400 text-2xl leading-none">&minus;</span>
                ) : (
                  <span className="text-slate-400 text-2xl leading-none">&#43;</span>
                )}
              </button>
              {expandedFaq === index && (
                <div className="pb-6 text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-line animate-in slide-in-from-top-2 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-[#29abe2] hover:bg-[#2089b5] text-white font-bold rounded-full px-8 py-2.5 transition-colors">
            View all
          </button>
        </div>
      </div>

      {/* States Grid */}
      <div className="bg-[#e4f3fb] py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">Sell your car in your home state</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-2 text-center text-sm font-bold text-[#29abe2]">
            {states.map(state => (
              <a key={state} href="#" className="hover:underline py-1">{state}</a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
