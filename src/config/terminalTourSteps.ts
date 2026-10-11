export interface TourStep {
  targetId: string; // DOM ID or data-tour-target
  title: string;
  badge?: string;
  bullets: string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'silo-recon',
    title: 'Silo 01: Pre-Lot Recon',
    badge: 'INTEL & VERIFICATION',
    bullets: [
      'Decode factory build specs & open NHTSA safety recalls before contacting dealers',
      'Audit 5-year ownership depreciation, fuel expense, and true maintenance costs',
      'Check trade-in vs. private-party market pricing and 40-point inspection list'
    ],
    position: 'bottom'
  },
  {
    targetId: 'silo-finance',
    title: 'Silo 02: Finance Trap Detectors',
    badge: 'FINANCE GUARD',
    bullets: [
      'Expose backend APR markup and calculate true monthly purchasing power',
      'Simulate lease vs. financing equity paths side-by-side',
      'Map 7-year residual depreciation decay curves to avoid negative equity'
    ],
    position: 'bottom'
  },
  {
    targetId: 'silo-closing',
    title: 'Silo 03: The Closing Table',
    badge: 'ADD-ON DEFENSE',
    bullets: [
      'Audit dealer quote sheets to isolate legitimate fees from bogus dealer add-ons',
      'Deploy tactical AI negotiation scripts and real-time dealer counter-leverage',
      'Verify 50-state statutory doc fee legal caps and mandatory tax rates'
    ],
    position: 'bottom'
  }
];
