-- ============================================================================
-- CarMatrix Seed: Top-Rated Benchmark Used Vehicles
-- File: 002_seed_vehicle_rankings.sql
-- Description: 12 benchmark used vehicles across standard street-clearing cash tiers
--              incorporating realistic 12%–25% dealer vs private spreads.
-- ============================================================================

INSERT INTO public.vehicle_rankings_master (
    make,
    model,
    year_start,
    year_end,
    body_type,
    engine_notes,
    dealer_retail_mid,
    private_party_mid,
    reliability_rating,
    five_year_maintenance_cost,
    depreciation_rate_pct,
    key_strengths,
    inspection_alerts,
    is_clean_title_only,
    is_active
) VALUES 

-- ============================================================================
-- TIER 1: SUB-$6K CASH BENCHMARKS (Budget Beaters & Street Staples)
-- Typical spread: 20%–25% off dealer retail
-- ============================================================================

-- 1. Pontiac Vibe / Toyota Matrix (1.8L 1ZZ-FE)
(
    'Pontiac',
    'Vibe / Toyota Matrix',
    2005,
    2008,
    'hatchback',
    'Toyota 1.8L 1ZZ-FE / 4-Speed Auto',
    5600.00,
    4350.00, -- 22.3% private party spread discount
    4.70,
    3200.00,
    18.5,
    ARRAY[
        'Under-the-skin Toyota Matrix reliability at domestic pricing',
        'Fold-flat hard plastic cargo floor and hatchback versatility',
        'Bulletproof timing chain engine requiring minimal routine maintenance'
    ],
    ARRAY[
        'Inspect valve cover gasket for weeping onto exhaust manifold',
        'Check intake manifold gasket (hard starts in cold weather)',
        'Confirm odometer is still advancing (early 299,999 mile digital lockup glitch)'
    ],
    true,
    true
),

-- 2. Buick LeSabre (GM 3800 Series II V6)
(
    'Buick',
    'LeSabre',
    2000,
    2005,
    'sedan',
    'GM 3800 Series II 3.8L V6 (L36)',
    4900.00,
    3800.00, -- 22.4% private party spread discount
    4.50,
    2900.00,
    14.0,
    ARRAY[
        'Legendary GM 3800 Series II powertrain capable of 300k+ miles',
        'Extremely cheap and abundant replacement parts at any local auto store',
        'Plush highway ride and exceptional front bench seat comfort'
    ],
    ARRAY[
        'Inspect plastic upper intake manifold and coolant elbows for leaks (Dorman aluminum upgrade recommended)',
        'Check rocker panel and rear brake lines for salt corrosion',
        'Confirm GM 4T65-E transmission shifts smoothly without delayed forward engagement'
    ],
    true,
    true
),

-- 3. Scion xB (Toyota 1.5L 1NZ-FE)
(
    'Scion',
    'xB (1st Gen)',
    2004,
    2006,
    'wagon',
    'Toyota 1.5L 1NZ-FE 4-Cylinder',
    5900.00,
    4600.00, -- 22.0% private party spread discount
    4.65,
    3100.00,
    16.0,
    ARRAY[
        'Rock-solid Toyota Yaris mechanical underpinnings in a spacious box layout',
        '31+ MPG highway efficiency with low insurance premiums',
        'Simple mechanical architecture with zero complex electronic gremlins'
    ],
    ARRAY[
        'Check front suspension struts and ball joints on high-mileage examples',
        'Examine oil dipstick for sludge if oil change receipts are missing',
        'Check windshield for stone chips due to upright windshield angle'
    ],
    true,
    true
),


-- ============================================================================
-- TIER 2: $6K–$11K BENCHMARKS (Commuter Champions)
-- Typical spread: 17%–21% off dealer retail
-- ============================================================================

-- 4. Mazda 3 (SkyActiv 2.0L)
(
    'Mazda',
    'Mazda 3',
    2012,
    2015,
    'sedan',
    'SkyActiv-G 2.0L DOHC / 6-Speed SkyActiv Drive Auto',
    10800.00,
    8800.00, -- 18.5% private party spread discount
    4.55,
    4100.00,
    22.0,
    ARRAY[
        'SkyActiv-G naturally aspirated engine avoids turbo complexity',
        'Sharp athletic chassis tuning that out-handles Civic and Corolla',
        'Traditional geared 6-speed automatic transmission avoids CVT failures'
    ],
    ARRAY[
        'Verify vehicle is equipped with SkyActiv-G (blue engine cover), not the older non-SkyActiv MZR',
        'Check passenger-side hydraulic motor mount for black fluid leakage',
        'Inspect infotainment master control knob and touchscreen for phantom touch'
    ],
    true,
    true
),

-- 5. Toyota Prius (3rd Gen 1.8L Hybrid)
(
    'Toyota',
    'Prius',
    2010,
    2013,
    'hybrid_ev',
    'Toyota Hybrid Synergy Drive 1.8L 2ZR-FXE',
    9900.00,
    7950.00, -- 19.7% private party spread discount
    4.40,
    4400.00,
    24.0,
    ARRAY[
        'Unmatched 48–51 MPG real-world fuel economy',
        'Regenerative braking preserves brake pads for 100,000+ miles',
        'Exceptional utility with hatchback cargo volume'
    ],
    ARRAY[
        'Connect OBD2 reader (Dr. Prius app) to test individual hybrid battery cell block voltages',
        'Listen for cold-start engine shudder caused by clogged EGR cooler or failing head gasket',
        'Inspect brake actuator assembly for continuous high-frequency buzzing pump cycles'
    ],
    true,
    true
),

-- 6. Honda Civic (9th Gen 1.8L)
(
    'Honda',
    'Civic',
    2012,
    2015,
    'sedan',
    'Honda 1.8L R18Z1 i-VTEC / 5-Speed Auto',
    11500.00,
    9400.00, -- 18.3% private party spread discount
    4.60,
    3800.00,
    20.5,
    ARRAY[
        'Proven single-overhead-cam R18 engine paired with reliable geared 5-speed automatic (pre-CVT)',
        'Ultra-low ownership costs and top-tier resale liquidity in private markets',
        'Avoids the oil dilution issues of later 1.5L turbo direct-injection motors'
    ],
    ARRAY[
        'Verify paint condition (Honda recall coverage for roof/hood clear coat peeling)',
        'Check electric power steering rack for centering notchiness',
        'Ensure automatic transmission fluid was serviced with genuine Honda DW-1'
    ],
    true,
    true
),


-- ============================================================================
-- TIER 3: $11K–$18K BENCHMARKS (Family Crossovers & Proven Luxury)
-- Typical spread: 14%–18% off dealer retail
-- ============================================================================

-- 7. Toyota RAV4 (4th Gen 2.5L)
(
    'Toyota',
    'RAV4',
    2014,
    2017,
    'suv',
    'Toyota 2.5L 2AR-FE / 6-Speed Electronically Controlled Auto',
    18200.00,
    15200.00, -- 16.5% private party spread discount
    4.80,
    4600.00,
    21.0,
    ARRAY[
        '2AR-FE 2.5L naturally aspirated 4-cylinder is among the most durable modern Toyota powertrains',
        'Standard 6-speed automatic transmission avoids fragile CVTs',
        'High ground clearance with proven Toyota electronic AWD coupler'
    ],
    ARRAY[
        'Verify torque converter shutter software update was applied (TSB-0037-14)',
        'Check rear electric differential coupler for humming bearing noise at 35–45 MPH',
        'Inspect liftgate strut hinges for binding or creaking'
    ],
    true,
    true
),

-- 8. Honda CR-V (4th Gen 2.4L)
(
    'Honda',
    'CR-V',
    2013,
    2016,
    'suv',
    'Honda 2.4L K24Z7 / K24W Earth Dreams DOHC i-VTEC',
    16800.00,
    14100.00, -- 16.1% private party spread discount
    4.65,
    4500.00,
    23.0,
    ARRAY[
        'Class-leading rear legroom and spring-loaded fold-down rear seats',
        'Rock-solid K24 four-cylinder engine with stellar mechanical longevity',
        'Real Time AWD with Intelligent Control provides reliable traction'
    ],
    ARRAY[
        'Listen on cold start for 2-second rattle from VTC cam actuator gear',
        'Inspect rear differential fluid service history (requires Honda Dual Pump Fluid II to prevent low-speed shudder)',
        'Check starter motor engagement for intermittent no-crank hesitation'
    ],
    true,
    true
),

-- 9. Lexus RX 350 (3rd Gen 3.5L V6)
(
    'Lexus',
    'RX 350',
    2011,
    2015,
    'suv',
    'Toyota 3.5L 2GR-FE V6 / 6-Speed Auto',
    19200.00,
    15900.00, -- 17.2% private party spread discount
    4.85,
    5600.00,
    24.5,
    ARRAY[
        'Executive-grade interior quietness and Mark Levinson sound engineering',
        'Silky smooth 2GR-FE 3.5L V6 with zero direct-injection carbon buildup (port-injected)',
        'Highest retained reliability score in midsize luxury crossover class'
    ],
    ARRAY[
        'Inspect timing cover for slow oil seepage at rear passenger cylinder head',
        'Check dashboard material for sticky/melting texture (covered under previous Lexus customer campaign)',
        'Verify electric water pump has not weeped pink coolant crust around pulley'
    ],
    true,
    true
),


-- ============================================================================
-- TIER 4: $18K–$26K BENCHMARKS (Heavy-Duty Utility & Premium Cruisers)
-- Typical spread: 12%–16% off dealer retail
-- ============================================================================

-- 10. Toyota Highlander (3rd Gen 3.5L V6)
(
    'Toyota',
    'Highlander',
    2017,
    2020,
    'suv',
    'Toyota 3.5L 2GR-FKS V6 / 8-Speed Direct Shift Auto',
    27500.00,
    23600.00, -- 14.2% private party spread discount
    4.75,
    5200.00,
    22.0,
    ARRAY[
        'Seating for 8 passengers with high crash safety ratings',
        'Robust 295 HP direct and port fuel-injected D-4S powertrain',
        'Unmatched family utility with high resale retention'
    ],
    ARRAY[
        'Test 8-speed automatic transmission at low parking lot speeds (verify shift quality bulletin TSB-0160-18)',
        'Check water pump weep hole for dried pink coolant deposits',
        'Inspect roof rack rail seals for headliner water spotting'
    ],
    true,
    true
),

-- 11. Subaru Outback (5th Gen 2.5L Boxer)
(
    'Subaru',
    'Outback',
    2018,
    2021,
    'wagon',
    'Subaru 2.5L FB25 DOHC / Lineartronic CVT',
    23900.00,
    20400.00, -- 14.6% private party spread discount
    4.45,
    5800.00,
    27.0,
    ARRAY[
        'Symmetrical All-Wheel Drive with 8.7 inches of ground clearance',
        'Subaru EyeSight active safety suite standard on later model years',
        'Wagon roofline with integrated fold-out crossbars'
    ],
    ARRAY[
        'Inspect front lower control arm rear bushings for torn rubber tears',
        'Confirm Lineartronic CVT was serviced every 30k-40k miles (listen for whining pump bearing)',
        'Check windshield for thermal cracking along heating element grid line'
    ],
    true,
    true
),

-- 12. Toyota Tacoma (3rd Gen 3.5L V6)
(
    'Toyota',
    'Tacoma',
    2016,
    2020,
    'truck',
    'Toyota 3.5L 2GR-FKS V6 / 6-Speed AC60E Auto',
    29800.00,
    25800.00, -- 13.4% private party spread discount
    4.80,
    4900.00,
    14.5,
    ARRAY[
        'Industry-leading resale value retention (lowest depreciation rate in class)',
        'Part-time 4WD system with robust transfer case and composite composite truck bed',
        'High off-road clearance with extensive global aftermarket modification support'
    ],
    ARRAY[
        'Verify automatic transmission gear hunt ECU flash update was completed',
        'Inspect boxed frame rails and leaf springs for surface rust in humid regions',
        'Check rear differential housing for weeping pinion seal'
    ],
    true,
    true
)

ON CONFLICT DO NOTHING;
