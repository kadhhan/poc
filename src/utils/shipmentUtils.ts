import { Shipment, SearchFilterState, ShipmentStatus, LocationInfo } from '../types/shipment';

export interface ShipmentSummary {
  totalShipments: number;
  uniqueCarriers: number;
  inTransit: number;
  delivered: number;
  booked: number;
  arrived: number;
  totalWeightKg: number;
  totalPieces: number;
}

export interface FilterResult {
  directMatches: Shipment[];
  alternativeMatches: Shipment[];
  combinedResults: Shipment[];
  hasAlternatives: boolean;
  alternativeNote?: string;
}

export function matchesLocationString(loc: LocationInfo, query: string): boolean {
  if (!query || query === 'ALL' || query.trim() === '') return true;
  const q = query.trim().toLowerCase();

  if (loc.city.toLowerCase().includes(q)) return true;
  if (loc.code.toLowerCase().includes(q)) return true;
  if (loc.country.toLowerCase().includes(q)) return true;
  if (loc.airportName && loc.airportName.toLowerCase().includes(q)) return true;
  if (loc.airportCode && loc.airportCode.toLowerCase().includes(q)) return true;
  if (loc.seaportName && loc.seaportName.toLowerCase().includes(q)) return true;
  if (loc.seaportCode && loc.seaportCode.toLowerCase().includes(q)) return true;

  // Comprehensive alias & country nickname matching
  if ((q === 'us' || q === 'usa' || q === 'america' || q === 'united states') && loc.country === 'United States') return true;
  if ((q === 'uk' || q === 'britain' || q === 'great britain' || q === 'england' || q === 'united kingdom') && loc.country === 'United Kingdom') return true;
  if ((q === 'uae' || q === 'emirates' || q === 'united arab emirates' || q === 'dubai' || q === 'abu dhabi') && loc.country === 'United Arab Emirates') return true;
  if ((q === 'ksa' || q === 'saudi' || q === 'saudi arabia') && loc.country === 'Saudi Arabia') return true;
  if ((q === 'korea' || q === 'south korea' || q === 'rok') && loc.country === 'South Korea') return true;
  if ((q === 'vietnam' || q === 'viet nam') && loc.country === 'Vietnam') return true;
  if ((q === 'germany' || q === 'deutschland') && loc.country === 'Germany') return true;
  if ((q === 'holland' || q === 'netherlands') && loc.country === 'Netherlands') return true;
  if ((q === 'india' || q === 'bharat') && loc.country === 'India') return true;
  if ((q === 'china' || q === 'prc') && loc.country === 'China') return true;
  if ((q === 'japan' || q === 'nippon') && loc.country === 'Japan') return true;

  return false;
}

export function matchesKeyword(shipment: Shipment, keyword: string): boolean {
  if (!keyword || keyword.trim() === '') return true;
  const q = keyword.trim().toLowerCase();

  if (shipment.id.toLowerCase().includes(q)) return true;
  if (shipment.referenceNumber.toLowerCase().includes(q)) return true;
  if (shipment.carrier.toLowerCase().includes(q)) return true;
  if (shipment.carrierCode && shipment.carrierCode.toLowerCase().includes(q)) return true;
  if (shipment.flightNumber && shipment.flightNumber.toLowerCase().includes(q)) return true;
  if (shipment.vesselName && shipment.vesselName.toLowerCase().includes(q)) return true;
  if (shipment.voyageNumber && shipment.voyageNumber.toLowerCase().includes(q)) return true;
  if (shipment.aircraftType && shipment.aircraftType.toLowerCase().includes(q)) return true;
  if (shipment.cargoDescription.toLowerCase().includes(q)) return true;
  if (shipment.vesselOrFlight.toLowerCase().includes(q)) return true;
  if (shipment.containerOrPackageType.toLowerCase().includes(q)) return true;
  if (shipment.origin.city.toLowerCase().includes(q)) return true;
  if (shipment.origin.code.toLowerCase().includes(q)) return true;
  if (shipment.origin.country.toLowerCase().includes(q)) return true;
  if (shipment.destination.city.toLowerCase().includes(q)) return true;
  if (shipment.destination.code.toLowerCase().includes(q)) return true;
  if (shipment.destination.country.toLowerCase().includes(q)) return true;

  if (shipment.origin.airportName && shipment.origin.airportName.toLowerCase().includes(q)) return true;
  if (shipment.origin.airportCode && shipment.origin.airportCode.toLowerCase().includes(q)) return true;
  if (shipment.origin.seaportName && shipment.origin.seaportName.toLowerCase().includes(q)) return true;
  if (shipment.origin.seaportCode && shipment.origin.seaportCode.toLowerCase().includes(q)) return true;
  if (shipment.destination.airportName && shipment.destination.airportName.toLowerCase().includes(q)) return true;
  if (shipment.destination.airportCode && shipment.destination.airportCode.toLowerCase().includes(q)) return true;
  if (shipment.destination.seaportName && shipment.destination.seaportName.toLowerCase().includes(q)) return true;
  if (shipment.destination.seaportCode && shipment.destination.seaportCode.toLowerCase().includes(q)) return true;

  return false;
}

export function filterShipments(
  shipments: Shipment[],
  filters: SearchFilterState
): Shipment[] {
  return shipments.filter((shipment) => {
    // 1. Origin Filter
    if (!matchesLocationString(shipment.origin, filters.fromLocation)) {
      return false;
    }

    // 2. Destination Filter
    if (!matchesLocationString(shipment.destination, filters.toLocation)) {
      return false;
    }

    // 3. Mode Filter (Air / Sea)
    if (filters.mode && filters.mode !== 'ALL') {
      if (shipment.mode !== filters.mode) {
        return false;
      }
    }

    // 4. Status Filter
    if (filters.status && filters.status !== 'ALL') {
      if (shipment.status !== filters.status) {
        return false;
      }
    }

    // 5. Carrier Filter
    if (filters.carrier && filters.carrier !== 'ALL') {
      if (shipment.carrier !== filters.carrier) {
        return false;
      }
    }

    // 6. Free text keyword search
    if (!matchesKeyword(shipment, filters.keyword)) {
      return false;
    }

    return true;
  });
}

/**
 * Standard robust search for shipments matching all active filters.
 */
export function searchShipmentsWithAlternatives(
  shipments: Shipment[],
  filters: SearchFilterState
): FilterResult {
  const direct = filterShipments(shipments, filters);
  return {
    directMatches: direct,
    alternativeMatches: [],
    combinedResults: direct,
    hasAlternatives: false,
    alternativeNote: undefined,
  };
}

export function calculateSummary(shipments: Shipment[]): ShipmentSummary {
  const carrierSet = new Set<string>();
  let inTransit = 0;
  let delivered = 0;
  let booked = 0;
  let arrived = 0;
  let totalWeightKg = 0;
  let totalPieces = 0;

  for (const s of shipments) {
    carrierSet.add(s.carrier);
    totalWeightKg += s.grossWeightKg;
    totalPieces += s.pieces;

    if (s.status === 'In Transit') inTransit++;
    else if (s.status === 'Delivered') delivered++;
    else if (s.status === 'Booked') booked++;
    else if (s.status === 'Arrived') arrived++;
  }

  return {
    totalShipments: shipments.length,
    uniqueCarriers: carrierSet.size,
    inTransit,
    delivered,
    booked,
    arrived,
    totalWeightKg,
    totalPieces,
  };
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} tons (${kg.toLocaleString()} kg)`;
  }
  return `${kg.toLocaleString()} kg`;
}

export function getStatusStyle(status: ShipmentStatus): {
  badge: string;
  dot: string;
  bg: string;
} {
  switch (status) {
    case 'Booked':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
        dot: 'bg-amber-500',
        bg: 'bg-amber-50',
      };
    case 'In Transit':
      return {
        badge: 'bg-blue-50 text-blue-800 border-blue-200/80',
        dot: 'bg-blue-600 animate-pulse',
        bg: 'bg-blue-50',
      };
    case 'Arrived':
      return {
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
        dot: 'bg-indigo-600',
        bg: 'bg-indigo-50',
      };
    case 'Delivered':
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dot: 'bg-emerald-600',
        bg: 'bg-emerald-50',
      };
    default:
      return {
        badge: 'bg-slate-50 text-slate-800 border-slate-200',
        dot: 'bg-slate-500',
        bg: 'bg-slate-50',
      };
  }
}

export function exportShipmentsToCSV(shipments: Shipment[], filename = 'shipments-export.csv') {
  const headers = [
    'Shipment ID',
    'Reference Type',
    'Reference Number',
    'Origin City',
    'Origin Code',
    'Origin Country',
    'Origin Airport',
    'Origin Seaport',
    'Destination City',
    'Destination Code',
    'Destination Country',
    'Destination Airport',
    'Destination Seaport',
    'Carrier Name',
    'Carrier Code',
    'Transport Mode',
    'Flight Number',
    'Vessel Name',
    'Voyage Number',
    'Vessel or Flight',
    'ETD',
    'ETA',
    'Pieces',
    'Gross Weight (kg)',
    'Volume (CBM)',
    'Status',
    'Service Level',
    'Cargo Description',
    'Container or Package Type',
    'Consignor (Shipper)',
    'Consignee (Receiver)',
  ];

  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = shipments.map((s) => [
    s.id,
    s.referenceType,
    s.referenceNumber,
    s.origin.city,
    s.origin.code,
    s.origin.country,
    s.origin.airportName || '',
    s.origin.seaportName || '',
    s.destination.city,
    s.destination.code,
    s.destination.country,
    s.destination.airportName || '',
    s.destination.seaportName || '',
    s.carrier || 'Not available',
    s.carrierCode || 'Not available',
    s.mode,
    s.flightNumber || 'Not available',
    s.vesselName || 'Not available',
    s.voyageNumber || 'Not available',
    s.vesselOrFlight || 'Not available',
    s.etd,
    s.eta,
    s.pieces,
    s.grossWeightKg,
    s.volumeCbm || '',
    s.status,
    s.serviceLevel,
    s.cargoDescription,
    s.containerOrPackageType,
    s.consignor,
    s.consignee,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.map(escapeCSV).join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
