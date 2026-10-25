import React from 'react';
import { 
  Layers, 
  Car, 
  Truck, 
  Zap, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

export const RELIABILITY_CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'All Categories',
    shortLabel: 'All',
    icon: Layers,
    description: 'Top 10 leaders across every vehicle class'
  },
  {
    id: 'suv',
    label: 'SUVs & Crossovers',
    shortLabel: 'SUVs',
    icon: Compass,
    description: 'AWD & high-clearance utility leaders'
  },
  {
    id: 'sedan',
    label: 'Sedans',
    shortLabel: 'Sedans',
    icon: Car,
    description: 'Commuter & executive road durability'
  },
  {
    id: 'truck',
    label: 'Trucks',
    shortLabel: 'Trucks',
    icon: Truck,
    description: 'Heavy payload & towing reliability'
  },
  {
    id: 'hybrid_ev',
    label: 'Hybrids & EVs',
    shortLabel: 'Hybrids',
    icon: Zap,
    description: 'Battery & electrified powertrain endurance'
  },
  {
    id: 'wagon_hatchback',
    label: 'Wagons & Hatchbacks',
    shortLabel: 'Wagons/Hatch',
    icon: ShieldCheck,
    description: 'Compact utility & high-mileage runabouts'
  }
];

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-8">
      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
        {RELIABILITY_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-[#29abe2]/20'
                  : 'bg-white/90 hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                isActive
                  ? 'bg-[#29abe2] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                <IconComponent size={12} />
              </div>
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                Top 10
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
