export type ShipmentStatus = 'Booked' | 'In Transit' | 'Arrived' | 'Delivered';

export type TransportMode = 'Air' | 'Sea';

export interface LocationInfo {
  city: string;
  code: string;
  country: string;
  airportName?: string;
  airportCode?: string;
  seaportName?: string;
  seaportCode?: string;
  lat?: number;
  lng?: number;
}

export interface RouteWaypoint {
  name: string;
  code: string;
  type: 'Airport' | 'Seaport' | 'Maritime Waypoint' | 'Canal Hub';
  lat: number;
  lng: number;
  status: 'Departed' | 'Passed' | 'Approaching' | 'Scheduled';
  timestamp?: string;
  description?: string;
}

export interface Milestone {
  step: string;
  timestamp: string;
  location: string;
  completed: boolean;
  isCurrent?: boolean;
}

export interface Shipment {
  id: string; // e.g. 'SHP-88201'
  origin: LocationInfo;
  destination: LocationInfo;
  carrier: string;
  mode: TransportMode;
  etd: string; // Estimated Time of Departure (e.g., '2026-10-12 14:30')
  eta: string; // Estimated Time of Arrival (e.g., '2026-10-14 09:15')
  pieces: number;
  grossWeightKg: number;
  status: ShipmentStatus;
  
  // Extended Details
  referenceType: 'AWB' | 'B/L';
  referenceNumber: string; // Master AWB or Ocean B/L number
  serviceLevel: string;
  cargoDescription: string;
  vesselOrFlight: string;
  containerOrPackageType: string;
  dimensions?: string;
  volumeCbm?: number;
  consignor: string; // Shipper
  consignee: string; // Receiver
  milestones: Milestone[];

  // Route Waypoints & Position for Track & Trace Map
  waypoints?: RouteWaypoint[];
  currentPosition?: {
    lat: number;
    lng: number;
    label: string;
    progressPercent: number;
    statusText: string;
  };
}

export interface SearchFilterState {
  fromLocation: string;
  toLocation: string;
  mode: string; // 'All' | 'Air' | 'Sea'
  status: string; // 'All' | 'Booked' | 'In Transit' | 'Arrived' | 'Delivered'
  carrier: string; // 'All' | specific carrier
  keyword: string;
}
