export interface TourStep {
  targetId: string; // DOM ID or data-tour-target
  title: string;
  bullets: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'cash-market-intel',
    title: 'Cash Market Intel',
    bullets: [
      'Tracks real private-party cash transactions vs. dealer list prices',
      'Filters out lot markups and dealer prep fees',
      'Benchmark baseline before negotiating'
    ],
    position: 'bottom'
  },
  {
    targetId: 'quote-auditor',
    title: 'Dealer Quote Auditor',
    bullets: [
      'Flags junk fees, paint protection, and document add-ons',
      'Generates automated counter-offer scripts and target buy prices',
      'Supports any year, make, and model'
    ],
    position: 'top'
  },
  {
    targetId: 'cost-of-ownership',
    title: 'Cost of Ownership',
    bullets: [
      'Projects true 5-year maintenance, fuel, and insurance costs',
      'Calculates real-world depreciation curves and equity loss',
      'Uncovers the true cost beyond the monthly payment'
    ],
    position: 'top'
  },
  {
    targetId: 'loan-affordability',
    title: 'Loan & Affordability',
    bullets: [
      'Visualizes loan amortization schedules and total interest paid',
      'Compares APR rates and dealer financing markups',
      'Determines true purchasing power based on monthly budget'
    ],
    position: 'top'
  }
];
