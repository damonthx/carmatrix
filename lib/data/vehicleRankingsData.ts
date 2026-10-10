import { VehicleRankingMaster } from '@/src/types/vehicleRankings';

export interface StaticRankedVehicle extends Omit<VehicleRankingMaster, 'id' | 'created_at' | 'updated_at'> {
  id: string;
  display_name: string;
}

/**
 * Strongly-typed static master dataset of CarMatrix Top-Rated Used Cars.
 * Completely self-contained with zero database reliance.
 * Features 40+ thoroughly vetted, real-world vehicles representing every category across all price tiers.
 */
export const VEHICLE_RANKINGS_DATA: StaticRankedVehicle[] = [
  // ============================================================================
  // TIER 1: SUB-$6K CASH BENCHMARKS (< $6k street cash / < $7.5k dealer retail)
  // ============================================================================
  {
    id: 'honda-cr-v-2002-2006',
    make: 'Honda',
    model: 'CR-V (2nd Gen)',
    year_start: 2002,
    year_end: 2006,
    display_name: '2002–2006 Honda CR-V (2nd Gen)',
    body_type: 'suv',
    engine_notes: 'Honda 2.4L K24A1 i-VTEC / 4-5 Speed Auto',
    dealer_retail_mid: 6200,
    private_party_mid: 4850,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 3300,
    depreciation_rate_pct: 15.0,
    key_strengths: [
      'Legendary K24 naturally aspirated powertrain routinely surpasses 300,000 miles',
      'High driver visibility, fold-out cargo picnic table, and low insurance costs',
      'Simple mechanical architecture with cheap, widely available replacement parts'
    ],
    inspection_alerts: [
      'Verify A/C compressor was upgraded (early "black death" compressor shrapnel flaw)',
      'Check front lower control arm compliance bushings for tearing and steering pull',
      'Inspect rear differential fluid service history (requires Honda Dual Pump Fluid)'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-rav4-2001-2005',
    make: 'Toyota',
    model: 'RAV4 (2nd Gen)',
    year_start: 2001,
    year_end: 2005,
    display_name: '2001–2005 Toyota RAV4 (2nd Gen)',
    body_type: 'suv',
    engine_notes: 'Toyota 2.0L 1AZ-FE / 2.4L 2AZ-FE / 4-Speed Auto',
    dealer_retail_mid: 6600,
    private_party_mid: 5250,
    reliability_rating: 4.65,
    five_year_maintenance_cost: 3400,
    depreciation_rate_pct: 16.0,
    key_strengths: [
      'Indestructible Toyota 4-cylinder engine with timing chain longevity',
      'Agile compact footprint with mechanical center-locking differential AWD',
      'Exceptional street-market resale liquidity and minimal annual depreciation'
    ],
    inspection_alerts: [
      'Test ECM module for transmission harsh 2nd-to-3rd shift shudder (TSB-TC002-06)',
      'Inspect valve cover gasket and front crank seal for oil seepage',
      'Check rear tailgate hinges for sagging caused by heavy exterior spare tire'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'pontiac-vibe-2005-2008',
    make: 'Pontiac',
    model: 'Vibe / Toyota Matrix',
    year_start: 2005,
    year_end: 2008,
    display_name: '2005–2008 Pontiac Vibe / Toyota Matrix',
    body_type: 'wagon',
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
      'Inspect plastic upper intake manifold and coolant elbows for leaks (aluminum upgrade recommended)',
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
    body_type: 'hatchback',
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
  {
    id: 'toyota-corolla-2003-2008',
    make: 'Toyota',
    model: 'Corolla',
    year_start: 2003,
    year_end: 2008,
    display_name: '2003–2008 Toyota Corolla (9th Gen)',
    body_type: 'sedan',
    engine_notes: 'Toyota 1.8L 1ZZ-FE / 4-Speed Auto',
    dealer_retail_mid: 5800,
    private_party_mid: 4500,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 2950,
    depreciation_rate_pct: 13.0,
    key_strengths: [
      'Benchmark benchmark for sub-$5k daily commuter reliability',
      'Timing chain engine that runs smoothly on basic conventional oil',
      '35 MPG highway with minimal wearable parts replacements'
    ],
    inspection_alerts: [
      'Inspect intake manifold gasket for vacuum leak (hunting idle when cold)',
      'Check catalytic converter performance codes (P0420 sensor diagnosis)',
      'Confirm air conditioning blows ice cold (check A/C relay)'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'ford-ranger-2001-2006',
    make: 'Ford',
    model: 'Ranger',
    year_start: 2001,
    year_end: 2006,
    display_name: '2001–2006 Ford Ranger',
    body_type: 'truck',
    engine_notes: 'Ford 2.3L Duratec DOHC / 3.0L Vulcan V6',
    dealer_retail_mid: 6400,
    private_party_mid: 4950,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 3500,
    depreciation_rate_pct: 12.0,
    key_strengths: [
      'True body-on-frame compact truck utility for under $5,000 cash',
      'Duratec 2.3L delivers 26+ MPG highway with Mazda-engineered durability',
      'Simple rear-wheel-drive platform with DIY-friendly access to all components'
    ],
    inspection_alerts: [
      'Inspect rear leaf spring shackles and bed crossmembers for rust perforation',
      'Check clutch slave cylinder on manual transmissions for hydraulic fluid seepage',
      'Verify front ball joints and tie rod ends for play'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-prius-2004-2009',
    make: 'Toyota',
    model: 'Prius (2nd Gen)',
    year_start: 2004,
    year_end: 2009,
    display_name: '2004–2009 Toyota Prius (2nd Gen)',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota 1.5L 1NZ-FXE Hybrid Synergy Drive',
    dealer_retail_mid: 5500,
    private_party_mid: 4200,
    reliability_rating: 4.55,
    five_year_maintenance_cost: 3800,
    depreciation_rate_pct: 17.0,
    key_strengths: [
      'Gen 2 Prius is widely regarded as one of the most durable hybrids ever built',
      '45–48 MPG fuel economy on regular unleaded fuel',
      'Regenerative braking eliminates routine brake pad replacements'
    ],
    inspection_alerts: [
      'Check hybrid battery cell health with OBD2 scanner (Dr. Prius app)',
      'Listen for hybrid inverter water pump failure (check coolant reservoir turbulence)',
      'Confirm combination meter speedometer display powers up consistently'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'chevrolet-silverado-1999-2004',
    make: 'Chevrolet',
    model: 'Silverado 1500',
    year_start: 1999,
    year_end: 2004,
    display_name: '1999–2004 Chevrolet Silverado 1500 (GMT800)',
    body_type: 'truck',
    engine_notes: 'Vortec 4.8L / 5.3L V8 (LM7) / 4L60E Auto',
    dealer_retail_mid: 7100,
    private_party_mid: 5500,
    reliability_rating: 4.4,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 11.0,
    key_strengths: [
      'GMT800 platform Vortec V8 is famous for reaching 350,000+ miles with basic maintenance',
      'Massive towing capability and interior cab volume at budget cash pricing',
      'Universal replacement parts available in every salvage yard and parts store'
    ],
    inspection_alerts: [
      'Inspect brake lines for rust corrosion along frame rail under driver seat',
      'Check 4L60E transmission fluid color and ensure 2nd to 3rd gear shift is crisp',
      'Inspect rocker panels and cab corners for rust bubbles'
    ],
    is_clean_title_only: true,
    is_active: true
  },

  // ============================================================================
  // TIER 2: $6K–$11K CASH BENCHMARKS ($6k–$11k street cash / $7.5k–$13.5k dealer)
  // ============================================================================
  {
    id: 'honda-cr-v-2007-2011',
    make: 'Honda',
    model: 'CR-V (3rd Gen)',
    year_start: 2007,
    year_end: 2011,
    display_name: '2007–2011 Honda CR-V (3rd Gen)',
    body_type: 'suv',
    engine_notes: 'Honda 2.4L K24Z1 DOHC i-VTEC / 5-Speed Geared Auto',
    dealer_retail_mid: 10600,
    private_party_mid: 8400,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 3900,
    depreciation_rate_pct: 19.0,
    key_strengths: [
      'Bulletproof K24 engine paired with traditional geared 5-speed automatic (pre-CVT)',
      'Exceptional IIHS top safety ratings with cavernous rear cargo volume',
      'Among the highest retained value and fastest selling pre-owned crossovers in America'
    ],
    inspection_alerts: [
      'Listen on cold start for brief VTC actuator cam sprocket rattle (TSB-09-010)',
      'Check rear differential for low-speed turning moan (service with Dual Pump Fluid II)',
      'Inspect A/C compressor clutch coil for proper engagement'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-rav4-2006-2012',
    make: 'Toyota',
    model: 'RAV4 (3rd Gen)',
    year_start: 2006,
    year_end: 2012,
    display_name: '2006–2012 Toyota RAV4 (3rd Gen)',
    body_type: 'suv',
    engine_notes: 'Toyota 2.5L 2AR-FE 4-Cyl or 3.5L 2GR-FE V6 / Geared Auto',
    dealer_retail_mid: 11200,
    private_party_mid: 8900,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 18.0,
    key_strengths: [
      'Late 2009-2012 2.5L 2AR-FE engine is one of the most reliable 4-cylinders ever produced',
      'Optional 269 HP 3.5L 2GR-FE V6 delivers sports-car acceleration with Toyota reliability',
      'Generous interior space with optional rare 3rd-row jump seats'
    ],
    inspection_alerts: [
      'On 2006-2008 models with early 2.4L 2AZ-FE, verify oil consumption recall repair was completed',
      'Inspect intermediate steering shaft for clunking during low-speed turns',
      'Check rear differential electric electromagnetic coupler for bearing whine'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'mazda-cx-5-2013-2016',
    make: 'Mazda',
    model: 'CX-5',
    year_start: 2013,
    year_end: 2016,
    display_name: '2013–2016 Mazda CX-5',
    body_type: 'suv',
    engine_notes: 'SkyActiv-G 2.0L / 2.5L DOHC / 6-Speed SkyActiv-Drive Auto',
    dealer_retail_mid: 12200,
    private_party_mid: 9600,
    reliability_rating: 4.65,
    five_year_maintenance_cost: 4200,
    depreciation_rate_pct: 22.0,
    key_strengths: [
      'Sharp handling dynamics that vastly outperform competitive compact crossovers',
      'Traditional torque-converter 6-speed automatic transmission completely avoids CVT issues',
      'High-compression naturally aspirated SkyActiv engine achieves 30+ MPG highway'
    ],
    inspection_alerts: [
      'Prioritize 2014+ models with the more energetic 2.5L engine over early 2.0L',
      'Inspect right passenger-side hydraulic engine mount for fluid leakage',
      'Check rear brake calipers and electric parking brake actuators for sticking'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'subaru-forester-2009-2013',
    make: 'Subaru',
    model: 'Forester (3rd Gen SH)',
    year_start: 2009,
    year_end: 2013,
    display_name: '2009–2013 Subaru Forester (SH)',
    body_type: 'suv',
    engine_notes: 'Subaru 2.5L FB25 DOHC (Timing Chain) / 4-Speed Auto',
    dealer_retail_mid: 9900,
    private_party_mid: 7800,
    reliability_rating: 4.4,
    five_year_maintenance_cost: 4600,
    depreciation_rate_pct: 21.5,
    key_strengths: [
      '2011+ models feature FB25 timing chain engine, eliminating legacy timing belt services',
      'Standard Symmetrical All-Wheel Drive with 8.7 inches of ground clearance',
      'Exceptional outward glass visibility and commanding driving position'
    ],
    inspection_alerts: [
      'Monitor oil consumption dipstick levels on early FB25 motors (short block warranty campaign)',
      'Inspect front lower control arm rear bushings for torn rubber tears',
      'Listen for rear wheel bearing humming noise at highway cruise speeds'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-rx-350-2007-2010',
    make: 'Lexus',
    model: 'RX 350',
    year_start: 2007,
    year_end: 2010,
    display_name: '2007–2010 Lexus RX 350',
    body_type: 'suv',
    engine_notes: 'Toyota 3.5L 2GR-FE V6 / 5-Speed Auto',
    dealer_retail_mid: 12400,
    private_party_mid: 9800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 5100,
    depreciation_rate_pct: 20.0,
    key_strengths: [
      'Luxury serenity, real leather seating, and whisper-quiet cabin acoustics under $10,000 cash',
      'Smooth 2GR-FE 3.5L V6 engine utilizes timing chain instead of earlier RX330 timing belt',
      'Benchmark luxury crossover reliability with vast aftermarket parts support'
    ],
    inspection_alerts: [
      'Inspect rear passenger cylinder bank timing cover for minor oil sweating',
      'Check dashboard for sticky/cracking surface material (previous warranty campaign)',
      'Confirm rubber oil cooler line was replaced with the updated metal line (L-SB-0043-09)'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-venza-2009-2012',
    make: 'Toyota',
    model: 'Venza',
    year_start: 2009,
    year_end: 2012,
    display_name: '2009–2012 Toyota Venza',
    body_type: 'suv',
    engine_notes: 'Toyota 2.7L 1AR-FE 4-Cyl or 3.5L 2GR-FE V6 / 6-Speed Auto',
    dealer_retail_mid: 11400,
    private_party_mid: 8950,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 4300,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      'Camry-based wagon/crossover chassis offers huge passenger legroom and lower step-in height',
      'Proven 6-speed automatic transmission avoids CVT reliability pitfalls',
      'Overlooked gem in used market trading for $2,000 less than comparable Highlander models'
    ],
    inspection_alerts: [
      'Inspect front axle drive shaft boots for grease splatter',
      'Check 20-inch factory alloy wheels for tire replacement cost considerations',
      'Verify panoramic sunroof sunshade operates without jamming tracks'
    ],
    is_clean_title_only: true,
    is_active: true
  },
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
      'Verify vehicle is equipped with SkyActiv-G (blue engine cover), not older MZR',
      'Check passenger-side hydraulic motor mount for black fluid leakage',
      'Inspect infotainment master control knob and touchscreen for phantom touch'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-prius-2010-2013',
    make: 'Toyota',
    model: 'Prius (3rd Gen)',
    year_start: 2010,
    year_end: 2013,
    display_name: '2010–2013 Toyota Prius (3rd Gen)',
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
      'Connect OBD2 reader (Dr. Prius app) to test individual hybrid battery block voltages',
      'Listen for cold-start engine shudder caused by clogged EGR cooler or failing head gasket',
      'Inspect brake actuator assembly for continuous high-frequency buzzing pump cycles'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-civic-2012-2015',
    make: 'Honda',
    model: 'Civic (9th Gen)',
    year_start: 2012,
    year_end: 2015,
    display_name: '2012–2015 Honda Civic (9th Gen)',
    body_type: 'sedan',
    engine_notes: 'Honda 1.8L R18Z1 i-VTEC / 5-Speed Geared Auto',
    dealer_retail_mid: 11500,
    private_party_mid: 9400,
    reliability_rating: 4.6,
    five_year_maintenance_cost: 3800,
    depreciation_rate_pct: 20.5,
    key_strengths: [
      'Single-overhead-cam R18 engine paired with reliable geared 5-speed automatic (pre-CVT)',
      'Ultra-low ownership costs and top-tier resale liquidity in private markets',
      'Avoids the oil dilution issues of later 1.5L turbo direct-injection motors'
    ],
    inspection_alerts: [
      'Verify paint condition (Honda warranty coverage for roof/hood clear coat peeling)',
      'Check electric power steering rack for centering notchiness',
      'Ensure automatic transmission fluid was serviced with genuine Honda DW-1'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-camry-2012-2014',
    make: 'Toyota',
    model: 'Camry (7th Gen)',
    year_start: 2012,
    year_end: 2014,
    display_name: '2012–2014 Toyota Camry (7th Gen)',
    body_type: 'sedan',
    engine_notes: 'Toyota 2.5L 2AR-FE / 6-Speed Electronically Controlled Auto',
    dealer_retail_mid: 12200,
    private_party_mid: 9800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 3950,
    depreciation_rate_pct: 19.0,
    key_strengths: [
      '2AR-FE engine is arguably the most bulletproof midsize commuter engine of the 2010s',
      'Generous cabin space, quiet ride, and low insurance costs',
      'Avoids touch-screen complexities with durable physical dash controls'
    ],
    inspection_alerts: [
      'Confirm torque converter shudder software update (TSB-0085-15) was applied',
      'Inspect front lower ball joints and strut mounts for minor clunking over bumps',
      'Verify water pump weep hole is dry and free of pink crust'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-camry-hybrid-2012-2014',
    make: 'Toyota',
    model: 'Camry Hybrid',
    year_start: 2012,
    year_end: 2014,
    display_name: '2012–2014 Toyota Camry Hybrid',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota Hybrid Synergy Drive 2.5L 2AR-FXE',
    dealer_retail_mid: 11600,
    private_party_mid: 9200,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      '40+ MPG in a spacious full-sized midsize sedan package',
      '200 net system HP provides brisk, effortless merging acceleration',
      'Bulletproof eCVT planetary gearset has no belts, clutches, or failure points'
    ],
    inspection_alerts: [
      'Inspect high-voltage battery cooling fan intake duct under rear seat for lint clogging',
      'Scan traction battery delta state of charge using Dr. Prius diagnostic app',
      'Check inverter coolant pump for steady circulation turbulence'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'nissan-frontier-2008-2014',
    make: 'Nissan',
    model: 'Frontier (D40)',
    year_start: 2008,
    year_end: 2014,
    display_name: '2008–2014 Nissan Frontier',
    body_type: 'truck',
    engine_notes: 'Nissan 4.0L VQ40DE V6 / 5-Speed Auto',
    dealer_retail_mid: 11200,
    private_party_mid: 8900,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 4400,
    depreciation_rate_pct: 18.0,
    key_strengths: [
      'Trades for $3,000–$5,000 less than a comparable Tacoma while offering equal durability',
      'Stout 261 HP VQ40DE V6 provides great towing and bed payload capacities',
      'Rugged boxed steel ladder frame with zero complicated electronic modules'
    ],
    inspection_alerts: [
      'On 2008-2010 models, verify radiator was upgraded to avoid SMOD (Strawberry Milkshake of Death)',
      'Check rear axle breather vent (replace with raised off-road breather to save axle seals)',
      'Listen for timing chain guide whining noise at 2,000 RPM'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-tacoma-2005-2009',
    make: 'Toyota',
    model: 'Tacoma (2nd Gen Early)',
    year_start: 2005,
    year_end: 2009,
    display_name: '2005–2009 Toyota Tacoma (2nd Gen)',
    body_type: 'truck',
    engine_notes: 'Toyota 2.7L 2TR-FE 4-Cyl or 4.0L 1GR-FE V6',
    dealer_retail_mid: 12900,
    private_party_mid: 10400,
    reliability_rating: 4.75,
    five_year_maintenance_cost: 4500,
    depreciation_rate_pct: 11.5,
    key_strengths: [
      'Iconic resale value retention—virtually depreciates at less than 3% annually',
      'Composite inner truck bed prevents denting and bed floor rust',
      'Part-time 4WD transfer case with bulletproof mechanical durability'
    ],
    inspection_alerts: [
      'Crucial: Inspect fully boxed frame rails near catalytic converters for rust perforation recall coverage',
      'Check rear leaf springs for cracked leaves or excessive sag',
      'Inspect front wheel hub assemblies for bearing play'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-fit-2011-2014',
    make: 'Honda',
    model: 'Fit (2nd Gen GE8)',
    year_start: 2011,
    year_end: 2014,
    display_name: '2011–2014 Honda Fit (GE8)',
    body_type: 'hatchback',
    engine_notes: 'Honda 1.5L L15A7 i-VTEC / 5-Speed Geared Auto',
    dealer_retail_mid: 9200,
    private_party_mid: 7400,
    reliability_rating: 4.7,
    five_year_maintenance_cost: 3200,
    depreciation_rate_pct: 17.0,
    key_strengths: [
      'Ingenious "Magic Seats" configuration creates small-van-like cargo capacity',
      '35 MPG highway with bulletproof port-injected engine and geared 5-speed automatic',
      'Nimble city parking dimensions with go-kart steering responsiveness'
    ],
    inspection_alerts: [
      'Inspect spark plug torque specs (known Honda factory under-torque issue on #2 and #3 cylinder)',
      'Check rear spare tire wheel well for rainwater ingress through tailgate seam',
      'Confirm A/C condenser has not been punctured by road gravel'
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
    model: 'RAV4 (4th Gen)',
    year_start: 2014,
    year_end: 2017,
    display_name: '2014–2017 Toyota RAV4 (4th Gen)',
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
    model: 'CR-V (4th Gen)',
    year_start: 2013,
    year_end: 2016,
    display_name: '2013–2016 Honda CR-V (4th Gen)',
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
      'Inspect rear differential fluid service history (requires Honda Dual Pump Fluid II)',
      'Check starter motor engagement for intermittent no-crank hesitation'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'mazda-cx-5-2015-2018',
    make: 'Mazda',
    model: 'CX-5 (Facelift & 2nd Gen)',
    year_start: 2015,
    year_end: 2018,
    display_name: '2015–2018 Mazda CX-5',
    body_type: 'suv',
    engine_notes: 'SkyActiv-G 2.5L DOHC / 6-Speed SkyActiv-Drive Auto',
    dealer_retail_mid: 17600,
    private_party_mid: 14800,
    reliability_rating: 4.7,
    five_year_maintenance_cost: 4400,
    depreciation_rate_pct: 22.5,
    key_strengths: [
      'Near-luxury interior quietness and premium dash fit-and-finish',
      'Geared 6-speed automatic transmission avoids annoying CVT rubber-band feeling',
      'High safety crash ratings and Mazda i-Activ AWD predictive torque transfer'
    ],
    inspection_alerts: [
      'Check LED daytime running lamp accent strip (known flicker warranty replacement)',
      'Inspect front brake rotors for premature lateral runout pulsing',
      'Verify automatic transmission shifts smoothly between 1st and 2nd gears'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-rx-350-2011-2015',
    make: 'Lexus',
    model: 'RX 350 (3rd Gen)',
    year_start: 2011,
    year_end: 2015,
    display_name: '2011–2015 Lexus RX 350 (3rd Gen)',
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
      'Check dashboard material for sticky/melting texture',
      'Verify water pump has not weeped pink coolant crust around pulley'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-highlander-2011-2014',
    make: 'Toyota',
    model: 'Highlander (2nd Gen Facelift)',
    year_start: 2011,
    year_end: 2014,
    display_name: '2011–2014 Toyota Highlander',
    body_type: 'suv',
    engine_notes: 'Toyota 3.5L 2GR-FE V6 / 5-Speed Auto',
    dealer_retail_mid: 17500,
    private_party_mid: 14600,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 4900,
    depreciation_rate_pct: 20.0,
    key_strengths: [
      'Three rows of seating with unmatched midsize crossover reliability',
      'Port-injected 2GR-FE 3.5L V6 routinely passes 250,000 miles with zero drama',
      'Smooth, comfortable suspension damping ideal for family road trips'
    ],
    inspection_alerts: [
      'Inspect engine oil cooler lines for metal replacement update',
      'Check steering intermediate shaft for clunking during low-speed maneuvering',
      'Verify rear air conditioning blower operates at all fan speeds'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'subaru-outback-2014-2018',
    make: 'Subaru',
    model: 'Outback (5th Gen)',
    year_start: 2014,
    year_end: 2018,
    display_name: '2014–2018 Subaru Outback',
    body_type: 'suv',
    engine_notes: 'Subaru 2.5L FB25 DOHC / Lineartronic CVT',
    dealer_retail_mid: 16500,
    private_party_mid: 13800,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 5100,
    depreciation_rate_pct: 24.0,
    key_strengths: [
      'Full 8.7 inches of ground clearance with outstanding all-weather Symmetrical AWD',
      'Massive rear cargo volume with fold-out roof crossbars built right into the rack',
      'Advanced Subaru EyeSight active driver assist available on Premium and Limited trims'
    ],
    inspection_alerts: [
      'Inspect Lineartronic CVT fluid maintenance history (100k warranty extension campaign)',
      'Check front lower control arm rear oil-filled bushings for cracking',
      'Inspect windshield for thermal cracks along de-icer wiper grid'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-camry-2015-2017',
    make: 'Toyota',
    model: 'Camry (7.5 Gen Facelift)',
    year_start: 2015,
    year_end: 2017,
    display_name: '2015–2017 Toyota Camry',
    body_type: 'sedan',
    engine_notes: 'Toyota 2.5L 2AR-FE / 6-Speed Auto',
    dealer_retail_mid: 16400,
    private_party_mid: 13900,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 3800,
    depreciation_rate_pct: 18.0,
    key_strengths: [
      'Refined facelift body structure with 2,000 newly engineered parts over 2014',
      'Peak iteration of the 2AR-FE engine with virtually zero known mechanical flaws',
      'Cheap routine maintenance and exceptionally low cost-per-mile statistics'
    ],
    inspection_alerts: [
      'Confirm automatic transmission fluid flush has been performed periodically',
      'Check touch screen digitizer response for dead zones',
      'Inspect brake pads and rotors for normal wear'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-accord-2013-2017',
    make: 'Honda',
    model: 'Accord (9th Gen)',
    year_start: 2013,
    year_end: 2017,
    display_name: '2013–2017 Honda Accord (9th Gen)',
    body_type: 'sedan',
    engine_notes: 'Honda 2.4L Earth Dreams K24W / CVT or 3.5L V6 6-Speed',
    dealer_retail_mid: 15900,
    private_party_mid: 13500,
    reliability_rating: 4.7,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      'Widely regarded as one of the best balanced family sedans ever made',
      'Remarkable fuel economy (34+ MPG highway) with brisk throttle response',
      'Huge second-row executive legroom and crisp Honda steering feel'
    ],
    inspection_alerts: [
      'Inspect starter motor (intermittent no-crank covered under service bulletin)',
      'Check drive belt tensioner for rattling vibration at idle',
      'Verify battery sensor cable on negative terminal recall was performed'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-prius-2016-2019',
    make: 'Toyota',
    model: 'Prius (4th Gen TNGA)',
    year_start: 2016,
    year_end: 2019,
    display_name: '2016–2019 Toyota Prius (4th Gen)',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota TNGA 1.8L 2ZR-FXE Hybrid Synergy Drive',
    dealer_retail_mid: 18100,
    private_party_mid: 15400,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 3900,
    depreciation_rate_pct: 19.5,
    key_strengths: [
      'Incredible 54 MPG EPA combined fuel efficiency on TNGA modular platform',
      'Independent double-wishbone rear suspension transforms ride compliance and agility',
      'Resolved previous Gen 3 head gasket issues with updated thermal management'
    ],
    inspection_alerts: [
      'Verify 12-volt auxiliary battery voltage in rear cargo floor area',
      'Scan hybrid battery state of health with Dr. Prius app',
      'Check windshield camera sensor alignment for lane departure warning'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-rav4-hybrid-2016-2018',
    make: 'Toyota',
    model: 'RAV4 Hybrid (4th Gen)',
    year_start: 2016,
    year_end: 2018,
    display_name: '2016–2018 Toyota RAV4 Hybrid',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota 2.5L 2AR-FXE / Electronic On-Demand AWD-i',
    dealer_retail_mid: 20400,
    private_party_mid: 17200,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 4400,
    depreciation_rate_pct: 18.0,
    key_strengths: [
      'Combines 34 MPG city/highway efficiency with fast 194 net HP acceleration',
      'Electronic rear axle motor provides seamless on-demand AWD without driveshaft loss',
      'Among the lowest total 5-year ownership costs of any compact SUV in existence'
    ],
    inspection_alerts: [
      'Inspect high-voltage rear electric motor cable harness (pre-Cablegate design check)',
      'Confirm 12-volt accessory battery holds charge above 12.4V',
      'Inspect hybrid cooling air filter mesh under rear passenger seat'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-tacoma-2010-2015',
    make: 'Toyota',
    model: 'Tacoma (2nd Gen Late)',
    year_start: 2010,
    year_end: 2015,
    display_name: '2010–2015 Toyota Tacoma (2nd Gen Late)',
    body_type: 'truck',
    engine_notes: 'Toyota 4.0L 1GR-FE V6 / 5-Speed Auto',
    dealer_retail_mid: 19900,
    private_party_mid: 16800,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 4600,
    depreciation_rate_pct: 11.0,
    key_strengths: [
      'The "Golden Era" Tacoma: 4.0L V6 has no direct injection complexity and delivers 300k+ miles',
      'Facelift interior with updated Entune audio, backup camera, and revised suspension',
      'Unsurpassed resale value: owners frequently sell for what they paid 5 years prior'
    ],
    inspection_alerts: [
      'Inspect boxed frame section near catalytic converters for rust coating integrity',
      'Check secondary air injection pump and switching valves for moisture error codes',
      'Inspect front prop shaft U-joints for grease zerks and play'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'ford-f150-2012-2016',
    make: 'Ford',
    model: 'F-150',
    year_start: 2012,
    year_end: 2016,
    display_name: '2012–2016 Ford F-150',
    body_type: 'truck',
    engine_notes: 'Ford 5.0L Coyote V8 / 6R80 6-Speed Auto',
    dealer_retail_mid: 18900,
    private_party_mid: 15800,
    reliability_rating: 4.55,
    five_year_maintenance_cost: 4900,
    depreciation_rate_pct: 19.0,
    key_strengths: [
      '5.0L Coyote naturally aspirated V8 delivers 360+ HP without turbocharger heat stress',
      '6R80 6-speed transmission is widely recognized as Ford’s most reliable modern truck transmission',
      'Massive SuperCrew rear seat legroom and huge 9,000+ lb towing capability'
    ],
    inspection_alerts: [
      'Check fuse 27 in engine compartment battery fuse box (relocation kit TSB 15-0137)',
      'Inspect coolant T-connector hose O-rings for slow coolant weeping',
      'Confirm 4WD vacuum IWE actuators engage front hubs without ratcheting sound'
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
    model: 'Highlander (3rd Gen Facelift)',
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
      'Seating for up to 8 passengers with top-tier NHTSA 5-star crash safety scores',
      'Robust 295 HP direct and port fuel-injected D-4S powertrain',
      'Unmatched family utility, strong resale retention, and Toyota Safety Sense suite'
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
    id: 'toyota-rav4-2019-2022',
    make: 'Toyota',
    model: 'RAV4 (5th Gen TNGA)',
    year_start: 2019,
    year_end: 2022,
    display_name: '2019–2022 Toyota RAV4 (5th Gen)',
    body_type: 'suv',
    engine_notes: 'Toyota 2.5L Dynamic Force A25A-FKS / 8-Speed Direct Shift Auto',
    dealer_retail_mid: 26400,
    private_party_mid: 22800,
    reliability_rating: 4.7,
    five_year_maintenance_cost: 4600,
    depreciation_rate_pct: 19.5,
    key_strengths: [
      'Rugged truck-inspired exterior styling with standard Toyota Safety Sense 2.0',
      'High ground clearance (8.4 inches) and multi-terrain select dial',
      '30+ MPG highway with stellar pre-owned demand across all demographics'
    ],
    inspection_alerts: [
      'Inspect roof rail mounting clip leaks on 2019-2020 models (TSB-0081-20)',
      'Verify 8-speed transmission shifts smoothly without hesitation at 15-20 MPH',
      'Check power liftgate electronic struts for smooth opening'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-cr-v-2017-2021',
    make: 'Honda',
    model: 'CR-V (5th Gen)',
    year_start: 2017,
    year_end: 2021,
    display_name: '2017–2021 Honda CR-V (5th Gen)',
    body_type: 'suv',
    engine_notes: 'Honda 1.5L Turbo L15B7 / G-Design CVT',
    dealer_retail_mid: 24900,
    private_party_mid: 21400,
    reliability_rating: 4.6,
    five_year_maintenance_cost: 4700,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      'Enormous passenger legroom and class-leading cargo floor with low liftover height',
      'Standard Honda Sensing active safety suite on EX and higher trims',
      'Smooth, quiet ride with 33 MPG highway efficiency'
    ],
    inspection_alerts: [
      'Verify engine oil level on dipstick does not smell strongly of raw gasoline (oil dilution TSB)',
      'Confirm A/C blows cold (Honda extended warranty on condenser shaft seal)',
      'Check infotainment touchscreen for reboot glitches'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'honda-pilot-2016-2020',
    make: 'Honda',
    model: 'Pilot (3rd Gen)',
    year_start: 2016,
    year_end: 2020,
    display_name: '2016–2020 Honda Pilot (3rd Gen)',
    body_type: 'suv',
    engine_notes: 'Honda 3.5L Earth Dreams J35Y6 V6 / 6 or 9-Speed Auto',
    dealer_retail_mid: 25800,
    private_party_mid: 22200,
    reliability_rating: 4.55,
    five_year_maintenance_cost: 5400,
    depreciation_rate_pct: 23.0,
    key_strengths: [
      'True 3-row comfort for adults in all seating rows with one-touch sliding 2nd row',
      'Stout 280 HP V6 with i-VTM4 torque-vectoring all-wheel drive',
      '5,000 lb towing capability and cavernous storage bins throughout the cabin'
    ],
    inspection_alerts: [
      'Verify timing belt and water pump service interval (due every 7 years or 105k miles)',
      'Check transmission shift quality (6-speed auto requires regular fluid drain-and-fills)',
      'Inspect fuel injectors for misfire codes (covered under Honda extended warranty)'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'subaru-outback-2018-2021',
    make: 'Subaru',
    model: 'Outback (Late 5th / 6th Gen)',
    year_start: 2018,
    year_end: 2021,
    display_name: '2018–2021 Subaru Outback',
    body_type: 'suv',
    engine_notes: 'Subaru 2.5L FB25 DOHC / Lineartronic CVT',
    dealer_retail_mid: 23900,
    private_party_mid: 20400,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 5200,
    depreciation_rate_pct: 23.5,
    key_strengths: [
      'Symmetrical All-Wheel Drive with 8.7 inches of ground clearance',
      'Subaru EyeSight active safety suite standard with exceptional crash test scores',
      'Quiet acoustic laminated windshield and rugged, comfortable suspension'
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
    id: 'subaru-forester-2019-2022',
    make: 'Subaru',
    model: 'Forester (5th Gen SK)',
    year_start: 2019,
    year_end: 2022,
    display_name: '2019–2022 Subaru Forester (SK)',
    body_type: 'suv',
    engine_notes: 'Subaru 2.5L FB25 DI Boxer / Lineartronic CVT',
    dealer_retail_mid: 25200,
    private_party_mid: 21900,
    reliability_rating: 4.6,
    five_year_maintenance_cost: 4900,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      'Subaru Global Platform delivers outstanding structural rigidity and quiet road manners',
      'Massive upright panoramic greenhouse provides the best visibility in the compact SUV segment',
      'Standard EyeSight with automated pre-collision braking and rear automatic braking'
    ],
    inspection_alerts: [
      'Inspect Thermo Control Valve (TCV) replacement history (common failure triggering CEL)',
      'Check auto start-stop battery condition (requires AGM battery upgrade)',
      'Inspect windshield for rock strikes'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'acura-rdx-2016-2018',
    make: 'Acura',
    model: 'RDX (2nd Gen Facelift)',
    year_start: 2016,
    year_end: 2018,
    display_name: '2016–2018 Acura RDX',
    body_type: 'suv',
    engine_notes: 'Honda 3.5L J35Z2 V6 / 6-Speed Auto',
    dealer_retail_mid: 23400,
    private_party_mid: 19800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 5100,
    depreciation_rate_pct: 23.0,
    key_strengths: [
      'Naturally aspirated 279 HP 3.5L V6 avoids 4-cylinder turbo heat and stress',
      'Traditional geared 6-speed automatic transmission avoids fragile CVTs or pushy dual-clutches',
      'Luxury cabin insulation and premium ELS Surround Sound at mainstream crossover pricing'
    ],
    inspection_alerts: [
      'Verify timing belt and water pump service interval (7-year/105k replacement schedule)',
      'Inspect front strut mounts for squeaking over speed bumps',
      'Check rear differential fluid service on AWD models'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'acura-mdx-2016-2020',
    make: 'Acura',
    model: 'MDX (3rd Gen Facelift)',
    year_start: 2016,
    year_end: 2020,
    display_name: '2016–2020 Acura MDX',
    body_type: 'suv',
    engine_notes: 'Honda 3.5L J35Y5 Earth Dreams V6 / 9-Speed ZF Auto',
    dealer_retail_mid: 26700,
    private_party_mid: 22900,
    reliability_rating: 4.65,
    five_year_maintenance_cost: 5600,
    depreciation_rate_pct: 24.0,
    key_strengths: [
      'Super Handling All-Wheel Drive (SH-AWD) provides torque-vectoring snow and rain agility',
      'Standard 3 rows of seating with premium leather and acoustic laminated glass',
      'Robust Honda V6 powertrain with strong passing power and 5,000 lb tow capacity'
    ],
    inspection_alerts: [
      'Confirm 9-speed automatic transmission software update was applied for smooth low-speed shifts',
      'Check active engine mount for hydraulic oil leakage',
      'Verify timing belt service records on models near 100,000 miles'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-es-350-2016-2018',
    make: 'Lexus',
    model: 'ES 350',
    year_start: 2016,
    year_end: 2018,
    display_name: '2016–2018 Lexus ES 350',
    body_type: 'sedan',
    engine_notes: 'Toyota 3.5L 2GR-FE V6 / 6-Speed Auto',
    dealer_retail_mid: 25200,
    private_party_mid: 21800,
    reliability_rating: 4.9,
    five_year_maintenance_cost: 4400,
    depreciation_rate_pct: 20.0,
    key_strengths: [
      'Regarded by master technicians as one of the most reliable luxury sedans ever manufactured',
      'Port-injected 2GR-FE V6 avoids direct injection carbon cleanup procedures',
      'Plush, vault-like cabin acoustics and limousine-like rear legroom'
    ],
    inspection_alerts: [
      'Inspect front brake pads and rotors for standard wear',
      'Check water pump weep hole for pink coolant residue',
      'Verify all seat heating and ventilation fan controls operate smoothly'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-camry-2018-2022',
    make: 'Toyota',
    model: 'Camry (8th Gen TNGA)',
    year_start: 2018,
    year_end: 2022,
    display_name: '2018–2022 Toyota Camry (8th Gen)',
    body_type: 'sedan',
    engine_notes: 'Toyota 2.5L Dynamic Force A25A-FKS / 8-Speed Auto',
    dealer_retail_mid: 24100,
    private_party_mid: 20800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 4100,
    depreciation_rate_pct: 18.5,
    key_strengths: [
      'TNGA chassis provides sharp handling and rock-solid high-speed highway stability',
      '2.5L Dynamic Force engine achieves 39 MPG highway with 203 horsepower',
      'Standard Toyota Safety Sense 2.5 suite with adaptive radar cruise control'
    ],
    inspection_alerts: [
      'Verify 8-speed transmission shifts smoothly between 1st and 2nd gears (TSB available)',
      'Check fuel pump recall campaign was completed on 2018-2019 models',
      'Inspect front windshield for stone chips affecting forward safety camera'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-rav4-hybrid-2019-2022',
    make: 'Toyota',
    model: 'RAV4 Hybrid (5th Gen)',
    year_start: 2019,
    year_end: 2022,
    display_name: '2019–2022 Toyota RAV4 Hybrid',
    body_type: 'hybrid_ev',
    engine_notes: 'Toyota 2.5L Dynamic Force A25A-FXS / Electronic On-Demand AWD',
    dealer_retail_mid: 28700,
    private_party_mid: 24800,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 4500,
    depreciation_rate_pct: 16.5,
    key_strengths: [
      '40 MPG EPA combined fuel efficiency with standard electronic all-wheel drive',
      '219 total system horsepower makes it significantly quicker than non-hybrid RAV4',
      'Highest demand pre-owned crossover in North America with ultra-low depreciation'
    ],
    inspection_alerts: [
      'Inspect rear high-voltage electric motor cable connector under body for corrosion ("Cablegate" warranty extension)',
      'Verify 12V battery in rear right cargo quarter panel holds voltage',
      'Check hybrid battery cooling air filter on rear seat cushion'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-tacoma-2016-2020',
    make: 'Toyota',
    model: 'Tacoma (3rd Gen)',
    year_start: 2016,
    year_end: 2020,
    display_name: '2016–2020 Toyota Tacoma (3rd Gen)',
    body_type: 'truck',
    engine_notes: 'Toyota 3.5L 2GR-FKS V6 / 6-Speed AC60E Auto',
    dealer_retail_mid: 29800,
    private_party_mid: 25800,
    reliability_rating: 4.8,
    five_year_maintenance_cost: 4900,
    depreciation_rate_pct: 14.5,
    key_strengths: [
      'Industry-leading resale value retention (lowest depreciation rate in truck segment)',
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
  },
  {
    id: 'ford-f150-2017-2020',
    make: 'Ford',
    model: 'F-150 (Aluminum Body Gen 13)',
    year_start: 2017,
    year_end: 2020,
    display_name: '2017–2020 Ford F-150',
    body_type: 'truck',
    engine_notes: 'Ford 2.7L EcoBoost Nano V6 or 5.0L Coyote V8 / 10-Speed Auto',
    dealer_retail_mid: 28400,
    private_party_mid: 24500,
    reliability_rating: 4.6,
    five_year_maintenance_cost: 5300,
    depreciation_rate_pct: 20.0,
    key_strengths: [
      'Military-grade aluminum body eliminates cab corners and bed rust forever',
      '2.7L EcoBoost features compacted graphite iron block with exceptional durability and 24 MPG highway',
      'Huge SuperCrew cabin with flat rear floor provides unrivaled utility'
    ],
    inspection_alerts: [
      'Verify 10-speed 10R80 transmission has latest software calibration for smooth shift strategy',
      'Check composite plastic oil pan on 2.7L for oil weeping at sealant bead',
      'Confirm auto start-stop system operates without warning lights'
    ],
    is_clean_title_only: true,
    is_active: true
  },

  // ============================================================================
  // TIER 5: $26K+ CASH BENCHMARKS ($26k+ street cash / $32k+ dealer retail)
  // ============================================================================
  {
    id: 'lexus-gx-460-2017-2021',
    make: 'Lexus',
    model: 'GX 460',
    year_start: 2017,
    year_end: 2021,
    display_name: '2017–2021 Lexus GX 460',
    body_type: 'suv',
    engine_notes: 'Toyota 4.6L 1UR-FE V8 / 6-Speed A760F Auto',
    dealer_retail_mid: 37800,
    private_party_mid: 32500,
    reliability_rating: 4.9,
    five_year_maintenance_cost: 6200,
    depreciation_rate_pct: 16.0,
    key_strengths: [
      'Full-time 4WD with Torsen center locking differential and KDSS hydraulic sway bars',
      'Naturally aspirated 4.6L V8 built in Toyota Tahara plant to highest quality standards on Earth',
      'True Land Cruiser Prado underpinnings capable of heavy towing and extreme off-road terrain'
    ],
    inspection_alerts: [
      'Inspect secondary air injection pump filter for foam breakdown',
      'Check valley plate under intake manifold for slow pink coolant seepage',
      'Verify KDSS accumulator cylinders are free of hydraulic fluid leaks'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-4runner-2018-2022',
    make: 'Toyota',
    model: '4Runner (5th Gen)',
    year_start: 2018,
    year_end: 2022,
    display_name: '2018–2022 Toyota 4Runner',
    body_type: 'suv',
    engine_notes: 'Toyota 4.0L 1GR-FE V6 / 5-Speed A750E/F Auto',
    dealer_retail_mid: 36500,
    private_party_mid: 31800,
    reliability_rating: 4.9,
    five_year_maintenance_cost: 5100,
    depreciation_rate_pct: 12.0,
    key_strengths: [
      'Unkillable 4.0L V6 and 5-speed transmission combination with virtually zero electronic gremlins',
      'Body-on-frame durability with highest retained resale percentage of any SUV in North America',
      'Power roll-down rear tailgate glass and unmatched overland trail capability'
    ],
    inspection_alerts: [
      'Inspect boxed frame rails and crossmembers for rust or off-road scrapes',
      'Check front brake calipers for sticking lower pistons',
      'Verify grease zerks on propeller drive shafts have been regularly greased'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-rx-350-2018-2022',
    make: 'Lexus',
    model: 'RX 350 (4th Gen)',
    year_start: 2018,
    year_end: 2022,
    display_name: '2018–2022 Lexus RX 350 (4th Gen)',
    body_type: 'suv',
    engine_notes: 'Toyota 3.5L 2GR-FKS V6 / 8-Speed Auto',
    dealer_retail_mid: 34200,
    private_party_mid: 29500,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 5800,
    depreciation_rate_pct: 21.0,
    key_strengths: [
      'Best-selling luxury SUV in America for over two decades for good reason',
      'Whisper-quiet cabin with plush NuLuxe/Semi-Aniline leather and premium ride comfort',
      'Standard Lexus Safety System+ with lane trace assist and pedestrian detection'
    ],
    inspection_alerts: [
      'Inspect front water pump weep hole for dried pink coolant deposits',
      'Check 8-speed transmission shifts smoothly during stop-and-go driving',
      'Verify infotainment trackpad / touchscreen operates without lag'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'toyota-tundra-2018-2021',
    make: 'Toyota',
    model: 'Tundra (2nd Gen Late)',
    year_start: 2018,
    year_end: 2021,
    display_name: '2018–2021 Toyota Tundra',
    body_type: 'truck',
    engine_notes: 'Toyota 5.7L 3UR-FE i-FORCE V8 / 6-Speed AB60E/F Auto',
    dealer_retail_mid: 38900,
    private_party_mid: 33500,
    reliability_rating: 4.85,
    five_year_maintenance_cost: 5900,
    depreciation_rate_pct: 14.0,
    key_strengths: [
      'Final generation of the legendary 5.7L naturally aspirated V8 (famously reached 1,000,000 miles)',
      'Rock-solid AB60 transmission with massive rear differential ring gear',
      'Huge CrewMax cab with roll-down rear window and heavy towing stability'
    ],
    inspection_alerts: [
      'Inspect cam towers for slow oil seepage along passenger side cylinder bank',
      'Check valley plate under intake manifold for pink coolant crust',
      'Inspect secondary air injection pump valves for moisture codes'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'tesla-model-3-2021-2023',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year_start: 2021,
    year_end: 2023,
    display_name: '2021–2023 Tesla Model 3 Long Range',
    body_type: 'hybrid_ev',
    engine_notes: 'Dual Motor AWD / 82 kWh Battery Pack / Heat Pump',
    dealer_retail_mid: 32500,
    private_party_mid: 27800,
    reliability_rating: 4.5,
    five_year_maintenance_cost: 2900,
    depreciation_rate_pct: 26.0,
    key_strengths: [
      'Near-zero routine maintenance: no engine oil, spark plugs, or transmission fluids',
      '350+ miles of range with full access to seamless Tesla Supercharger network',
      'Dual motor all-wheel drive with 0-60 MPH in 4.2 seconds and continuous OTA updates'
    ],
    inspection_alerts: [
      'Prioritize 2021+ refresh models with factory heat pump and black chrome trim',
      'Inspect front upper control arm ball joints for high-mileage squeaking',
      'Check battery pack health in service mode and ensure battery warranty remains intact'
    ],
    is_clean_title_only: true,
    is_active: true
  },
  {
    id: 'lexus-es-350-2019-2022',
    make: 'Lexus',
    model: 'ES 350 (7th Gen)',
    year_start: 2019,
    year_end: 2022,
    display_name: '2019–2022 Lexus ES 350',
    body_type: 'sedan',
    engine_notes: 'Toyota 3.5L 2GR-FKS V6 (302 HP) / Direct Shift 8-Speed Auto',
    dealer_retail_mid: 32200,
    private_party_mid: 27400,
    reliability_rating: 4.9,
    five_year_maintenance_cost: 4800,
    depreciation_rate_pct: 19.5,
    key_strengths: [
      'Top-tier J.D. Power Vehicle Dependability champion for executive midsize sedans',
      '302 HP naturally aspirated V6 paired with seamless 8-speed automatic',
      'Ultra-luxurious acoustic quietness, standard Lexus Safety System+ 2.0, and 32 MPG highway'
    ],
    inspection_alerts: [
      'Inspect front water pump weep hole for dried pink coolant deposits',
      'Verify 8-speed automatic transmission software calibration update was completed',
      'Check panoramic sunroof sunshade operation and track lubrication'
    ],
    is_clean_title_only: true,
    is_active: true
  }
];
