import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  DollarSign, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Car, 
  Building2, 
  User, 
  ChevronDown, 
  Edit3, 
  RotateCcw,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import NegotiationScriptGenerator from './NegotiationScriptGenerator';
import { getMakes, getModelsForMakeYear } from '../../services/nhtsa';

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  category: 'legit' | 'negotiable' | 'junk';
  reason: string;
}

// Generate years from 2000 through current year + 1 (e.g. 2027 down to 2000)
const CURRENT_YEAR = new Date().getFullYear();
const MODEL_YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 2 }, (_, i) => CURRENT_YEAR + 1 - i);

// Common benchmark presets to give users instant starting points
const POPULAR_PRESETS = [
  { year: 2024, make: 'Toyota', model: 'RAV4', trim: 'XLE', price: 29985, taxRate: 0.0625, docFee: 599, dmv: 260 },
  { year: 2024, make: 'Honda', model: 'CR-V', trim: 'Sport', price: 34850, taxRate: 0.0625, docFee: 699, dmv: 280 },
  { year: 2024, make: 'Ford', model: 'F-150', trim: 'XLT', price: 47620, taxRate: 0.0625, docFee: 799, dmv: 340 },
  { year: 2024, make: 'Tesla', model: 'Model Y', trim: 'Long Range', price: 44990, taxRate: 0.0625, docFee: 250, dmv: 390 },
  { year: 2024, make: 'Subaru', model: 'Outback', trim: 'Premium', price: 31195, taxRate: 0.0625, docFee: 495, dmv: 260 },
  { year: 2024, make: 'Hyundai', model: 'Tucson', trim: 'SEL', price: 28400, taxRate: 0.0625, docFee: 599, dmv: 240 },
];

const INITIAL_DEFAULT_ITEMS: FeeItem[] = [
  { id: '1', name: '2024 Toyota RAV4 XLE Base Vehicle Price', amount: 29985, category: 'legit', reason: 'Base vehicle sales price negotiated.' },
  { id: '2', name: 'State & Local Sales Tax (Est. 6.25%)', amount: 1874, category: 'legit', reason: 'Mandatory state/county revenue remittance.' },
  { id: '3', name: 'DMV Title & License Plates', amount: 260, category: 'legit', reason: 'Actual government registration charges.' },
  { id: '4', name: 'Dealer Documentation (Doc) Fee', amount: 599, category: 'negotiable', reason: 'Dealer back-office fee. Check your state cap.' },
  { id: '5', name: 'Interior / Paint Protection Sealant', amount: 895, category: 'junk', reason: 'High-margin dealer add-on. Rarely applied; easily declined.' },
  { id: '6', name: 'VIN Glass Etching', amount: 395, category: 'junk', reason: 'Overpriced theft deterrent available independently for $25.' },
  { id: '7', name: 'Nitrogen Filled Tires', amount: 199, category: 'junk', reason: 'Atmospheric air is already 78% nitrogen. Refuse this fee.' },
  { id: '8', name: 'Dealer Prep & Reconditioning Fee', amount: 495, category: 'junk', reason: 'Cost of doing business already covered by retail price.' },
];

export default function DealerQuoteAuditorWidget() {
  // Vehicle Selection State
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMake, setSelectedMake] = useState<string>('Toyota');
  const [selectedModel, setSelectedModel] = useState<string>('RAV4');
  const [selectedTrim, setSelectedTrim] = useState<string>('XLE');
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [manualVehicleString, setManualVehicleString] = useState<string>('');

  // Dropdown list states
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Sticker / Base Asking Price input
  const [askingPrice, setAskingPrice] = useState<number>(29985);

  // Quote Line Items & Negotiation Inputs
  const [items, setItems] = useState<FeeItem[]>(INITIAL_DEFAULT_ITEMS);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [salespersonName, setSalespersonName] = useState<string>('Mike');
  const [dealershipName, setDealershipName] = useState<string>('Metro Auto Toyota');
  const [buyerName, setBuyerName] = useState<string>('Alex Morgan');

  // Quick Add Item State
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<'legit' | 'negotiable' | 'junk'>('junk');

  // Load makes on mount
  useEffect(() => {
    let isMounted = true;
    async function loadMakes() {
      const makes = await getMakes();
      if (isMounted) setAvailableMakes(makes);
    }
    loadMakes();
    return () => { isMounted = false; };
  }, []);

  // Load models whenever make or year changes
  useEffect(() => {
    let isMounted = true;
    async function loadModels() {
      if (!selectedMake) return;
      setIsLoadingModels(true);
      const models = await getModelsForMakeYear(selectedMake, selectedYear);
      if (isMounted) {
        setAvailableModels(models);
        setIsLoadingModels(false);
        // If current model isn't in new list, pick the first or keep if list is empty
        if (models.length > 0 && !models.some(m => m.toLowerCase() === selectedModel.toLowerCase())) {
          setSelectedModel(models[0]);
        }
      }
    }
    loadModels();
    return () => { isMounted = false; };
  }, [selectedMake, selectedYear]);

  // Derived formatted vehicle string
  const formattedVehicleName = useMemo(() => {
    if (isManualEntry) {
      return manualVehicleString.trim() || 'Target Vehicle';
    }
    const parts = [selectedYear, selectedMake, selectedModel, selectedTrim].filter(Boolean);
    return parts.join(' ').trim() || 'Target Vehicle';
  }, [isManualEntry, manualVehicleString, selectedYear, selectedMake, selectedModel, selectedTrim]);

  // Synchronize base vehicle price line item whenever vehicle name or asking price updates
  const syncBasePriceToItems = (newVehicleName: string, newPrice: number) => {
    setItems(prevItems => {
      const priceIndex = prevItems.findIndex(i => i.id === '1' || i.name.toLowerCase().includes('price') || i.name.toLowerCase().includes('sticker') || i.name.toLowerCase().includes('msrp'));
      if (priceIndex >= 0) {
        const updated = [...prevItems];
        updated[priceIndex] = {
          ...updated[priceIndex],
          name: `${newVehicleName} Asking Price`,
          amount: newPrice,
        };
        // Also update estimated sales tax (6.25% standard default) if item 2 exists
        const taxIndex = updated.findIndex(i => i.id === '2' || i.name.toLowerCase().includes('tax'));
        if (taxIndex >= 0) {
          updated[taxIndex] = {
            ...updated[taxIndex],
            amount: Math.round(newPrice * 0.0625),
          };
        }
        return updated;
      }
      return [
        {
          id: '1',
          name: `${newVehicleName} Asking Price`,
          amount: newPrice,
          category: 'legit',
          reason: 'Base vehicle sales price negotiated.'
        },
        ...prevItems
      ];
    });
  };

  // Handle vehicle selection change from combobox
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const updatedName = [year, selectedMake, selectedModel, selectedTrim].filter(Boolean).join(' ');
    syncBasePriceToItems(updatedName, askingPrice);
  };

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    const updatedName = [selectedYear, make, selectedModel, selectedTrim].filter(Boolean).join(' ');
    syncBasePriceToItems(updatedName, askingPrice);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const updatedName = [selectedYear, selectedMake, model, selectedTrim].filter(Boolean).join(' ');
    syncBasePriceToItems(updatedName, askingPrice);
  };

  const handleTrimChange = (trim: string) => {
    setSelectedTrim(trim);
    const updatedName = [selectedYear, selectedMake, selectedModel, trim].filter(Boolean).join(' ');
    syncBasePriceToItems(updatedName, askingPrice);
  };

  const handleAskingPriceChange = (price: number) => {
    const validPrice = Math.max(0, price || 0);
    setAskingPrice(validPrice);
    syncBasePriceToItems(formattedVehicleName, validPrice);
  };

  // Quick preset loader
  const handleSelectPreset = (presetName: string) => {
    const p = POPULAR_PRESETS.find(item => `${item.year} ${item.make} ${item.model} ${item.trim}` === presetName);
    if (!p) return;
    setIsManualEntry(false);
    setSelectedYear(p.year);
    setSelectedMake(p.make);
    setSelectedModel(p.model);
    setSelectedTrim(p.trim);
    setAskingPrice(p.price);

    const fullPresetName = `${p.year} ${p.make} ${p.model} ${p.trim}`;
    setItems(prevItems => prevItems.map(item => {
      if (item.id === '1' || item.name.toLowerCase().includes('price')) {
        return { ...item, amount: p.price, name: `${fullPresetName} Base Vehicle Price` };
      }
      if (item.id === '2' || item.name.toLowerCase().includes('tax')) {
        return { ...item, amount: Math.round(p.price * p.taxRate) };
      }
      if (item.id === '3' || item.name.toLowerCase().includes('title') || item.name.toLowerCase().includes('dmv')) {
        return { ...item, amount: p.dmv };
      }
      if (item.id === '4' || item.name.toLowerCase().includes('doc')) {
        return { ...item, amount: p.docFee };
      }
      return item;
    }));
  };

  // Add custom fee item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isNaN(Number(newItemAmount))) return;

    const reasons = {
      legit: 'Mandatory statutory government charge or baseline vehicle cost.',
      negotiable: 'Discretionary dealer operational charge. Highly negotiable.',
      junk: 'Optional high-margin dealer profit package. Demand 100% removal.'
    };

    setItems(prev => [
      ...prev,
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
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Audit Calculations
  const legitTotal = items.filter(i => i.category === 'legit').reduce((sum, i) => sum + i.amount, 0);
  const negotiableTotal = items.filter(i => i.category === 'negotiable').reduce((sum, i) => sum + i.amount, 0);
  const junkTotal = items.filter(i => i.category === 'junk').reduce((sum, i) => sum + i.amount, 0);
  const outTheDoorTotal = legitTotal + negotiableTotal + junkTotal;
  const cleanTargetPrice = legitTotal + Math.min(negotiableTotal, 350);

  const vehiclePrice = items.find(i => i.name.toLowerCase().includes('price') || i.name.toLowerCase().includes('sticker'))?.amount || askingPrice;
  const stateTax = items.find(i => i.name.toLowerCase().includes('tax'))?.amount || 0;
  const dmvFees = items.find(i => i.name.toLowerCase().includes('title') || i.name.toLowerCase().includes('dmv') || i.name.toLowerCase().includes('plate'))?.amount || 0;
  const docFee = items.find(i => i.name.toLowerCase().includes('doc'))?.amount || 0;
  const junkItemNames = items.filter(i => i.category === 'junk').map(i => i.name);

  // Counter-offer Scripts
  const emailScript = `Hi ${salespersonName.trim() ? salespersonName.trim() : 'Sales Team'},

Thank you for sending over the quote for the ${formattedVehicleName}${dealershipName.trim() ? ` at ${dealershipName.trim()}` : ''}. 

I am ready to move forward this week at an Out-The-Door (OTD) price of $${cleanTargetPrice.toLocaleString()}, which covers the agreed vehicle price ($${vehiclePrice.toLocaleString()}), mandatory state taxes, and official DMV registration fees.

${junkTotal > 0 ? `I respectfully request that the dealer add-on packages (${junkItemNames.join(', ')}) totaling $${junkTotal.toLocaleString()} be removed from the purchase agreement, as I will not be utilizing these accessories.\n\n` : ''}If you can send over a revised buyer's order reflecting $${cleanTargetPrice.toLocaleString()} out-the-door, I can sign and arrange delivery immediately.

Thank you,
${buyerName.trim() || '[Your Name]'}`;

  const textScript = `Hi ${salespersonName.trim() ? salespersonName.trim() : 'there'}, thanks for the numbers on the ${formattedVehicleName}. I'm ready to buy today at $${cleanTargetPrice.toLocaleString()} Out-The-Door including tax and DMV fees${junkTotal > 0 ? `, with the dealer add-on packages ($${junkTotal.toLocaleString()}) removed` : ''}. If that works for ${dealershipName.trim() || 'your dealership'}, send over the revised worksheet and I will put down the deposit! — ${buyerName.trim() || ''}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 relative overflow-hidden font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400/20 via-indigo-500/10 to-transparent border border-indigo-300/40 shadow-[0_4px_16px_rgba(99,102,241,0.18)] flex items-center justify-center text-indigo-600 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <FileSearch size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Dealer Quote Auditor &amp; Counter-Offer Generator</h3>
            <p className="text-slate-500 text-sm mt-0.5">Audit dealer quotes, identify junk add-ons, and calculate target out-the-door pricing.</p>
          </div>
        </div>
      </div>

      {/* Dynamic Universal Vehicle Selector Bar */}
      <div className="mt-6 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Car size={16} className="text-[#29abe2]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Vehicle Configuration</span>
            <span className="text-[10.5px] font-bold uppercase bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              Universal Coverage
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsManualEntry(!isManualEntry);
                if (!isManualEntry && !manualVehicleString) {
                  setManualVehicleString(`${selectedYear} ${selectedMake} ${selectedModel} ${selectedTrim}`.trim());
                }
              }}
              className="text-xs font-semibold text-[#29abe2] hover:text-[#2089b5] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 size={12} />
              <span>{isManualEntry ? 'Use Dynamic Selector' : 'Vehicle not listed? Enter manually'}</span>
            </button>
            <span className="text-slate-300">|</span>
            <select
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 hover:border-slate-400 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 cursor-pointer shadow-xs transition-all"
              defaultValue=""
            >
              <option value="" disabled>Load benchmark preset...</option>
              {POPULAR_PRESETS.map((p) => {
                const label = `${p.year} ${p.make} ${p.model} ${p.trim}`;
                return (
                  <option key={label} value={label}>
                    {label} (~${p.price.toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Stepped Dropdowns or Manual Input */}
        {!isManualEntry ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Year Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Model Year</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-xs transition-all"
                >
                  {MODEL_YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Make Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Make / Brand</label>
              <div className="relative">
                <select
                  value={selectedMake}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-xs transition-all"
                >
                  {availableMakes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Model Selector (NHTSA dynamic) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                <span>Model</span>
                {isLoadingModels && <Loader2 size={11} className="animate-spin text-[#29abe2]" />}
              </label>
              <div className="relative">
                {availableModels.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-xs transition-all"
                  >
                    {availableModels.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    placeholder="Enter model..."
                    className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-xs transition-all"
                  />
                )}
                {availableModels.length > 0 && (
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Optional Trim / Edition */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Trim / Submodel</label>
              <input
                type="text"
                value={selectedTrim}
                onChange={(e) => handleTrimChange(e.target.value)}
                placeholder="e.g. XLE, AWD, GT"
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-xs transition-all"
              />
            </div>

            {/* Sticker / Base Asking Price */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Sticker / Asking Price</label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <span className="text-slate-400 mr-1">$</span>
                <input
                  type="number"
                  step="250"
                  value={askingPrice === 0 ? '' : askingPrice}
                  onChange={(e) => handleAskingPriceChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="30000"
                  className="w-full bg-transparent outline-none text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Manual Entry Fallback */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Custom Vehicle Identifier (Year Make Model Trim)
              </label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <Car size={14} className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={manualVehicleString}
                  onChange={(e) => {
                    setManualVehicleString(e.target.value);
                    syncBasePriceToItems(e.target.value, askingPrice);
                  }}
                  placeholder="e.g. 2019 Genesis G70 3.3T Sport"
                  className="w-full bg-transparent outline-none text-xs font-bold text-slate-900 placeholder:font-normal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Sticker / Asking Price</label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <span className="text-slate-400 mr-1">$</span>
                <input
                  type="number"
                  step="250"
                  value={askingPrice === 0 ? '' : askingPrice}
                  onChange={(e) => handleAskingPriceChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="30000"
                  className="w-full bg-transparent outline-none text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Salesperson & Buyer Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/70">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Salesperson & Dealership</label>
            <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
              <Building2 size={14} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={salespersonName}
                onChange={(e) => setSalespersonName(e.target.value)}
                placeholder="Sales rep (e.g. Mike)"
                className="w-1/2 bg-transparent outline-none text-xs font-bold text-slate-900 pr-2 border-r border-slate-200"
              />
              <input
                type="text"
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                placeholder="Dealership name"
                className="w-1/2 bg-transparent outline-none text-xs font-bold text-slate-900 pl-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Name (Signs Counter-Offer)</label>
            <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
              <User size={14} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-transparent outline-none text-xs font-bold text-slate-900 placeholder:font-normal"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itemized Line-Item Auditor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Itemized Worksheet Line Items</span>
              <span className="text-[11px] font-normal text-slate-400">({items.length} items audited)</span>
            </h4>
            <span className="text-xs text-slate-400">Click trash to remove any fee</span>
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
                negotiable: 'Negotiable Fee',
                junk: 'Junk / Remove'
              };

              return (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors">
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
                      type="button"
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
              placeholder="Add dealer item (e.g. Doc Fee, Tint, GPS Tracker)..."
              className="flex-1 bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-xs transition-all placeholder:text-slate-400"
            />
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="number"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="Amount $"
                className="w-24 min-w-[70px] flex-1 sm:flex-initial bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-xs transition-all placeholder:text-slate-400"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="flex-1 sm:flex-initial bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-xs transition-all cursor-pointer"
              >
                <option value="junk">Junk Fee</option>
                <option value="negotiable">Negotiable</option>
                <option value="legit">Government</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Scorecard & Counter-Offer Generator */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#29abe2] uppercase tracking-wider">Out-The-Door Price Breakdown</h4>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Live Reactivity
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Core Vehicle & Statutory Taxes:</span>
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

            {junkTotal > 0 ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-xs">
                <span className="text-emerald-200">
                  Target Clean OTD Price: <strong className="text-white">${cleanTargetPrice.toLocaleString()}</strong> (Direct Savings: ${junkTotal.toLocaleString()})
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Zero junk fees detected! Quote is currently free of predatory add-ons.</span>
              </div>
            )}
          </div>

          {/* 1-Click Fast Counter-Offer Scripts */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#29abe2]" />
                <span>Instant Counter-Offer Scripts</span>
              </h5>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Formal Email Offer</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(emailScript, 'email')}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#29abe2] hover:text-[#2089b5] cursor-pointer"
                  >
                    {copiedScript === 'email' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedScript === 'email' ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                  </button>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed italic bg-white p-2 rounded-lg border border-slate-200/60 font-mono">
                  "{emailScript.slice(0, 140)}..."
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Direct SMS / Text Script</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(textScript, 'sms')}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#29abe2] hover:text-[#2089b5] cursor-pointer"
                  >
                    {copiedScript === 'sms' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedScript === 'sms' ? 'Copied to Clipboard!' : 'Copy SMS'}</span>
                  </button>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed italic bg-white p-2 rounded-lg border border-slate-200/60 font-mono">
                  "{textScript}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Negotiation Script Generator Connected to OTD Calculator */}
      <NegotiationScriptGenerator
        vehicleName={formattedVehicleName}
        vehiclePrice={vehiclePrice}
        outTheDoorTotal={outTheDoorTotal}
        cleanTargetPrice={cleanTargetPrice}
        stateTax={stateTax}
        dmvFees={dmvFees}
        docFee={docFee}
        junkTotal={junkTotal}
        junkItemNames={junkItemNames}
        salespersonName={salespersonName}
        dealershipName={dealershipName}
        buyerName={buyerName}
      />
    </div>
  );
}
