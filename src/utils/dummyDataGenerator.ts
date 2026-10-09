import { Shipment, LocationInfo, TransportMode, ShipmentStatus, Milestone } from '../types/shipment';
import { WORLD_LOCATIONS, GlobalLocation } from '../data/globalLocations';

const AIR_CARRIERS = [
  { name: 'Saudia Cargo', prefix: '065', code: 'SV' },
  { name: 'Emirates SkyCargo', prefix: '176', code: 'EK' },
  { name: 'Qatar Airways Cargo', prefix: '157', code: 'QR' },
  { name: 'Singapore Airlines Cargo', prefix: '618', code: 'SQ' },
  { name: 'Lufthansa Cargo', prefix: '020', code: 'LH' },
  { name: 'British Airways World Cargo', prefix: '125', code: 'BA' },
  { name: 'Cathay Pacific Cargo', prefix: '160', code: 'CX' },
  { name: 'Turkish Cargo', prefix: '235', code: 'TK' },
  { name: 'Korean Air Cargo', prefix: '180', code: 'KE' },
  { name: 'Delta Cargo', prefix: '006', code: 'DL' },
  { name: 'Air France-KLM Cargo', prefix: '057', code: 'AF' },
  { name: 'ANA Cargo', prefix: '205', code: 'NH' },
  { name: 'Ethiopian Cargo', prefix: '071', code: 'ET' },
  { name: 'LATAM Cargo', prefix: '045', code: 'LA' },
  { name: 'Qantas Freight', prefix: '081', code: 'QF' },
];

const SEA_CARRIERS = [
  { name: 'Maersk Line', prefix: 'MAEU' },
  { name: 'MSC', prefix: 'MSCU' },
  { name: 'CMA CGM', prefix: 'CMAC' },
  { name: 'Hapag-Lloyd', prefix: 'HLCU' },
  { name: 'Ocean Network Express (ONE)', prefix: 'ONEY' },
  { name: 'COSCO Shipping', prefix: 'COSU' },
  { name: 'Evergreen Marine', prefix: 'EGLV' },
  { name: 'Yang Ming', prefix: 'YMLU' },
  { name: 'HMM', prefix: 'HDMU' },
  { name: 'ZIM Integrated Shipping', prefix: 'ZIMU' },
];

const COMMODITIES = [
  { desc: 'Automotive gearbox transmissions & sensor harnesses', package: 'PAG Pallet x 2', dims: '120 x 100 x 140 cm' },
  { desc: 'Commercial ceramic floor tiles & glazed sanitary ware', package: '1 x 40ft High Cube Container', dims: '40ft HC Container' },
  { desc: 'Temperature-controlled bio-pharmaceutical vaccines (2-8°C)', package: 'Envirotainer RKN e1', dims: '156 x 153 x 162 cm' },
  { desc: 'Ready-made cotton garments & denim retail apparel', package: 'Corrugated Export Cartons x 120', dims: '60 x 50 x 40 cm' },
  { desc: 'Precision semiconductor microchips & printed circuit boards', package: 'Anti-Static ESD Cushioned Cases', dims: '80 x 60 x 50 cm' },
  { desc: 'Industrial centrifugal pumps & high-pressure valves', package: 'Heavy Reinforced Timber Skids', dims: '140 x 120 x 110 cm' },
  { desc: 'Aerospace structural titanium fasteners & avionics modules', package: 'UN-Certified Flight Cases', dims: '90 x 70 x 60 cm' },
  { desc: 'Fresh tropical mangoes & cold-chain perishables', package: 'Ventilated Airfreight Cartons', dims: '50 x 40 x 30 cm' },
  { desc: 'Consumer lithium-ion power banks & electronic battery packs', package: 'Class 9 Dangerous Goods Steel Drums', dims: '110 x 90 x 80 cm' },
  { desc: 'Photovoltaic bifacial solar cell panels & mounting brackets', package: '2 x 40ft Flat Rack Container', dims: '40ft Heavy Flat Rack' },
  { desc: 'Organic specialty Arabica coffee beans in jute export sacks', package: '1 x 20ft Dry Box Container', dims: '20ft Standard Dry Container' },
  { desc: 'Diagnostic magnetic resonance imaging (MRI) spare assemblies', package: 'Cushioned Shock-Proof Crates', dims: '160 x 140 x 130 cm' },
  { desc: 'Luxury leather footwear & fashion accessories', package: 'Palletized Master Cartons', dims: '120 x 80 x 120 cm' },
  { desc: 'Telecommunications 5G base station microwave antennas', package: 'Reinforced Aluminium Flight Trunks', dims: '180 x 80 x 70 cm' },
  { desc: 'Fine chemical polymer catalysts & laboratory reagents', package: 'ISO Tank Container / Steel Drums', dims: 'Standard Chemical Skid' },
];

const SHIPPERS = [
  'Tata Precision Logistics Ltd., Pune',
  'Siam Global Manufacturing Co., Bangkok',
  'Al-Futtaim Global Distribution, Dubai',
  'Bosch Automotive Technologies, Stuttgart',
  'Sony Electronics Asia Pte Ltd, Tokyo',
  'Samsung C&T Logistics, Seoul',
  'Rolls-Royce Aerospace Systems, Derby',
  'Morbi Ceramic Exporters LLP, Gujarat',
  'Novartis Pharma Logistics, Basel',
  'Foxconn Industrial Internet, Shenzhen',
  'Emirates Petrochem Trading, Abu Dhabi',
  'Shanghai Lingang Export Logistics, Shanghai',
  'Petrobras Marine Supplies, Santos',
  'Bavarian Machining Works, Munich',
  'Red Sea Supply Chain LLC, Jeddah',
];

const CONSIGNEES = [
  'Red Sea Industrial Motors, Jeddah',
  'Kingdom Medical Supplies, Riyadh',
  'Regent Fashion House Ltd., London',
  'Al-Nahda Building Materials Co., Dammam',
  'TechSupply Distribution UK, Felixstowe',
  'Cambridge Quantum Research Labs, Cambridge',
  'Grand Hypermarket Group, Dubai',
  'Mahindra Electric Mobility Ltd., Mumbai',
  'Foster & Partners Architecture Logistics, London',
  'Amazon Global Fulfillment Hub, Frankfurt',
  'Target Corporation Distribution Center, Los Angeles',
  'Al-Hajry Overseas Enterprise, Kuwait City',
  'Sinopharm International Healthcare, Beijing',
  'Sydney Harbor Logistics Pty, Sydney',
  'Trans-African Agro Trading, Cairo',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMilestones(
  origin: LocationInfo,
  destination: LocationInfo,
  status: ShipmentStatus,
  etdDate: string,
  etaDate: string
): Milestone[] {
  const steps = [
    { step: 'Booking Confirmed & Space Allocated', location: `${origin.code} Freight Terminal` },
    { step: 'Export Customs Cleared', location: `${origin.city} Border Customs` },
    { step: 'Departed Origin Hub', location: `${origin.city} (${origin.code})` },
    { step: 'In Transit / Transshipment Hub', location: `En route to ${destination.code}` },
    { step: 'Arrived at Port of Discharge', location: `${destination.city} (${destination.code})` },
    { step: 'Customs & Port Health Clearance', location: `${destination.city} Import Cargo Gate` },
    { step: 'Delivered to Consignee Facility', location: `${destination.city} Central Hub` },
  ];

  let completedUpTo = 1;
  if (status === 'Booked') completedUpTo = 1;
  else if (status === 'In Transit') completedUpTo = 4;
  else if (status === 'Arrived') completedUpTo = 5;
  else if (status === 'Delivered') completedUpTo = 7;

  return steps.map((s, idx) => ({
    step: s.step,
    location: s.location,
    completed: idx < completedUpTo,
    isCurrent: idx === completedUpTo - 1,
    timestamp: idx < completedUpTo ? `${etdDate} ${10 + idx * 2}:00` : `${etaDate} ${12 + idx}:00`,
  }));
}

export function createShipment(
  idNum: number,
  originLoc: GlobalLocation,
  destLoc: GlobalLocation,
  forcedMode?: TransportMode,
  forcedStatus?: ShipmentStatus
): Shipment {
  const mode: TransportMode = forcedMode || (Math.random() > 0.4 ? 'Air' : 'Sea');
  const statuses: ShipmentStatus[] = ['Booked', 'In Transit', 'Arrived', 'Delivered'];
  const status: ShipmentStatus = forcedStatus || randomChoice(statuses);

  const commodity = randomChoice(COMMODITIES);
  const shipper = randomChoice(SHIPPERS);
  const consignee = randomChoice(CONSIGNEES);

  // Dates
  const dayOffset = (idNum % 25) + 1;
  const etdDay = String(Math.max(1, (dayOffset % 28) + 1)).padStart(2, '0');
  const etaDay = String(Math.min(28, (Number(etdDay) + (mode === 'Air' ? 1 : 12)))).padStart(2, '0');
  const etd = `2026-10-${etdDay} ${String(randomInt(2, 22)).padStart(2, '0')}:${String(randomInt(10, 50)).padStart(2, '0')}`;
  const eta = `2026-10-${etaDay} ${String(randomInt(4, 23)).padStart(2, '0')}:${String(randomInt(10, 50)).padStart(2, '0')}`;

  let carrierName = '';
  let refType: 'AWB' | 'B/L' = 'AWB';
  let refNumber = '';
  let vesselOrFlight = '';
  let pieces = 0;
  let grossWeightKg = 0;
  let serviceLevel = '';

  if (mode === 'Air') {
    const airCarrier = randomChoice(AIR_CARRIERS);
    carrierName = airCarrier.name;
    refType = 'AWB';
    refNumber = `${airCarrier.prefix}-${randomInt(1000, 9999)}${randomInt(1000, 9999)}`;
    vesselOrFlight = `${airCarrier.code} ${randomInt(100, 999)} (${randomChoice(['B777-300F', 'B787-9', 'A350-900', 'B747-8F', 'A330-300'])})`;
    pieces = randomInt(8, 150);
    grossWeightKg = randomInt(350, 6800);
    serviceLevel = randomChoice(['Priority Express Air', 'Pharma Direct (2-8°C)', 'Standard General Airfreight', 'Secure High-Value']);
  } else {
    const seaCarrier = randomChoice(SEA_CARRIERS);
    carrierName = seaCarrier.name;
    refType = 'B/L';
    refNumber = `${seaCarrier.prefix}-${randomInt(10000000, 99999999)}`;
    vesselOrFlight = `${randomChoice(['Maersk Mc-Kinney', 'MSC Tessa', 'CMA CGM Palais', 'ONE Apus', 'Ever Given', 'Hapag Berlin'])} / Voy ${randomInt(100, 499)}W`;
    pieces = randomInt(300, 2400);
    grossWeightKg = randomInt(11000, 26500);
    serviceLevel = randomChoice(['Ocean FCL Direct', 'Ocean Standard 40ft HQ', 'Ocean Reefer Direct', 'Ocean Consolidated LCL']);
  }

  const origin: LocationInfo = {
    city: originLoc.city,
    code: originLoc.code,
    country: originLoc.country,
  };

  const destination: LocationInfo = {
    city: destLoc.city,
    code: destLoc.code,
    country: destLoc.country,
  };

  return {
    id: `SHP-${10000 + idNum}`,
    origin,
    destination,
    carrier: carrierName,
    mode,
    etd,
    eta,
    pieces,
    grossWeightKg,
    status,
    referenceType: refType,
    referenceNumber: refNumber,
    serviceLevel,
    cargoDescription: commodity.desc,
    vesselOrFlight,
    containerOrPackageType: commodity.package,
    dimensions: commodity.dims,
    volumeCbm: Number((grossWeightKg / 320).toFixed(2)),
    consignor: shipper,
    consignee,
    milestones: generateMilestones(origin, destination, status, etd.split(' ')[0], eta.split(' ')[0]),
  };
}

/**
 * Generate a large baseline pool of 120 global shipments covering routes worldwide
 */
export function generateGlobalSeedShipments(): Shipment[] {
  const shipments: Shipment[] = [];
  const locationsCount = WORLD_LOCATIONS.length;

  // 1. Guaranteed high-traffic routes
  const primaryPairs: [string, string][] = [
    // Asia -> Middle East
    ['Mumbai', 'Jeddah'],
    ['Mumbai', 'Jeddah'],
    ['Mumbai', 'Jeddah'],
    ['Delhi', 'Riyadh'],
    ['Bangkok', 'Jeddah'],
    ['Singapore', 'Dubai'],
    ['Shanghai', 'Dubai'],
    ['Tokyo', 'Doha'],
    ['Hong Kong', 'Riyadh'],
    ['Seoul', 'Jeddah'],
    
    // Asia -> Europe
    ['Bangkok', 'London'],
    ['Bangkok', 'London'],
    ['Bangkok', 'London'],
    ['Mumbai', 'London'],
    ['Singapore', 'London'],
    ['Shanghai', 'Rotterdam'],
    ['Tokyo', 'Frankfurt'],
    ['Shenzhen', 'Hamburg'],
    ['Taipei', 'Amsterdam'],
    ['Ho Chi Minh City', 'Paris'],
    
    // Europe -> Middle East & Asia
    ['London', 'Mumbai'],
    ['London', 'Mumbai'],
    ['Frankfurt', 'Dubai'],
    ['Frankfurt', 'Dubai'],
    ['London', 'Jeddah'],
    ['Paris', 'Dubai'],
    ['Milan', 'Jeddah'],
    ['Frankfurt', 'Mumbai'],
    ['Amsterdam', 'Singapore'],
    
    // Americas -> Global
    ['New York', 'London'],
    ['New York', 'Dubai'],
    ['Los Angeles', 'Tokyo'],
    ['Chicago', 'Frankfurt'],
    ['Miami', 'São Paulo'],
    ['Atlanta', 'London'],
    ['Houston', 'Dammam'],
    ['Toronto', 'London'],
    
    // Middle East -> Global
    ['Dubai', 'Jeddah'],
    ['Dubai', 'Jeddah'],
    ['Dubai', 'London'],
    ['Riyadh', 'Mumbai'],
    ['Doha', 'Frankfurt'],
    ['Jeddah', 'Cairo'],
    ['Dubai', 'Johannesburg'],
    
    // Latin America, Africa & Oceania
    ['São Paulo', 'Rotterdam'],
    ['Buenos Aires', 'Madrid'],
    ['Johannesburg', 'London'],
    ['Cairo', 'Dubai'],
    ['Nairobi', 'Amsterdam'],
    ['Sydney', 'Singapore'],
    ['Melbourne', 'London'],
    ['Auckland', 'Los Angeles'],
  ];

  let idCounter = 101;

  for (const [origCity, destCity] of primaryPairs) {
    const orig = WORLD_LOCATIONS.find((l) => l.city.toLowerCase() === origCity.toLowerCase()) || WORLD_LOCATIONS[0];
    const dest = WORLD_LOCATIONS.find((l) => l.city.toLowerCase() === destCity.toLowerCase()) || WORLD_LOCATIONS[1];
    shipments.push(createShipment(idCounter++, orig, dest));
  }

  // 2. Generate varied intercontinental routes to reach 125+ shipments
  for (let i = shipments.length; i < 130; i++) {
    const origIdx = randomInt(0, locationsCount - 1);
    let destIdx = randomInt(0, locationsCount - 1);
    while (destIdx === origIdx) {
      destIdx = randomInt(0, locationsCount - 1);
    }
    shipments.push(createShipment(idCounter++, WORLD_LOCATIONS[origIdx], WORLD_LOCATIONS[destIdx]));
  }

  return shipments;
}

/**
 * Generate 2-4 authentic shipments for ANY custom route requested by user
 */
export function generateShipmentsForSpecificRoute(
  fromCityOrQuery: string,
  toCityOrQuery: string,
  existingCount: number
): Shipment[] {
  // Find or create matching locations
  const findLoc = (query: string): GlobalLocation => {
    const clean = query.trim().toLowerCase();
    const match = WORLD_LOCATIONS.find(
      (l) => l.city.toLowerCase() === clean || l.code.toLowerCase() === clean || l.country.toLowerCase() === clean
    );
    if (match) return match;
    // If user typed a custom city not in catalog, construct one!
    const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
    return {
      city: capitalized,
      code: query.slice(0, 3).toUpperCase(),
      country: 'Global Port',
      region: 'Asia',
    };
  };

  const origLoc = findLoc(fromCityOrQuery);
  const destLoc = findLoc(toCityOrQuery);

  const newRecords: Shipment[] = [];
  const countToCreate = randomInt(2, 4);

  for (let i = 0; i < countToCreate; i++) {
    const newId = 20000 + existingCount + i;
    const mode: TransportMode = i % 2 === 0 ? 'Air' : 'Sea';
    const statuses: ShipmentStatus[] = ['In Transit', 'Booked', 'Arrived', 'Delivered'];
    const status = statuses[i % statuses.length];
    newRecords.push(createShipment(newId, origLoc, destLoc, mode, status));
  }

  return newRecords;
}
