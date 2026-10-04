import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Heart, List, Trash2, ArrowLeft, ExternalLink, 
  Clock, User, Mail, Phone, MapPin, Building2, 
  CheckCircle, AlertCircle, Calendar, ChevronRight 
} from 'lucide-react';
import { getFavorites } from './services/favoritesService';

export default function Dashboard({ onBack }: { onBack: () => void }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [counts, setCounts] = useState({ favorites: 0, listings: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'listings' | 'admin'>('favorites');
  const [isAdmin, setIsAdmin] = useState(false);
  const [heroBg, setHeroBg] = useState('');
  const [dealerInquiries, setDealerInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let inquiriesCount = 0;
    if (session.user.email === 'carmetaproject@gmail.com') {
      setIsAdmin(true);
      setInquiriesLoading(true);
      const { data: inqData } = await supabase
        .from('dealer_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      const inquiriesList = inqData || [];
      setDealerInquiries(inquiriesList);
      inquiriesCount = inquiriesList.length;
      setInquiriesLoading(false);
    }

    // Fetch favorites
    const favs = await getFavorites();
    setFavorites(favs);

    // Fetch listings
    const { data: listData } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    setListings(listData || []);

    // Fetch Hero Settings
    const { data: settings } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'hero_background')
      .single();
    
    if (settings) setHeroBg(settings.value);
    
    // Update counts
    setCounts({
      favorites: favs.length,
      listings: (listData || []).length,
      inquiries: inquiriesCount
    });
    
    setLoading(false);
  };

  const updateHeroBg = async () => {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'hero_background', value: heroBg });
    
    if (error) {
      alert('Error updating background: ' + error.message);
    } else {
      alert('Background updated successfully!');
    }
  };

  const removeFavorite = async (id: string) => {
    await supabase.from('saved_vehicles').delete().eq('id', id);
    setFavorites(prev => prev.filter(f => f.id !== id));
    setCounts(prev => ({ ...prev, favorites: prev.favorites - 1 }));
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
    setCounts(prev => ({ ...prev, listings: prev.listings - 1 }));
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('dealer_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      setDealerInquiries(prev => 
        prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
      );
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partnership inquiry?')) return;
    const { error } = await supabase
      .from('dealer_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting inquiry: ' + error.message);
    } else {
      setDealerInquiries(prev => prev.filter(inq => inq.id !== id));
      setCounts(prev => ({ ...prev, inquiries: prev.inquiries - 1 }));
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Activity</h1>
          <p className="text-slate-500 font-medium">Manage your saved vehicles and active listings</p>
        </div>

        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-10`}>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#29abe2]">
              <List size={28} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{counts.listings}</div>
              <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Listings</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Heart size={28} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{counts.favorites}</div>
              <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Saved Vehicles</div>
            </div>
          </div>
          {isAdmin && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Building2 size={28} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{counts.inquiries}</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Partner Inquiries</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'favorites' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Heart size={16} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
            Favorites ({favorites.length})
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'listings' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <List size={16} />
            My Listings ({listings.length})
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'admin' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <User size={16} />
              Admin Portal ({dealerInquiries.length})
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold">Loading your data...</div>
        ) : (
          <div className="grid gap-4">
            {activeTab === 'favorites' ? (
              favorites.length === 0 ? (
                <EmptyState icon={<Heart size={48} />} title="No saved vehicles" description="Heart vehicles while searching to see them here." />
              ) : (
                favorites.map(fav => (
                  <div key={fav.id} className="bg-white rounded-2xl p-4 flex items-center gap-6 shadow-sm border border-slate-100 group">
                    <img src={fav.image_url || 'https://images.unsplash.com/photo-1550262141-8631bc0cb67f?auto=format&fit=crop&w=600&q=80'} alt={fav.model} className="w-24 h-16 object-cover rounded-lg bg-slate-50" />
                    <div className="flex-1">
                      <h3 className="font-extrabold text-slate-900">{fav.year} {fav.make} {fav.model}</h3>
                      <p className="text-slate-500 text-sm font-bold">${fav.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => removeFavorite(fav.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : activeTab === 'listings' ? (
              listings.length === 0 ? (
                <EmptyState icon={<List size={48} />} title="No active listings" description="Start selling your car to see your listings here." />
              ) : (
                listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-extrabold text-slate-900">
                          {listing.year > 0 ? `${listing.year} ${listing.make} ${listing.model}` : listing.vin || listing.make}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          listing.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                        <div className="flex items-center gap-1"><Clock size={12}/> {new Date(listing.created_at).toLocaleDateString()}</div>
                        {listing.vin && <div>VIN: {listing.vin}</div>}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteListing(listing.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Side: Dealer inquiries (2/3 cols on lg screens) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Partnership Inquiries</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and update partnership requests</p>
                      </div>
                      <span className="bg-blue-50 text-[#29abe2] text-xs font-extrabold px-3 py-1 rounded-full border border-blue-100">
                        {dealerInquiries.length} requests
                      </span>
                    </div>

                    {inquiriesLoading ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-semibold">Loading inquiries...</div>
                    ) : dealerInquiries.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-semibold flex flex-col items-center gap-2">
                        <Building2 size={36} className="text-slate-200" />
                        No partnership requests found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dealerInquiries.map((inq) => (
                          <div 
                            key={inq.id} 
                            className="p-5 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h4 className="font-extrabold text-slate-900 text-[15px]">
                                  {inq.dealership_name}
                                </h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  inq.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                  inq.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {inq.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                                <User size={13} className="text-slate-400" />
                                {inq.first_name} {inq.last_name}
                                <span className="text-slate-300">•</span>
                                <MapPin size={13} className="text-slate-400" />
                                ZIP: {inq.zip_code}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold pt-1">
                                <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-[#29abe2] transition-colors">
                                  <Mail size={12} /> {inq.email}
                                </a>
                                <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-[#29abe2] transition-colors">
                                  <Phone size={12} /> {inq.phone}
                                </a>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} /> {new Date(inq.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 md:mt-0 self-end md:self-center">
                              {/* Status Select */}
                              <div className="relative">
                                <select
                                  value={inq.status}
                                  onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                                  className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 outline-none shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] cursor-pointer transition-all"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <ChevronRight size={14} className="rotate-90 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                              
                              <button 
                                onClick={() => deleteInquiry(inq.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Hero Config (1/3 cols on lg screens) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Hero Background Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hero Background URL</label>
                      <input 
                        type="text" 
                        value={heroBg}
                        onChange={(e) => setHeroBg(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-slate-300 hover:border-slate-400 shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] outline-none transition-all font-medium text-slate-900"
                      />
                      <p className="text-slate-400 text-[10px] mt-1.5 font-medium italic leading-relaxed">Enter a direct image URL (Unsplash recommended)</p>
                    </div>
                    <button 
                      onClick={updateHeroBg}
                      className="w-full bg-[#29abe2] text-white py-2.5 rounded-xl font-bold hover:bg-[#2089b5] transition-colors shadow-md shadow-blue-200 text-xs"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const EmptyState = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
    <div className="text-slate-200 flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-slate-500 font-medium text-sm">{description}</p>
  </div>
);
