import React, { useState } from 'react';
import { FileSearch, AlertTriangle, CheckCircle2, Copy, Check, DollarSign, Plus, Trash2, MessageSquare } from 'lucide-react';

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  category: 'legit' | 'negotiable' | 'junk';
  reason: string;
}

const DEFAULT_ITEMS: FeeItem[] = [
  { id: '1', name: 'Agreed Vehicle Price', amount: 28500, category: 'legit', reason: 'Base vehicle sales price negotiated.' },
  { id: '2', name: 'State & Local Sales Tax', amount: 1780, category: 'legit', reason: 'Mandatory state/county revenue remittance.' },
  { id: '3', name: 'DMV Title & License Plates', amount: 260, category: 'legit', reason: 'Actual government registration charges.' },
  { id: '4', name: 'Dealer Documentation (Doc) Fee', amount: 699, category: 'negotiable', reason: 'Dealer back-office fee. Check your state cap.' },
  { id: '5', name: 'Interior / Paint Protection Sealant', amount: 895, category: 'junk', reason: 'High-margin dealer add-on. Rarely applied; easily declined.' },
  { id: '6', name: 'VIN Glass Etching', amount: 395, category: 'junk', reason: 'Overpriced theft deterrent available independently for $25.' },
  { id: '7', name: 'Nitrogen Filled Tires', amount: 199, category: 'junk', reason: 'Atmospheric air is already 78% nitrogen. Refuse this fee.' },
  { id: '8', name: 'Dealer Prep & Reconditioning Fee', amount: 495, category: 'junk', reason: 'Cost of doing business already covered by retail price.' },
];

export default function DealerQuoteAuditorWidget() {
  const [items, setItems] = useState<FeeItem[]>(DEFAULT_ITEMS);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'legit' | 'negotiable' | 'junk'>('junk');

  const legitTotal = items.filter(i => i.category === 'legit').reduce((sum, i) => sum + i.amount, 0);
  const negotiableTotal = items.filter(i => i.category === 'negotiable').reduce((sum, i) => sum + i.amount, 0);
  const junkTotal = items.filter(i => i.category === 'junk').reduce((sum, i) => sum + i.amount, 0);
  const outTheDoorTotal = legitTotal + negotiableTotal + junkTotal;
  const cleanTargetPrice = legitTotal + Math.min(negotiableTotal, 350);

  const vehiclePrice = items.find(i => i.name.toLowerCase().includes('price'))?.amount || 28500;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(Number(newItemAmount))) return;

    const reasons = {
      legit: 'Mandatory or baseline cost.',
      negotiable: 'Discretionary dealer operational charge.',
      junk: 'Optional dealer markup package.'
    };

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: newItemName.trim(),
        amount: Number(newItemAmount),
        category: newItemCategory,
        reason: reasons[newItemCategory]
      }
    ]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const emailScript = `Hi [Salesperson Name],

Thank you for sending over the quote for the [Year Make Model]. 

I am ready to move forward this week at an Out-The-Door (OTD) price of $${cleanTargetPrice.toLocaleString()}, which covers the agreed vehicle price ($${vehiclePrice.toLocaleString()}), mandatory state taxes, and official DMV registration fees.

I respectfully request that the dealer add-on packages (${items.filter(i => i.category === 'junk').map(i => i.name).join(', ')}) totaling $${junkTotal.toLocaleString()} be removed from the purchase agreement, as I will not be utilizing these accessories.

If you can send over a revised buyer's order reflecting $${cleanTargetPrice.toLocaleString()} out-the-door, I can sign and arrange delivery immediately.

Thank you,
[Your Name]
[Your Phone Number]`;

  const textScript = `Hi [Name], thanks for the numbers on the [Model]. I'm ready to buy today at $${cleanTargetPrice.toLocaleString()} Out-The-Door including tax and DMV fees, with the dealer add-on packages ($${junkTotal.toLocaleString()}) removed. If that works on your end, send over the revised worksheet and I will put down the deposit!`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/60 rounded-full text-indigo-700 text-xs font-bold mb-2">
            <FileSearch size={14} />
            <span>Buyer Transparency Tool</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dealer Quote Auditor & Counter-Offer Generator</h3>
          <p className="text-slate-500 text-sm mt-1">Audit line items on dealer worksheets, expose predatory add-ons, and generate clean counter-offers.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itemized Line-Item Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Itemized Quote Line Items</h4>
            <span className="text-xs text-slate-400">Click trash to remove any item</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {items.map((item) => {
              const badgeColors = {
                legit: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                negotiable: 'bg-amber-50 text-amber-800 border-amber-200',
                junk: 'bg-rose-50 text-rose-800 border-rose-200'
              };
              const badgeLabel = {
                legit: 'Government / Core',
                negotiable: 'Negotiable',
                junk: 'Junk Fee'
              };

              return (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 truncate">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColors[item.category]}`}>
                        {badgeLabel[item.category]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.reason}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ${item.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete line item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddItem} className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add dealer item (e.g. Window Tint)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#29abe2]"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="Amount $"
                className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2]"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 outline-none"
              >
                <option value="junk">Junk Fee</option>
                <option value="negotiable">Negotiable</option>
                <option value="legit">Government</option>
              </select>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Scorecard & Counter-Offer Scripts */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-[#29abe2] uppercase tracking-wider">Out-The-Door Price Breakdown</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Core Price & Legitimate Gov Taxes:</span>
                <span className="font-bold text-white">${legitTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Negotiable Doc Fees:</span>
                <span className="font-bold">${negotiableTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Predatory Junk Add-ons:</span>
                <span className="font-bold">+${junkTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-400 uppercase">Dealer Quoted OTD:</span>
              <span className="text-2xl font-black text-white">${outTheDoorTotal.toLocaleString()}</span>
            </div>

            {junkTotal > 0 && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-xs">
                <span className="text-emerald-200">
                  Target Clean OTD Price: <strong className="text-white">${cleanTargetPrice.toLocaleString()}</strong> (Save ${junkTotal.toLocaleString()})
                </span>
              </div>
            )}
          </div>

          {/* 1-Click Counter-Offer Script */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#29abe2]" />
                <span>One-Click Counter-Offer Script</span>
              </h5>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Formal Email Template</span>
                  <button
                    onClick={() => copyToClipboard(emailScript, 'email')}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#29abe2] hover:text-[#2089b5] cursor-pointer"
                  >
                    {copiedScript === 'email' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedScript === 'email' ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                  </button>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed italic bg-white p-2 rounded-lg border border-slate-200/60">
                  "{emailScript.slice(0, 120)}..."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Quick SMS / Text Script</span>
                  <button
                    onClick={() => copyToClipboard(textScript, 'sms')}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#29abe2] hover:text-[#2089b5] cursor-pointer"
                  >
                    {copiedScript === 'sms' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedScript === 'sms' ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                  </button>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed italic bg-white p-2 rounded-lg border border-slate-200/60">
                  "{textScript}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
