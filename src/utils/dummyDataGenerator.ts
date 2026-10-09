import { Shipment, LocationInfo, TransportMode, ShipmentStatus, Milestone, RouteWaypoint } from '../types/shipment';
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
    { step: 'Cargo Acceptance & Weight Verification', location: `${origin.city} Cargo Acceptance Bay` },
    { step: 'Export Customs Cleared', location: `${origin.city} Border Customs` },
    { step: 'Departed Origin Hub', location: `${origin.city} (${origin.code})` },
    { step: 'In Transit / Transshipment Hub', location: `En route to ${destination.code}` },
    { step: 'Arrived at Port of Discharge', location: `${destination.city} (${destination.code})` },
    { step: 'Customs & Port Health Clearance', location: `${destination.city} Import Cargo Gate` },
    { step: 'Delivered to Consignee Facility', location: `${destination.city} Central Hub` },
  ];

  let completedUpTo = 1;
  if (status === 'Booked') completedUpTo = 2;
  else if (status === 'In Transit') completedUpTo = 5;
  else if (status === 'Arrived') completedUpTo = 6;
  else if (status === 'Delivered') completedUpTo = 8;

  return steps.map((s, idx) => ({
    step: s.step,
    location: s.location,
    completed: idx < completedUpTo,
    isCurrent: idx === completedUpTo - 1,
    timestamp: idx < completedUpTo ? `${etdDate} ${String(8 + idx * 2).padStart(2, '0')}:00` : `${etaDate} ${String(10 + idx).padStart(2, '0')}:00`,
  }));
}

/**
 * Generate intermediate route waypoints and current tracking position
 */
function generateRouteWaypointsAndPosition(
  origin: LocationInfo,
  destination: LocationInfo,
  mode: TransportMode,
  status: ShipmentStatus,
  etdDate: string
): { waypoints: RouteWaypoint[]; currentPosition: Shipment['currentPosition'] } {
  const waypoints: RouteWaypoint[] = [];
  const oLat = origin.lat ?? 0;
  const oLng = origin.lng ?? 0;
  const dLat = destination.lat ?? 0;
  const dLng = destination.lng ?? 0;

  // Add intermediate hub based on mode and geographic regions
  if (mode === 'Air') {
    // Determine whether to add a connecting air hub
    const isTranscontinental = Math.abs(oLng - dLng) > 40 || Math.abs(oLat - dLat) > 25;
    if (isTranscontinental) {
      // Find a reasonable mid-hub like Dubai (DXB), Doha (DOH), Singapore (SIN), or Frankfurt (FRA)
      let midHub: { name: string; code: string; lat: number; lng: number } = {
        name: 'Dubai International Air Cargo Hub',
        code: 'DXB',
        lat: 25.253,
        lng: 55.365,
      };

      if (oLng > 90 && dLng > 90) {
        midHub = { name: 'Singapore Changi Air Hub', code: 'SIN', lat: 1.352, lng: 103.819 };
      } else if (oLng < 0 && dLng < 0) {
        midHub = { name: 'Miami Americas Airfreight Gateway', code: 'MIA', lat: 25.761, lng: -80.191 };
      } else if (Math.abs(oLng) < 30 && Math.abs(dLng) < 30) {
        midHub = { name: 'Frankfurt Airport CargoCity', code: 'FRA', lat: 50.110, lng: 8.682 };
      }

      // Check if midHub is neither origin nor destination
      if (midHub.code !== origin.code && midHub.code !== destination.code) {
        waypoints.push({
          name: midHub.name,
          code: midHub.code,
          type: 'Airport',
          lat: midHub.lat,
          lng: midHub.lng,
          status: status === 'Delivered' || status === 'Arrived' ? 'Passed' : status === 'In Transit' ? 'Passed' : 'Scheduled',
          timestamp: `${etdDate} 16:30`,
          description: 'Scheduled transit / cargo transshipment terminal',
        });
      }
    }
  } else {
    // Sea Freight nautical corridors
    // E.g. Asia to Europe / Middle East passes through Malacca / Suez
    const involvesAsia = (oLng > 60 && oLng < 140) || (dLng > 60 && dLng < 140);
    const involvesEurope = (oLng > -15 && oLng < 45 && oLat > 35) || (dLng > -15 && dLng < 45 && dLat > 35);
    const involvesRedSea = (origin.country === 'Saudi Arabia' || destination.country === 'Saudi Arabia' || origin.city === 'Jeddah' || destination.city === 'Jeddah');

    if (involvesAsia && involvesEurope) {
      waypoints.push({
        name: 'Strait of Malacca (Singapore Gateway)',
        code: 'SGSIN',
        type: 'Maritime Waypoint',
        lat: 1.25,
        lng: 103.82,
        status: status === 'Delivered' || status === 'Arrived' ? 'Passed' : 'Scheduled',
        description: 'Vessel transit through international deepsea corridor',
      });
      waypoints.push({
        name: 'Suez Canal Maritime Passage',
        code: 'EGSUE',
        type: 'Canal Hub',
        lat: 29.97,
        lng: 32.55,
        status: status === 'Delivered' || status === 'Arrived' ? 'Passed' : status === 'In Transit' ? 'Approaching' : 'Scheduled',
        description: 'Scheduled convoy transit checkpoint',
      });
    } else if (involvesRedSea && involvesAsia && origin.city !== 'Jeddah') {
      waypoints.push({
        name: 'Arabian Sea Deepwater Corridor',
        code: 'ARAB-SEA',
        type: 'Maritime Waypoint',
        lat: 17.5,
        lng: 63.2,
        status: status === 'Delivered' || status === 'Arrived' ? 'Passed' : 'Scheduled',
        description: 'Ocean vessel underway on primary Red Sea route',
      });
    } else if (Math.abs(oLng - dLng) > 50) {
      // General ocean waypoint
      const midLat = (oLat + dLat) / 2;
      const midLng = (oLng + dLng) / 2;
      waypoints.push({
        name: 'Mid-Ocean Navigation Waypoint',
        code: 'WAYPOINT',
        type: 'Maritime Waypoint',
        lat: midLat,
        lng: midLng,
        status: status === 'Delivered' || status === 'Arrived' ? 'Passed' : 'Scheduled',
        description: 'Vessel tracking corridor',
      });
    }
  }

  // Calculate current progress position
  let progressPercent = 0;
  let statusText = 'Booking in process at origin';
  let curLat = oLat;
  let curLng = oLng;

  if (status === 'Booked') {
    progressPercent = 8;
    statusText = 'Consolidation & space allocation at origin depot';
    curLat = oLat;
    curLng = oLng;
  } else if (status === 'In Transit') {
    progressPercent = randomInt(40, 75);
    statusText = `In transit along planned ${mode === 'Air' ? 'flight corridor' : 'ocean lane'}`;
    
    // Position along waypoint path
    if (waypoints.length > 0) {
      const wp = waypoints[0];
      const factor = (progressPercent - 20) / 60; // 0 to 1 between origin and destination via wp
      if (factor < 0.5) {
        curLat = oLat + (wp.lat - oLat) * (factor * 2);
        curLng = oLng + (wp.lng - oLng) * (factor * 2);
      } else {
        curLat = wp.lat + (dLat - wp.lat) * ((factor - 0.5) * 2);
        curLng = wp.lng + (dLng - wp.lng) * ((factor - 0.5) * 2);
      }
    } else {
      const factor = progressPercent / 100;
      curLat = oLat + (dLat - oLat) * factor;
      curLng = oLng + (dLng - oLng) * factor;
    }
  } else if (status === 'Arrived') {
    progressPercent = 92;
    statusText = `Arrived at ${destination.city} discharge terminal — customs clearance in progress`;
    curLat = dLat + (oLat - dLat) * 0.05;
    curLng = dLng + (oLng - dLng) * 0.05;
  } else if (status === 'Delivered') {
    progressPercent = 100;
    statusText = `Successfully delivered to consignee facility in ${destination.city}`;
    curLat = dLat;
    curLng = dLng;
  }

  return {
    waypoints,
    currentPosition: {
      lat: Number(curLat.toFixed(4)),
      lng: Number(curLng.toFixed(4)),
      label: `${origin.code} → ${destination.code} (${status})`,
      progressPercent,
      statusText,
    },
  };
}

export function createShipment(
  idNum: number,
  originLoc: GlobalLocation,
  destLoc: GlobalLocation,
  forcedMode?: TransportMode,
  forcedStatus?: ShipmentStatus
): Shipment {
  const mode: TransportMode = forcedMode || (Math.random() > 0.45 ? 'Air' : 'Sea');
  const statuses: ShipmentStatus[] = ['Booked', 'In Transit', 'In Transit', 'Arrived', 'Delivered'];
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
    airportName: originLoc.airportName,
    airportCode: originLoc.airportCode,
    seaportName: originLoc.seaportName,
    seaportCode: originLoc.seaportCode,
    lat: originLoc.lat,
    lng: originLoc.lng,
  };

  const destination: LocationInfo = {
    city: destLoc.city,
    code: destLoc.code,
    country: destLoc.country,
    airportName: destLoc.airportName,
    airportCode: destLoc.airportCode,
    seaportName: destLoc.seaportName,
    seaportCode: destLoc.seaportCode,
    lat: destLoc.lat,
    lng: destLoc.lng,
  };

  const { waypoints, currentPosition } = generateRouteWaypointsAndPosition(
    origin,
    destination,
    mode,
    status,
    etd.split(' ')[0]
  );

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
    waypoints,
    currentPosition,
  };
}

/**
 * Generate a rich, comprehensive global baseline dataset (350+ shipments)
 * guaranteeing at least 5-8 shipments for every country and city in the catalog!
 */
export function generateGlobalSeedShipments(): Shipment[] {
  const shipments: Shipment[] = [];
  let idCounter = 101;
  const totalLocations = WORLD_LOCATIONS.length;

  // 1. Guaranteed high-traffic corridors with multiple direct runs
  const highTrafficPairs: [string, string, TransportMode][] = [
    // Asia <-> Middle East
    ['Mumbai', 'Jeddah', 'Air'],
    ['Mumbai', 'Jeddah', 'Air'],
    ['Mumbai', 'Jeddah', 'Air'],
    ['Mumbai', 'Jeddah', 'Sea'],
    ['Mumbai', 'Jeddah', 'Sea'],
    ['Mumbai', 'Jeddah', 'Sea'],
    ['Jeddah', 'Mumbai', 'Air'],
    ['Jeddah', 'Mumbai', 'Air'],
    ['Jeddah', 'Mumbai', 'Sea'],
    ['Jeddah', 'Mumbai', 'Sea'],
    ['Mumbai', 'Dubai', 'Air'],
    ['Mumbai', 'Dubai', 'Air'],
    ['Mumbai', 'Dubai', 'Sea'],
    ['Mumbai', 'Dubai', 'Sea'],
    ['Delhi', 'Riyadh', 'Air'],
    ['Delhi', 'Dubai', 'Air'],
    ['Bangkok', 'Jeddah', 'Air'],
    ['Bangkok', 'Jeddah', 'Sea'],
    ['Singapore', 'Dubai', 'Air'],
    ['Singapore', 'Dubai', 'Sea'],
    ['Shanghai', 'Dubai', 'Sea'],
    ['Shanghai', 'Dubai', 'Air'],
    ['Tokyo', 'Doha', 'Air'],
    ['Hong Kong', 'Riyadh', 'Air'],
    ['Seoul', 'Jeddah', 'Sea'],
    ['Karachi', 'Dubai', 'Sea'],
    ['Colombo', 'Jeddah', 'Sea'],
    ['Dammam', 'Mumbai', 'Sea'],

    // Asia <-> Europe
    ['Bangkok', 'London', 'Air'],
    ['Bangkok', 'London', 'Sea'],
    ['Bangkok', 'London', 'Air'],
    ['Mumbai', 'London', 'Air'],
    ['Mumbai', 'London', 'Sea'],
    ['Singapore', 'London', 'Sea'],
    ['Singapore', 'London', 'Air'],
    ['Shanghai', 'Rotterdam', 'Sea'],
    ['Shanghai', 'Hamburg', 'Sea'],
    ['Shenzhen', 'Rotterdam', 'Sea'],
    ['Tokyo', 'Frankfurt', 'Air'],
    ['Taipei', 'Amsterdam', 'Air'],
    ['Ho Chi Minh City', 'Paris', 'Air'],
    ['Seoul', 'Frankfurt', 'Air'],
    ['Hong Kong', 'London', 'Air'],

    // Europe <-> Middle East & Americas
    ['London', 'Mumbai', 'Air'],
    ['London', 'Mumbai', 'Sea'],
    ['Frankfurt', 'Dubai', 'Air'],
    ['Frankfurt', 'Dubai', 'Sea'],
    ['London', 'Jeddah', 'Air'],
    ['Paris', 'Dubai', 'Air'],
    ['Milan', 'Jeddah', 'Air'],
    ['Amsterdam', 'Singapore', 'Air'],
    ['New York', 'London', 'Air'],
    ['New York', 'London', 'Sea'],
    ['New York', 'Dubai', 'Air'],
    ['Los Angeles', 'Tokyo', 'Air'],
    ['Los Angeles', 'Tokyo', 'Sea'],
    ['Chicago', 'Frankfurt', 'Air'],
    ['Miami', 'São Paulo', 'Air'],
    ['Houston', 'Dammam', 'Sea'],
    ['Toronto', 'London', 'Air'],
    ['Vancouver', 'Shanghai', 'Sea'],

    // Middle East <-> Africa & Americas
    ['Dubai', 'Jeddah', 'Air'],
    ['Dubai', 'Jeddah', 'Sea'],
    ['Dubai', 'London', 'Air'],
    ['Dubai', 'Johannesburg', 'Air'],
    ['Riyadh', 'Cairo', 'Air'],
    ['Jeddah', 'Cairo', 'Sea'],
    ['Doha', 'Frankfurt', 'Air'],
    ['Cairo', 'Dubai', 'Air'],

    // Latin America, Africa & Oceania
    ['São Paulo', 'Rotterdam', 'Sea'],
    ['Buenos Aires', 'Madrid', 'Sea'],
    ['Johannesburg', 'London', 'Air'],
    ['Nairobi', 'Amsterdam', 'Air'],
    ['Sydney', 'Singapore', 'Air'],
    ['Sydney', 'Singapore', 'Sea'],
    ['Melbourne', 'London', 'Air'],
    ['Auckland', 'Los Angeles', 'Sea'],
  ];

  for (const [origCity, destCity, forcedMode] of highTrafficPairs) {
    const orig = WORLD_LOCATIONS.find((l) => l.city.toLowerCase() === origCity.toLowerCase()) || WORLD_LOCATIONS[0];
    const dest = WORLD_LOCATIONS.find((l) => l.city.toLowerCase() === destCity.toLowerCase()) || WORLD_LOCATIONS[1];
    shipments.push(createShipment(idCounter++, orig, dest, forcedMode));
  }

  // 2. Guarantee that EVERY single location in WORLD_LOCATIONS has at least 3-4 outbound and 3-4 inbound shipments
  for (let i = 0; i < totalLocations; i++) {
    const loc = WORLD_LOCATIONS[i];
    
    // Check outbound count for this city
    const existingOutbound = shipments.filter((s) => s.origin.city === loc.city).length;
    const neededOutbound = Math.max(0, 4 - existingOutbound);

    for (let j = 0; j < neededOutbound; j++) {
      // Pick a destination from another region
      let destIdx = (i + (j + 1) * 7) % totalLocations;
      if (destIdx === i) destIdx = (i + 1) % totalLocations;
      const dest = WORLD_LOCATIONS[destIdx];
      const mode: TransportMode = j % 2 === 0 ? 'Air' : 'Sea';
      shipments.push(createShipment(idCounter++, loc, dest, mode));
    }

    // Check inbound count for this city
    const existingInbound = shipments.filter((s) => s.destination.city === loc.city).length;
    const neededInbound = Math.max(0, 4 - existingInbound);

    for (let k = 0; k < neededInbound; k++) {
      let origIdx = (i + (k + 1) * 11) % totalLocations;
      if (origIdx === i) origIdx = (i + 2) % totalLocations;
      const orig = WORLD_LOCATIONS[origIdx];
      const mode: TransportMode = k % 2 === 0 ? 'Sea' : 'Air';
      shipments.push(createShipment(idCounter++, orig, loc, mode));
    }
  }

  // 3. Additional varied global network connections up to ~320 records
  while (shipments.length < 320) {
    const origIdx = randomInt(0, totalLocations - 1);
    let destIdx = randomInt(0, totalLocations - 1);
    while (destIdx === origIdx) {
      destIdx = randomInt(0, totalLocations - 1);
    }
    shipments.push(createShipment(idCounter++, WORLD_LOCATIONS[origIdx], WORLD_LOCATIONS[destIdx]));
  }

  return shipments;
}

/**
 * Generate 6 authentic direct shipments for ANY custom route requested by user
 */
export function generateShipmentsForSpecificRoute(
  fromCityOrQuery: string,
  toCityOrQuery: string,
  existingCount: number,
  countToGenerate: number = 6
): Shipment[] {
  const findLoc = (query: string): GlobalLocation => {
    const clean = query.trim().toLowerCase();
    const match = WORLD_LOCATIONS.find(
      (l) =>
        l.city.toLowerCase() === clean ||
        l.code.toLowerCase() === clean ||
        l.country.toLowerCase() === clean ||
        (l.aliases && l.aliases.some((a) => a.toLowerCase() === clean))
    );
    if (match) return match;

    const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
    return {
      city: capitalized,
      code: query.slice(0, 3).toUpperCase(),
      country: 'Global Trade Hub',
      region: 'Asia',
      airportName: `${capitalized} International Airport`,
      airportCode: query.slice(0, 3).toUpperCase(),
      seaportName: `Port of ${capitalized} Harbor`,
      seaportCode: query.slice(0, 5).toUpperCase(),
      lat: 20.0 + (existingCount % 30),
      lng: 40.0 + (existingCount % 60),
    };
  };

  const origLoc = findLoc(fromCityOrQuery);
  const destLoc = findLoc(toCityOrQuery);

  const newRecords: Shipment[] = [];
  const countToCreate = Math.max(countToGenerate, 6);

  for (let i = 0; i < countToCreate; i++) {
    const newId = 20000 + existingCount + i;
    const mode: TransportMode = i % 2 === 0 ? 'Air' : 'Sea';
    const statuses: ShipmentStatus[] = ['In Transit', 'Booked', 'Arrived', 'Delivered'];
    const status = statuses[i % statuses.length];
    newRecords.push(createShipment(newId, origLoc, destLoc, mode, status));
  }

  return newRecords;
}
