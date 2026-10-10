import { VehicleRankingMaster } from '@/src/types/vehicleRankings';

export interface StaticRankedVehicle extends Omit<VehicleRankingMaster, 'id' | 'created_at' | 'updated_at'> {
  id: string;
  display_name: string;
}

/**
 * Strongly-typed static master dataset of CarMatrix Top-Rated Used Cars.
 * Completely self-contained with zero database reliance.
 */
export const VEHICLE_RANKINGS_DATA: StaticRankedVehicle[] = [
  // ============================================================================
  // TIER 1: SUB-$6K CASH BENCHMARKS (< $6k street cash / < $7.5k dealer retail)
  // ============================================================================
  {
    id: 'pontiac-vibe-2005-2008',
    make: 'Pontiac',
    model: 'Vibe / Toyota Matrix',
    year_start: 2005,
    year_end: 2008,
    display_name: '2005–2008 Pontiac Vibe / Toyota Matrix',
    body_type: 'hatchback',
    engine_notes: 'Toyota 1.8L 1ZZ-FE / 4-Speed Auto',
    dealer_retail_mid: 5600,
    private_party_mid: 4350,
    reliability_rating: 4.7,
    five_year_maintenance_cost: 3200,
    depreciation_rate_pct: 18.5,
    key_strengths: [
      'Under-the-skin Toyota Matrix reliability at domestic pricing',
      'Fold-flat hard plastic cargo floor and hatchback versatility',
      'Bulletproof timing chain engine requiring minimal routine maintenance'
    ],
    inspection_alerts: [
      'Inspect valve cover gasket for weeping onto exhaust manifold',
      'Check intake manifold gasket (hard starts in cold weather)',
      'Confirm odometer is still advancing (early 299,999 mile digital lockup glitch)'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'buick-lesabre-2000-2005',
    make: 'Buick',
    model: 'LeSabre',
    year_start: 2000,
    year_end: 2005,
    display_name: '2000–2005 Buick LeSabre',
    body_type: 'sedan',
    engine_notes: 'GM 3800 Series II 3.8L V6 (L36)',
    dealer_retail_mid: 4900,
    private_party_mid: 3800,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 2900,
    depreciation_rate_pct: 14.0,
    key_strengths: [
      'Legendary GM 3800 Series II powertrain capable of 300k+ miles',
      'Extremely cheap and abundant replacement parts at any local auto store',
      'Plush highway ride and exceptional front bench seat comfort'
    ],
    inspection_alerts: [
      'Inspect plastic upper intake manifold and coolant elbows for leaks (Dorman aluminum upgrade recommended)',
      'Check rocker panel and rear brake lines for salt corrosion',
      'Confirm GM 4T65-E transmission shifts smoothly without delayed forward engagement'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'scion-xb-2004-2006',
    make: 'Scion',
    model: 'xB (1st Gen)',
    year_start: 2004,
    year_end: 2006,
    display_name: '2004–2006 Scion xB (1st Gen)',
    body_type: 'wagon',
    engine_notes: 'Toyota 1.5L 1NZ-FE 4-Cylinder',
    dealer_retail_mid: 5900,
    private_party_mid: 4600,
    reliability_rating: 4.65,
    five_year_maintenance_cost: 3100,
    depreciation_rate_pct: 16.0,
    key_strengths: [
      'Rock-solid Toyota Yaris mechanical underpinnings in a spacious box layout',
      '31+ MPG highway efficiency with low insurance premiums',
      'Simple mechanical architecture with zero complex electronic gremlins'
    ],
    inspection_alerts: [
      'Check front suspension struts and ball joints on high-mileage examples',
      'Examine oil dipstick for sludge if oil change receipts are missing',
      'Check windshield for stone chips due to upright windshield angle'
    ],
    is_clean_title_only: true,
    is_active: true
  },

  // ============================================================================
  // TIER 2: $6K–$11K CASH BENCHMARKS ($6k–$11k street cash / $7.5k–$13.5k dealer)
  // ============================================================================
  {
    id: 'mazda-3-2012-2015',
    make: 'Mazda',
    model: 'Mazda 3',
    year_start: 2012,
    year_end: 2015,
    display_name: '2012–2015 Mazda 3',
    body_type: 'sedan',
    engine_notes: 'SkyActiv-G 2.0L DOHC / 6-Speed SkyActiv Drive Auto',
    dealer_retail_mid: 10800,
    private_party_mid: 8800,
    reliability_rating: 4.55,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 22.0,
    key_strengths: [
      'SkyActiv-G naturally aspirated engine avoids turbo complexity',
      'Sharp athletic chassis tuning that out-handles Civic and Corolla',
      'Traditional geared 6-speed automatic transmission avoids CVT failures'
    ],
    inspection_alerts: [
      'Verify vehicle is equipped with SkyActiv-G (blue engine cover), not the older non-SkyActiv MZR',
      'Check passenger-side hydraulic motor mount for black fluid leakage',
      'Inspect infotainment master control knob and touchscreen for phantom touch'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-prius-2010-2013',
    make: 'Toyota',
    model: 'Prius',
    year_start: 2010,
    year_end: 2013,
    display_name: '2010–2013 Toyota Prius',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota Hybrid Synergy Drive 1.8L 2ZR-FXE',
    dealer_retail_mid: 9900,
    private_party_mid: 7950,
    reliability_rating: 4.4,
    five_year_maintenance_cost: 4400,
    depreciation_rate_pct: 24.0,
    key_strengths: [
      'Unmatched 48–51 MPG real-world fuel economy',
      'Regenerative braking preserves brake pads for 100,000+ miles',
      'Exceptional utility with hatchback cargo volume'
    ],
    inspection_alerts: [
      'Connect OBD2 reader (Dr. Prius app) to test individual hybrid battery cell block voltages',
      'Listen for cold-start engine shudder caused by clogged EGR cooler or failing head gasket',
      'Inspect brake actuator assembly for continuous high-frequency buzzing pump cycles'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-civic-2012-2015',
    make: 'Honda',
    model: 'Civic',
    year_start: 2012,
    year_end: 2015,
    display_name: '2012–2015 Honda Civic',
    body_type: 'sedan',
    engine_notes: 'Honda 1.8L R18Z1 i-VTEC / 5-Speed Auto',
    dealer_retail_mid: 11500,
    private_party_mid: 9400,
    reliability_rating: 4.6,
    five_year_maintenance_cost: 3800,
    depreciation_rate_pct: 20.5,
    key_strengths: [
      'Proven single-overhead-cam R18 engine paired with reliable geared 5-speed automatic (pre-CVT)',
      'Ultra-low ownership costs and top-tier resale liquidity in private markets',
      'Avoids the oil dilution issues of later 1.5L turbo direct-injection motors'
    ],
    inspection_alerts: [
      'Verify paint condition (Honda recall coverage for roof/hood clear coat peeling)',
      'Check electric power steering rack for centering notchiness',
      'Ensure automatic transmission fluid was serviced with genuine Honda DW-1'
    ],
    is_clean_title_only: true,
    is_active: true
  },

  // ============================================================================
  // TIER 3: $11K–$18K CASH BENCHMARKS ($11k–$18k street cash / $13.5k–$22k dealer)
  // ============================================================================
  {
    id: 'toyota-rav4-2014-2017',
    make: 'Toyota',
    model: 'RAV4',
    year_start: 2014,
    year_end: 2017,
    display_name: '2014–2017 Toyota RAV4',
    body_type: 'suv',
    engine_notes: 'Toyota 2.5L 2AR-FE / 6-Speed Electronically Controlled Auto',
    dealer_retail_mid: 18200,
    private_party_mid: 15200,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 4600,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      '2AR-FE 2.5L naturally aspirated 4-cylinder is among the most durable modern Toyota powertrains',
      'Standard 6-speed automatic transmission avoids fragile CVTs',
      'High ground clearance with proven Toyota electronic AWD coupler'
    ],
    inspection_alerts: [
      'Verify torque converter shutter software update was applied (TSB-0037-14)',
      'Check rear electric differential coupler for humming bearing noise at 35–45 MPH',
      'Inspect liftgate strut hinges for binding or creaking'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-cr-v-2013-2016',
    make: 'Honda',
    model: 'CR-V',
    year_start: 2013,
    year_end: 2016,
    display_name: '2013–2016 Honda CR-V',
    body_type: 'suv',
    engine_notes: 'Honda 2.4L K24Z7 / K24W Earth Dreams DOHC i-VTEC',
    dealer_retail_mid: 16800,
    private_party_mid: 14100,
    reliability_rating: 4.65,
    five_year_maintenance_cost: 4500,
    depreciation_rate_pct: 23.0,
    key_strengths: [
      'Class-leading rear legroom and spring-loaded fold-down rear seats',
      'Rock-solid K24 four-cylinder engine with stellar mechanical longevity',
      'Real Time AWD with Intelligent Control provides reliable traction'
    ],
    inspection_alerts: [
      'Listen on cold start for 2-second rattle from VTC cam actuator gear',
      'Inspect rear differential fluid service history (requires Honda Dual Pump Fluid II to prevent low-speed shudder)',
      'Check starter motor engagement for intermittent no-crank hesitation'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-rx-350-2011-2015',
    make: 'Lexus',
    model: 'RX 350',
    year_start: 2011,
    year_end: 2015,
    display_name: '2011–2015 Lexus RX 350',
    body_type: 'suv',
    engine_notes: 'Toyota 3.5L 2GR-FE V6 / 6-Speed Auto',
    dealer_retail_mid: 19200,
    private_party_mid: 15900,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 5600,
    depreciation_rate_pct: 24.5,
    key_strengths: [
      'Executive-grade interior quietness and Mark Levinson sound engineering',
      'Silky smooth 2GR-FE 3.5L V6 with zero direct-injection carbon buildup (port-injected)',
      'Highest retained reliability score in midsize luxury crossover class'
    ],
    inspection_alerts: [
      'Inspect timing cover for slow oil seepage at rear passenger cylinder head',
      'Check dashboard material for sticky/melting texture (covered under previous Lexus customer campaign)',
      'Verify electric water pump has not weeped pink coolant crust around pulley'
    ],
    is_clean_title_only: true,
    is_active: true
  },

  // ============================================================================
  // TIER 4: $18K–$26K CASH BENCHMARKS ($18k–$26k street cash / $22k–$32k dealer)
  // ============================================================================
  {
    id: 'toyota-highlander-2017-2020',
    make: 'Toyota',
    model: 'Highlander',
    year_start: 2017,
    year_end: 2020,
    display_name: '2017–2020 Toyota Highlander',
    body_type: 'suv',
    engine_notes: 'Toyota 3.5L 2GR-FKS V6 / 8-Speed Direct Shift Auto',
    dealer_retail_mid: 27500,
    private_party_mid: 23600,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 5200,
    depreciation_rate_pct: 22.0,
    key_strengths: [
      'Seating for 8 passengers with high crash safety ratings',
      'Robust 295 HP direct and port fuel-injected D-4S powertrain',
      'Unmatched family utility with high resale retention'
    ],
    inspection_alerts: [
      'Test 8-speed automatic transmission at low parking lot speeds (verify shift quality bulletin TSB-0160-18)',
      'Check water pump weep hole for dried pink coolant deposits',
      'Inspect roof rack rail seals for headliner water spotting'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'subaru-outback-2018-2021',
    make: 'Subaru',
    model: 'Outback',
    year_start: 2018,
    year_end: 2021,
    display_name: '2018–2021 Subaru Outback',
    body_type: 'wagon',
    engine_notes: 'Subaru 2.5L FB25 DOHC / Lineartronic CVT',
    dealer_retail_mid: 23900,
    private_party_mid: 20400,
    reliability_rating: 4.45,
    five_year_maintenance_cost: 5800,
    depreciation_rate_pct: 27.0,
    key_strengths: [
      'Symmetrical All-Wheel Drive with 8.7 inches of ground clearance',
      'Subaru EyeSight active safety suite standard on later model years',
      'Wagon roofline with integrated fold-out crossbars'
    ],
    inspection_alerts: [
      'Inspect front lower control arm rear bushings for torn rubber tears',
      'Confirm Lineartronic CVT was serviced every 30k-40k miles (listen for whining pump bearing)',
      'Check windshield for thermal cracking along heating element grid line'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-tacoma-2016-2020',
    make: 'Toyota',
    model: 'Tacoma',
    year_start: 2016,
    year_end: 2020,
    display_name: '2016–2020 Toyota Tacoma',
    body_type: 'truck',
    engine_notes: 'Toyota 3.5L 2GR-FKS V6 / 6-Speed AC60E Auto',
    dealer_retail_mid: 29800,
    private_party_mid: 25800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 4900,
    depreciation_rate_pct: 14.5,
    key_strengths: [
      'Industry-leading resale value retention (lowest depreciation rate in class)',
      'Part-time 4WD system with robust transfer case and composite truck bed',
      'High off-road clearance with extensive global aftermarket modification support'
    ],
    inspection_alerts: [
      'Verify automatic transmission gear hunt ECU flash update was completed',
      'Inspect boxed frame rails and leaf springs for surface rust in humid regions',
      'Check rear differential housing for weeping pinion seal'
    ],
    is_clean_title_only: true,
    is_active: true
  }
];
