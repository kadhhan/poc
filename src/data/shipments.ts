import { Shipment, LocationInfo } from '../types/shipment';
import { WORLD_LOCATIONS } from './globalLocations';
import { generateGlobalSeedShipments } from '../utils/dummyDataGenerator';

// 75+ Major commercial logistics hubs and ports worldwide
export const LOCATIONS_CATALOG: LocationInfo[] = WORLD_LOCATIONS.map((loc) => ({
  city: loc.city,
  code: loc.code,
  country: loc.country,
}));

// Initial comprehensive global dataset of 130+ realistic shipments across all continents
export const INITIAL_SHIPMENTS: Shipment[] = generateGlobalSeedShipments();
