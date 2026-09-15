/**
 * Automotive Knowledge Engine for CarMatrix
 * Provides deep offline automotive buyer advice, vehicle comparisons,
 * mechanical failure points, and dealer negotiation tactics.
 */

export interface KnowledgeResult {
  title: string;
  recommendations: string[];
  pricingWatchouts: string[];
  inspectionGotchas: string[];
  negotiationTactics: string[];
}

interface VehicleProfile {
  name: string;
  years: string;
  reliability: string;
  fairPriceRange: string;
  pros: string[];
  cons: string[];
  knownIssues: string[];
}

const VEHICLE_DATABASE: Record<string, VehicleProfile> = {
  rav4: {
    name: "Toyota RAV4",
    years: "2019-2024",
    reliability: "High (4.5/5)",
    fairPriceRange: "$24,000 - $33,000 (Gas) | $27,000 - $37,000 (Hybrid)",
    pros: ["Excellent resale value retention (68%+ after 3 yrs)", "Standard Toyota Safety Sense 2.0/2.5", "40 MPG on Hybrid models"],
    cons: ["Firm ride quality and noticeable road noise on highway", "Gas 8-speed transmission can hunt for gears at low speeds", "Cabin tech feels dated compared to Korean competitors"],
    knownIssues: [
      "Hybrid Cablegate: Check rear high-voltage electric motor wiring harness for corrosion on 2019-2022 Hybrid models.",
      "Roof rail water leaks into headliner and A-pillars (TSB-0145-21).",
      "Gas model 8-speed automatic hesitates when decelerating to 10-15 mph then accelerating."
    ]
  },
  crv: {
    name: "Honda CR-V",
    years: "2018-2023",
    reliability: "High (4.3/5)",
    fairPriceRange: "$22,500 - $31,500",
    pros: ["Best-in-class cargo capacity (39.2 cu ft rear, 75.8 total)", "Exceptional cabin ergonomics and low load floor", "Smooth, linear CVT power delivery in city driving"],
    cons: ["1.5L Turbo engine requires strictly scheduled oil intervals", "Touchscreen infotainment on 2018-2022 models is sluggish", "A/C compressor and condenser failure history"],
    knownIssues: [
      "1.5L Turbo Oil Dilution: Fuel vapors can enter engine oil in freezing climates during short trips.",
      "A/C condenser leak warranty extension: Look for extended 10-year warranty coverage sticker or service records.",
      "CVT fluid must be drained and filled every 30,000 miles to prevent judder."
    ]
  },
  cx5: {
    name: "Mazda CX-5",
    years: "2018-2023",
    reliability: "Very High (4.6/5)",
    fairPriceRange: "$19,500 - $28,000",
    pros: ["Near-luxury interior materials with physical rotary controls", "Traditional 6-speed torque-converter automatic (zero CVT lag)", "Standard i-Activ AWD with engaging steering feel"],
    cons: ["Tighter rear seat legroom and smaller cargo space (30.8 cu ft)", "Infotainment lacks touchscreen operation when vehicle is in motion", "Firm suspension can feel stiff over broken pavement"],
    knownIssues: [
      "Cylinder deactivation oil consumption on 2019-2021 non-turbo 2.5L engines (check TSB 01-012/21).",
      "Front lower control arm bushings prone to cracking after 50,000 miles.",
      "Folding side mirror motors frequently fail or strip internally."
    ]
  },
  f150: {
    name: "Ford F-150",
    years: "2018-2023",
    reliability: "Above Average (3.8/5)",
    fairPriceRange: "$28,000 - $48,000 (XLT/Lariat)",
    pros: ["Military-grade aluminum body prevents bed and rocker panel rust", "2.7L EcoBoost offers the best balance of fuel economy and punchy torque", "Immense cab space in SuperCrew with flat load floor"],
    cons: ["10R80 10-speed transmission known for harsh 1-3 and 3-5 upshifts", "Pre-2020 3.5L EcoBoost cam phaser rattle on cold starts", "High dealer inventory creates volatile depreciation"],
    knownIssues: [
      "10R80 Transmission CDF Clutch Drum: Internal bushing moves out of position causing harsh clunks or slipping.",
      "Cam Phaser Rattle: Listen for a loud 2-second diesel-like rattle on cold starts (TSB 21-2119).",
      "5.0L V8 Oil Consumption: 2018-2020 5.0L Coyotes can burn 1 qt every 1,500 miles (TSB 19-2365)."
    ]
  },
  silverado: {
    name: "Chevrolet Silverado 1500 / GMC Sierra",
    years: "2019-2024",
    reliability: "Average (3.4/5)",
    fairPriceRange: "$29,000 - $49,000",
    pros: ["3.0L Duramax inline-6 diesel delivers 30+ MPG highway with 460 lb-ft torque", "Large bed volume with 12 standard tie-downs", "Simple push-button 4WD controls and reliable ride quality"],
    cons: ["5.3L and 6.2L V8 engines prone to Dynamic Fuel Management (DFM) valve lifter collapse", "8-speed transmission torque converter shudder on early years", "Interior styling on 2019-2021 models looks dated compared to Ram"],
    knownIssues: [
      "DFM Valve Lifter Failure: Collapsed lifters can bend pushrods and ruin camshaft ($4,000+ repair).",
      "8-Speed Transmission Shudder: Requires GM Mobil 1 synthetic LV ATF HP fluid flush (TSB 18-NA-355).",
      "Rear window frame leaks water into rear cab headliner and cab floor."
    ]
  },
  ram1500: {
    name: "Ram 1500",
    years: "2019-2024",
    reliability: "Average (3.6/5)",
    fairPriceRange: "$27,000 - $46,000",
    pros: ["Class-leading rear coil spring or air suspension delivers luxury-car ride comfort", "Uconnect 12-inch infotainment is exceptionally responsive", "ZF-sourced 8HP75 8-speed transmission is bulletproof"],
    cons: ["5.7L Hemi exhaust manifold tick is nearly guaranteed over 60k miles", "Air suspension can freeze or leak in cold northern winter climates", "Lower residual value retention than Toyota Tundra"],
    knownIssues: [
      "Hemi Exhaust Manifold Tick: Broken rear manifold bolts causing exhaust leak tick when engine is cold.",
      "Third Brake Light Water Leak: Gasket degrades and leaks water onto rear headliner.",
      "Optional 4-corner air suspension valve block failure in freezing sub-zero weather."
    ]
  },
  bmw3: {
    name: "BMW 3-Series (330i / M340i - G20 Generation)",
    years: "2019-2024",
    reliability: "High for German Luxury (4.4/5)",
    fairPriceRange: "$24,000 - $34,000 (330i) | $37,000 - $48,000 (M340i)",
    pros: ["B48 4-cyl and B58 6-cyl turbo engines are among BMW’s most reliable engines in modern history", "ZF 8-speed automatic is lightning-fast and durable", "Outstanding balance of athletic chassis handling and everyday highway refinement"],
    cons: ["Steep depreciation curve between years 2 and 4 (ideal for used buyers)", "Premium 91+ octane fuel required and higher synthetic oil change costs ($140+)", "Optional adaptive M suspension repairs are costly outside warranty"],
    knownIssues: [
      "Cooling System: Plastic coolant return hoses and expansion tank connectors turn brittle and crack around 50k-60k miles.",
      "Oil Filter Housing: Plastic oil filter housing can leak coolant or oil at the engine block.",
      "Active front grille shutters can throw a check engine code if road debris jams them."
    ]
  },
  model3: {
    name: "Tesla Model 3 / Model Y",
    years: "2020-2024",
    reliability: "Above Average (3.9/5)",
    fairPriceRange: "$21,000 - $32,000 (Model 3) | $26,000 - $38,000 (Model Y)",
    pros: ["Access to the reliable Tesla Supercharger network", "Virtually zero routine powertrain maintenance (no oil, plugs, belts, or transmission fluid)", "Used Model 3s under $25,000 may qualify for up to $4,000 Federal Used EV Tax Credit"],
    cons: ["Tire wear is 25-35% faster than equivalent gas cars due to instantaneous torque and weight", "Panel gap alignment and interior wind noise vary widely by assembly quarter", "Insurance premiums can be 20-35% higher than gas compact cars"],
    knownIssues: [
      "Front Upper Control Arm Bushings: Squeaking or creaking over low-speed bumps (requires revised control arm).",
      "Heat pump failure in extreme winter conditions on 2020-2021 models.",
      "Check remaining battery degradation: battery capacity should be >88% of original rated range at 50k miles."
    ]
  },
  camry: {
    name: "Toyota Camry",
    years: "2018-2024",
    reliability: "Extremely High (4.8/5)",
    fairPriceRange: "$18,500 - $27,000",
    pros: ["Naturally aspirated 2.5L Dynamic Force engine routinely surpasses 250,000 miles", "Hybrid variant achieves 51-53 MPG combined", "Low insurance groups and minimal scheduled maintenance costs"],
    cons: ["Conservative exterior styling and modest passing power on base 4-cylinder", "8-speed transmission calibration favors fuel economy over responsive downshifts", "Road noise is moderate at 70+ mph"],
    knownIssues: [
      "Panoramic glass sunroof rattle on XSE/XLE trims.",
      "Pre-collision sensor alignment code in heavy snow or bug splatter on front radar emblem.",
      "Infotainment Entune 3.0 screen rebooting (ensure latest firmware update is applied)."
    ]
  },
  civic: {
    name: "Honda Civic",
    years: "2019-2024",
    reliability: "Very High (4.6/5)",
    fairPriceRange: "$17,500 - $25,500",
    pros: ["Class-leading interior refinement and low cowl visibility", "Fun-to-drive chassis dynamics with crisp electric steering", "Outstanding fuel economy (33-36 MPG combined)"],
    cons: ["Low seating position can be harder to ingress/egress for taller drivers", "Road noise on coarse highway asphalt with 18-inch wheels", "CVT drone during hard passing acceleration"],
    knownIssues: [
      "Electronic power steering rack stickiness/notching on 2022-2024 11th Gen models (NHTSA Recall/TSB).",
      "A/C condenser leaking freon (covered under Honda extended warranty campaign).",
      "Rear brake pad wear accelerated on models with electronic parking brake."
    ]
  }
};

export function queryAutomotiveKnowledgeEngine(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  // 1. Check for specific vehicle matches
  let matchedVehicle = null;
  for (const [key, profile] of Object.entries(VEHICLE_DATABASE)) {
    if (query.includes(key) || query.includes(profile.name.toLowerCase())) {
      matchedVehicle = profile;
      break;
    }
  }

  if (!matchedVehicle) {
    if (query.includes("330i") || query.includes("m340i") || query.includes("3 series") || query.includes("3-series") || query.includes("bmw")) {
      matchedVehicle = VEHICLE_DATABASE.bmw3;
    } else if (query.includes("taco") || query.includes("tacoma") || query.includes("tundra") || query.includes("rav4")) {
      matchedVehicle = VEHICLE_DATABASE.rav4;
    } else if (query.includes("f-150") || query.includes("f150") || query.includes("ford truck")) {
      matchedVehicle = VEHICLE_DATABASE.f150;
    } else if (query.includes("chevy truck") || query.includes("sierra") || query.includes("silverado")) {
      matchedVehicle = VEHICLE_DATABASE.silverado;
    } else if (query.includes("ram")) {
      matchedVehicle = VEHICLE_DATABASE.ram1500;
    } else if (query.includes("model y") || query.includes("model 3") || query.includes("tesla")) {
      matchedVehicle = VEHICLE_DATABASE.model3;
    } else if (query.includes("camry")) {
      matchedVehicle = VEHICLE_DATABASE.camry;
    } else if (query.includes("civic")) {
      matchedVehicle = VEHICLE_DATABASE.civic;
    } else if (query.includes("cr-v") || query.includes("crv")) {
      matchedVehicle = VEHICLE_DATABASE.crv;
    } else if (query.includes("cx-5") || query.includes("cx5") || query.includes("mazda")) {
      matchedVehicle = VEHICLE_DATABASE.cx5;
    }
  }

  // 2. Classify buyer intent
  const isDocFeeNegotiation = query.includes("doc fee") || query.includes("dealer fee") || query.includes("waive") || (query.includes("negotiat") && query.includes("fee"));
  const isGeneralNegotiation = query.includes("negotiat") || query.includes("counter") || query.includes("otd") || query.includes("out the door") || query.includes("script") || query.includes("discount");
  const isLeaseVsBuy = query.includes("lease") || query.includes("money factor") || query.includes("residual");
  const isFinancing = query.includes("financ") || query.includes("loan") || query.includes("apr") || query.includes("interest") || query.includes("20/4/10");
  const isEVQuery = query.includes("ev") || query.includes("electric") || query.includes("charging") || query.includes("battery");
  const isTruckQuery = query.includes("truck") || query.includes("towing") || query.includes("payload") || query.includes("pickup");
  const isSportsCar = query.includes("sports car") || query.includes("fast") || query.includes("performance") || query.includes("porsche") || query.includes("corvette") || query.includes("miata") || query.includes("mustang");
  const isFamilySUV = query.includes("3-row") || query.includes("family") || query.includes("kids") || query.includes("minivan") || query.includes("highlander") || query.includes("pilot") || query.includes("telluride") || query.includes("palisade");
  const isBudgetQuery = query.includes("under $15") || query.includes("under 15k") || query.includes("under $10") || query.includes("under 10k") || query.includes("under $20") || query.includes("under 20k") || query.includes("under $25") || query.includes("under 25k") || query.includes("under $28") || query.includes("under 28k") || query.includes("cheap") || query.includes("first car");

  if (isDocFeeNegotiation) {
    return `### 🛡️ CarMatrix Negotiation Playbook: Dealer Doc Fee Defense

**1. The Reality of Dealer Doc Fees:**
- **What it is**: The "Documentation Fee" (processing / handling) is an internal dealer charge meant to cover title paperwork and back-office staff. It is **pure dealership profit**.
- **Legal Caps**: States like California ($85), New York ($175), and Pennsylvania ($464) cap doc fees by law. Unregulated states like Florida ($999 - $1,495), Colorado ($699), and Georgia ($799+) have zero legal limits.
- **The Dealer Catch**: Dealerships cannot legally lower the pre-printed doc fee on the contract because state equal-credit laws require them to charge the same fee to all buyers.
- **The Solution**: Do **not** ask them to remove the fee line. Demand that they **reduce the vehicle sales price** by the exact amount of the fee.

**2. 💡 5 Word-For-Word Negotiation Scripts:**
1. *"I understand your state compliance rules require you to charge a pre-printed $899 doc fee on this contract. To keep my total Out-The-Door price within my budget, simply discount the vehicle sales price by that exact $899."*
2. *"I am prepared to place a deposit and sign the buyer's order right now at $XX,XXX Out-The-Door. How you balance the selling price versus the dealer processing fee on your internal accounting is up to your desk manager."*
3. *"I decline all pre-installed dealer accessory packs (VIN etching, nitrogen tires, paint sealant). If these are pre-applied to the vehicle, I will take them at zero cost or walk away."*
4. *"Let's remove the second dealer worksheet window sticker ('dealer addendum'). I only negotiate against the factory Monroney window sticker."*
5. *"Please email me the clean itemized buyer's order showing line-item taxes, state DMV fees, and zero dealer add-ons before I come into the finance office."*

**3. Red Flags in the F&I Office:**
- Electronic Doc Prep / Courier Fees ($150 - $350) stacked on top of the regular doc fee.
- Mandatory Dealer Tint or Paint Protection ($1,295 - $2,495) with $80 actual material cost.
- GAP Insurance markup ($1,100 at dealership vs. $30/year through your personal auto insurance).

**4. Out-The-Door Price Target:**
Calculate your price target as: **(Negotiated Vehicle Price) + (Actual State Sales Tax %) + (Actual DMV Title & Plate Fee)**. Any line item that does not go directly to the state government is 100% negotiable.`;
  }

  if (isLeaseVsBuy || isFinancing) {
    return `### 📊 CarMatrix Financing & Lease Strategy Engine

**1. The Golden 20/4/10 Financing Rule:**
- **20% Down Payment**: Protects you from immediately landing in "negative equity" (owing more than the car is worth as soon as it drives off the lot).
- **4-Year Term (48 Months)**: Do not stretch loans to 72 or 84 months just to lower the monthly payment; you will pay thousands extra in compound interest and stay underwater for 4+ years.
- **10% of Gross Income**: Your total monthly transportation budget (loan payment + insurance + fuel) should never exceed 10% of your gross monthly earnings.

**2. Lease vs. Purchase Decision Matrix:**
- **Lease If**: You drive under 12,000 miles/year, want a brand-new vehicle every 36 months under factory bumper-to-bumper warranty, or are leasing an EV to capture the $7,500 commercial clean vehicle tax pass-through credit.
- **Buy/Finance If**: You keep vehicles 5+ years, drive over 15,000 miles annually, want to build equity, or hate paying lease disposition fees ($395-$595) and wear-and-tear penalties.
- **The $0 Down Lease Golden Rule**: Never put cash down on a lease. If the vehicle is totaled or stolen driving home, the insurance payout goes to the leasing bank; **your down payment money vanishes completely**.

**3. Dealer F&I Interest Rate Markup Warning:**
- Dealerships use automated financing portals (RouteOne, DealerTrack) that approve you at a "Buy Rate" (e.g. 5.9% APR).
- The F&I manager is legally permitted to add up to **2.0% - 2.5%** in dealer reserve interest markup, presenting you with an 8.4% APR offer and pocketing the difference.
- **Defense**: Always bring a pre-approval approval letter from your local credit union or personal bank before discussing financing at the dealer.

**4. Dealership Walk-Away Checklist:**
- Do not sign if the dealer refuses to honor your outside credit union financing ("We only accept in-house financing" is a major red flag).
- Decline extended warranties in the showroom; you can purchase an official manufacturer-backed warranty from any licensed dealer nationwide up until the factory 3yr/36k warranty expires.`;
  }

  if (matchedVehicle) {
    const v = matchedVehicle;
    return `### 🚗 CarMatrix Vehicle Intelligence: ${v.name} (${v.years})

**1. Vehicle Benchmark & Market Rating:**
- **Reliability Score**: ${v.reliability}
- **Fair Market Price Range**: ${v.fairPriceRange}
- **Key Strengths**:
${v.pros.map(p => `  - ${p}`).join(
)}
- **Notable Drawbacks**:
${v.cons.map(c => `  - ${c}`).join(
)}

**2. Pre-Purchase Inspection & Known Vulnerabilities:**
${v.knownIssues.map(i => `- **Check**: ${i}`).join(
)}
- **Underbody & Suspension**: Inspect CV axle boots for grease tears, lower control arm bushings for rubber dry rot, and rotor thickness.
- **Diagnostic Scan**: Plug an OBD-II scanner into the diagnostic port under the driver dash. Ensure all 8 I/M readiness monitors are "Ready" (verifying the dealer did not clear active check engine codes 10 miles ago).

**3. Cost-of-Ownership Projections (5-Year Outlook):**
- **Depreciation Rate**: Expected to retain 58% - 66% of original value over 5 years.
- **Routine Maintenance**: Budget approximately $650 - $950 per year for fluids, brake pads, tire rotations, and scheduled service intervals.
- **Insurance Group**: Moderate-low relative to vehicle class; obtain a VIN insurance quote from your carrier before buying.

**4. 💡 Tactical Dealer Negotiation Strategy for this Model:**
- **Inventory Leverage**: Look up average days-on-lot for this vehicle on CarMatrix. If it has been sitting over 45 days, open negotiations at **8% to 10% below asking price**.
- **The Script**: *"I have inspected this ${v.name}. Factoring in upcoming scheduled 60k-mile service and current market comps, my clean out-the-door target is $XX,XXX all-in. If we can reach that figure on a signed buyer's order, I am ready to close today."*`;
  }

  if (isTruckQuery) {
    return `### 🛻 CarMatrix Full-Size & Midsize Truck Buying Guide

**1. Top Pick Breakdown:**
- **Ford F-150 (2018-2023)**: Best-in-class payload capacity and aluminum corrosion resistance. The **2.7L EcoBoost V6** is the reliability sweet spot; avoid pre-2020 3.5L EcoBoosts unless cam phasers have been replaced with updated parts (TSB 21-2119).
- **Toyota Tundra / Tacoma**: Class-leading resale retention (holds 70%+ after 3 years). Tundra 5.7L V8 (pre-2022) is indestructible; 2022-2023 3.4L twin-turbo V6 has active main bearing recall.
- **Ram 1500 (2019-2024)**: Unmatched ride comfort thanks to rear coil springs and whisper-quiet cabin acoustics. Factor in $900 for broken exhaust manifold bolts around 70k miles on the 5.7L Hemi.
- **Chevy Silverado / GMC Sierra 1500**: **3.0L Duramax inline-6 diesel** provides 30+ MPG highway and great torque. Be cautious of 5.3L/6.2L V8 Dynamic Fuel Management lifter collapse.

**2. Critical Truck Inspection Checklist:**
- **Towing Abuse**: Inspect the Class IV hitch receiver for heavy tow-ball wear, rust, and bent wiring harness plugs.
- **Transmission Fluid**: Check 10-speed transmissions (Ford/GM 10R80) for harsh 1-3 upshift clunks or hesitation when cold.
- **Bed & Cab Mounts**: Check for frame rust near the rear spare tire hanger and inspect cab rubber isolator mounts.

**3. Fair Market Price Guidance:**
- **2020-2022 Lightly Used SuperCrew (45k-65k mi)**: $31,000 - $39,000 (XLT / LT / Big Horn).
- **Payload Watchout**: Do not trust the brochure tow rating; always read the specific yellow tire & loading sticker inside the driver door jamb for the actual payload capacity.

**4. 💡 Dealership Negotiation Script:**
*"Domestic pickup trucks currently have among the highest days-of-supply in the country. With dealer lots holding 90+ days of truck inventory, I will not pay MSRP or any dealer prep/accessory charges. My offer is 9% below dealer asking Out-The-Door."*`;
  }

  if (isEVQuery) {
    return `### ⚡ CarMatrix Electric & Hybrid Vehicle Buying Guide

**1. Top Electric & Hybrid Picks:**
- **Tesla Model 3 / Model Y (2021-2023)**: Unrivaled Supercharger network reliability, heat pump HVAC, and exceptional efficiency (3.8 - 4.2 miles/kWh).
- **Hyundai Ioniq 5 / Kia EV6 (2022-2024)**: 800V ultra-fast architecture charges 10% to 80% in 18 minutes. Look for completed ICCU (Integrated Charging Control Unit) software update.
- **Toyota Prius / RAV4 Prime (PHEV)**: The ultimate hedge against high gas and electricity prices; 42-50 miles pure EV range followed by 40+ MPG hybrid gas mode.

**2. Used EV Federal Tax Credit ($4,000 Incentive):**
- Used EVs priced at **$25,000 or less** purchased through a licensed dealership qualify for an instant **30% tax credit (up to $4,000)** at point-of-sale under IRS Section 25E.
- **Requirement**: Vehicle must be at least 2 model years old and buyer income must be under $75k single / $150k married.

**3. Essential EV Pre-Purchase Inspection:**
- **Battery State of Health (SoH)**: Enter service mode to verify battery degradation is under 12%.
- **Tire Tread Depth**: EVs consume tires 25-30% faster due to high curb weight and instantaneous torque. Check inner shoulder wear.
- **High-Voltage Battery Warranty**: Federal law mandates battery and powertrain warranty coverage for a minimum of **8 years or 100,000 miles**.

**4. 💡 Dealer Negotiation Angle:**
*"Used EV prices have dropped over 24% year-over-year. Dealers frequently overpaid on EV trade-ins and are eager to move them. If you price this unit under $25,000, we can utilize the IRS Section 25E tax credit and close this deal today."*`;
  }

  if (isFamilySUV) {
    return `### 🚙 CarMatrix 3-Row & Family SUV Recommendation Guide

**1. Top Family Vehicle Recommendations:**
- **Toyota Highlander / Grand Highlander**: Legendary durability, standard active safety suite, and class-leading Hybrid fuel economy (36 MPG combined).
- **Honda Pilot (2020-2023)**: Removable second-row middle seat, proven naturally aspirated 3.5L V6 (no turbos), and smooth 9-speed/10-speed transmission.
- **Kia Telluride / Hyundai Palisade**: Luxury-tier cabin appointments, spacious third row for adults, and standard 10yr/100k mile powertrain warranty for original owners (5yr/60k for secondary buyers).
- **Subaru Ascent**: Standard symmetrical AWD with 8.7 inches of ground clearance, 19 cup holders, and high IIHS Top Safety Pick+ crash scores.

**2. Reliability & Safety Watchouts:**
- **Second-Row Latch Accessibility**: Test child car seat anchors with your actual seats before purchasing.
- **Rear Climate Controls**: Verify the secondary rear HVAC compressor and blower motor blow freezing cold air in all rear ceiling vents.
- **Transmission Fluid**: Avoid used luxury 3-row SUVs with dual-clutch transmissions; torque-converter automatics are far superior for family stop-and-go driving.

**3. Fair Market Price Expectations:**
- **3-Year Old Clean Family SUV (35k-50k mi)**: $28,000 - $36,000.
- **Certified Pre-Owned (CPO)**: $31,500 - $39,000.

**4. 💡 Negotiation Strategy:**
Always negotiate the trade-in of your current vehicle **separately** from the purchase of the SUV. Dealers will intentionally offer you $1,500 less for your trade-in while pretending to discount the SUV price.`;
  }

  if (isSportsCar) {
    return `### 🏎️ CarMatrix Sports & Performance Vehicle Buying Dossier

**1. Top Enthusiast Benchmark Vehicles:**
- **Mazda MX-5 Miata (ND2 2019-2024)**: The benchmark for pure driving dynamics. The 2019+ 2.0L revs to 7,500 RPM, weighs under 2,400 lbs, and maintains bulletproof reliability.
- **Porsche Cayman / Boxster (981 / 718)**: Surgical steering precision and mid-engine balance. The 981 generation (2013-2016) features the soulful naturally aspirated flat-6 engine.
- **Chevrolet Corvette C7 (2014-2019)**: Tremendous value-for-dollar. Naturally aspirated 6.2L LT1 V8 with 455 HP and cheap, readily available domestic replacement parts.
- **Volkswagen Golf GTI / Golf R (Mk7.5 2018-2021)**: The ultimate practical daily driver with EA888 Gen 3 turbo engine and fast DSG dual-clutch transmission.

**2. Mandatory Pre-Purchase Inspection (PPI):**
- **Independent Specialist Inspection**: Never rely on a dealer's "150-point inspection" for a performance vehicle. Spend $250 at an independent marquee specialist shop.
- **ECU Over-Rev / Launch History**: On manual Porsches and sports cars, pull the DME / ECU diagnostic log to check for Range 4-6 mechanical over-revs (money-shifts).
- **Tire Date Codes & Brake Rotors**: Check tire DOT date codes (performance rubber hardens after 5 years) and measure rotor lip wear.

**3. Depreciation & Resale Reality:**
- Enthusiast manual-transmission sports cars depreciate much slower than mainstream cars and often appreciate after hitting the 10-year mark.
- Modifications (aftermarket tunes, coil-overs, downpipes) **decrease** resale value. Prioritize bone-stock, 1-owner vehicles with continuous service binders.`;
  }

  if (isBudgetQuery) {
    return `### 💰 CarMatrix Under-$15k / High-Reliability Budget Guide

**1. Best Used Cars Under $15,000:**
- **Pontiac Vibe (2008-2010)**: The secret car-buying hack. It is mechanically identical to a Toyota Matrix (built in the same Fremont NUMMI Toyota plant), but sells for 25% less because of the defunct Pontiac badge.
- **Mazda 3 / Mazda 6 (2014-2018)**: Skyactiv 2.0L/2.5L engine with real 6-speed automatic. Avoided the early 2000s Ford-era rust issues and offers modern design under budget.
- **Scion xB / xD (2011-2015)**: 100% Toyota powertrain and electronics with quirky styling, huge interior room, and lower price tags than equivalent Corollas.
- **Honda Fit (2012-2018)**: Magic Seats fold completely flat with unmatched cargo volume, bulletproof 1.5L engine, and 35+ MPG.

**2. What to Avoid in the Budget Category:**
- **Avoid Nissan Rogues / Sentras (2011-2019)** with Jatco CVT transmissions prone to early catastrophic failure ($4,500 replacement).
- **Avoid Used German Luxury (BMW, Audi, Mercedes)** under $12,000. A $10,000 BMW 7-Series or Audi A6 still has the repair and parts costs of an $80,000 vehicle.
- **Avoid Ford Focus / Fiesta (2011-2018)** with "PowerShift" dual-clutch automatic transmissions (subject of multiple class-action lawsuits).

**3. Budget Buying Checklist:**
- Spend $100 for a pre-purchase mobile mechanic inspection before exchanging any cash.
- Run a VIN check to confirm title is "Clean" (not Salvage, Rebuilt, Water/Flood, or Odometer Rollback).
- Verify dated service history showing routine 5,000-mile engine oil changes.`;
  }

  // DEFAULT DYNAMIC RESEARCH SYNTHESIS
  return `### 🚗 CarMatrix Automotive Knowledge Brief: ${userPrompt}

**1. Expert Automotive Analysis & Target Recommendations:**
- **Primary Segment Pick**: Focus on 2020-2023 models with verifiable 1-to-2 owner CARFAX reports and zero structural accident records.
- **Powertrain Advice**: Prioritize naturally aspirated or mild-hybrid 4-cylinder/V6 powertrains paired with conventional planetary torque-converter automatics for maximum long-term durability.
- **Resale Benchmark**: Target models with higher-than-average 3-year value retention (Japanese reliability benchmarks like Toyota, Honda, Mazda, or Lexus lead the segment).

**2. Fair Market Pricing & Cost-of-Ownership Benchmarks:**
- **Market Price Target**: Open negotiations at **5% to 8% below the dealer asking price** for clean-title units.
- **5-Year Cost-of-Ownership**: Factor in routine consumables (tires, synthetic fluid flushes, brake pads) averaging $750 - $1,100 annually.
- **Taxes & Legitimate Fees**: Only pay state sales tax, county excise tax, and actual state DMV license/title fees.

**3. Critical Pre-Purchase Inspection (PPI) Gotchas:**
- **Cold Start Verification**: Insist on starting the engine completely cold (exhaust manifold and radiator should be cold to the touch upon arrival) to detect valvetrain ticks, starter grind, or smoke.
- **OBD-II Readiness Scan**: Ensure all emission monitors are set to "Ready" to confirm the dealer has not cleared a check engine fault code right before your visit.
- **Fluid Inspection**: Check transmission fluid color (pink/red, not dark brown or burnt smelling) and inspect brake fluid clarity.

**4. 💡 Dealer Negotiation Playbook & Counter-Offer Script:**
- **The Rule**: Never negotiate on monthly payments in the showroom. Always demand a clean, itemized **Out-The-Door (OTD)** figure.
- **The Script**: *"I have analyzed current wholesale market comps for this vehicle. My budget is capped at $XX,XXX Out-The-Door, inclusive of all government taxes and state registration. If you can provide a signed buyer's order at that number with zero dealer add-on packs, I am ready to close immediately."*`;
}
