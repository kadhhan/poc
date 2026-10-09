import { Shipment, SearchFilterState, ShipmentStatus } from '../types/shipment';

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

export function filterShipments(
  shipments: Shipment[],
  filters: SearchFilterState
): Shipment[] {
  return shipments.filter((shipment) => {
    // 1. Origin Filter
    if (filters.fromLocation && filters.fromLocation !== 'ALL') {
      if (shipment.origin.city.toLowerCase() !== filters.fromLocation.toLowerCase()) {
        return false;
      }
    }

    // 2. Destination Filter
    if (filters.toLocation && filters.toLocation !== 'ALL') {
      if (shipment.destination.city.toLowerCase() !== filters.toLocation.toLowerCase()) {
        return false;
      }
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
    if (filters.keyword && filters.keyword.trim() !== '') {
      const q = filters.keyword.trim().toLowerCase();
      const matchesId = shipment.id.toLowerCase().includes(q);
      const matchesRef = shipment.referenceNumber.toLowerCase().includes(q);
      const matchesCarrier = shipment.carrier.toLowerCase().includes(q);
      const matchesDesc = shipment.cargoDescription.toLowerCase().includes(q);
      const matchesOrigin =
        shipment.origin.city.toLowerCase().includes(q) ||
        shipment.origin.code.toLowerCase().includes(q);
      const matchesDest =
        shipment.destination.city.toLowerCase().includes(q) ||
        shipment.destination.code.toLowerCase().includes(q);
      const matchesVessel = shipment.vesselOrFlight.toLowerCase().includes(q);

      if (!matchesId && !matchesRef && !matchesCarrier && !matchesDesc && !matchesOrigin && !matchesDest && !matchesVessel) {
        return false;
      }
    }

    return true;
  });
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

export function exportShipmentsToCSV(shipments: Shipment[], filename = 'shipments-export.csv') {
  if (shipments.length === 0) return;

  const headers = [
    'Shipment ID',
    'Origin City',
    'Origin Code',
    'Destination City',
    'Destination Code',
    'Carrier',
    'Transport Mode',
    'ETD',
    'ETA',
    'Pieces',
    'Gross Weight (kg)',
    'Status',
    'Reference Type',
    'Reference No',
    'Flight / Vessel',
    'Cargo Description',
  ];

  const rows = shipments.map((s) => [
    s.id,
    s.origin.city,
    s.origin.code,
    s.destination.city,
    s.destination.code,
    s.carrier,
    s.mode,
    s.etd,
    s.eta,
    s.pieces,
    s.grossWeightKg,
    s.status,
    s.referenceType,
    s.referenceNumber,
    s.vesselOrFlight,
    `"${s.cargoDescription.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
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

export function getStatusStyle(status: ShipmentStatus): {
  badge: string;
  dot: string;
  label: string;
} {
  switch (status) {
    case 'In Transit':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dot: 'bg-blue-500 ring-blue-300',
        label: 'In Transit',
      };
    case 'Delivered':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500 ring-emerald-300',
        label: 'Delivered',
      };
    case 'Arrived':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
        dot: 'bg-purple-500 ring-purple-300',
        label: 'Arrived',
      };
    case 'Booked':
    default:
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500 ring-amber-300',
        label: 'Booked',
      };
  }
}
