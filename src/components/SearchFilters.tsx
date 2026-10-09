import React, { useState } from 'react';
import { Search, RotateCcw, ArrowRightLeft, Filter, Plane, Ship, Globe, Anchor } from 'lucide-react';
import { SearchFilterState, Shipment } from '../types/shipment';
import { LocationSearchInput } from './LocationSearchInput';

interface SearchFiltersProps {
  filters: SearchFilterState;
  onApplyFilters: (newFilters: SearchFilterState) => void;
  onReset: () => void;
  availableCarriers: string[];
  shipments: Shipment[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onApplyFilters,
  onReset,
  availableCarriers,
  shipments,
}) => {
  // Local state so user can select filters and press "Search" (or enter)
  const [localFilters, setLocalFilters] = useState<SearchFilterState>(filters);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync if parent triggers reset or preset
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyFilters(localFilters);
  };

  const handleResetClick = () => {
    const emptyFilters: SearchFilterState = {
      fromLocation: 'ALL',
      toLocation: 'ALL',
      mode: 'ALL',
      status: 'ALL',
      carrier: 'ALL',
      keyword: '',
    };
    setLocalFilters(emptyFilters);
    onReset();
  };

  const handleModeSwitch = (newMode: 'ALL' | 'Air' | 'Sea') => {
    const updated: SearchFilterState = {
      ...localFilters,
      mode: newMode,
      // If switching modes, reset carrier if it doesn't belong to the new mode
      carrier: 'ALL',
    };
    setLocalFilters(updated);
    onApplyFilters(updated);
  };

  const handleSwapLocations = () => {
    setLocalFilters((prev) => {
      const next = {
        ...prev,
        fromLocation: prev.toLocation,
        toLocation: prev.fromLocation,
      };
      // Immediately apply swap for smooth UX
      onApplyFilters(next);
      return next;
    });
  };

  const handleQuickPreset = (from: string, to: string, modePreset?: 'Air' | 'Sea') => {
    const updated: SearchFilterState = {
      ...localFilters,
      fromLocation: from,
      toLocation: to,
      mode: modePreset || localFilters.mode,
    };
    setLocalFilters(updated);
    onApplyFilters(updated);
  };

  // Counts for tabs
  const totalShipmentsCount = shipments.length;
  const airShipmentsCount = shipments.filter((s) => s.mode === 'Air').length;
  const seaShipmentsCount = shipments.filter((s) => s.mode === 'Sea').length;

  // Filter available carriers based on active mode
  const filteredCarriers = availableCarriers.filter((c) => {
    if (localFilters.mode === 'ALL') return true;
    const isAirCarrier = shipments.some((s) => s.carrier === c && s.mode === 'Air');
    const isSeaCarrier = shipments.some((s) => s.carrier === c && s.mode === 'Sea');
    return localFilters.mode === 'Air' ? isAirCarrier : isSeaCarrier;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 sm:p-5 space-y-4">
      {/* 1. SEPARATE AIR & SEA CATEGORY SWITCHER TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {/* All Shipments Mode */}
          <button
            type="button"
            onClick={() => handleModeSwitch('ALL')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              localFilters.mode === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>All Shipments</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-200/60 text-slate-700">
              {totalShipmentsCount}
            </span>
          </button>

          {/* Air Shipments Mode */}
          <button
            type="button"
            onClick={() => handleModeSwitch('Air')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              localFilters.mode === 'Air'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Air Cargo</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                localFilters.mode === 'Air'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-200/60 text-slate-700'
              }`}
            >
              {airShipmentsCount}
            </span>
          </button>

          {/* Sea Shipments Mode */}
          <button
            type="button"
            onClick={() => handleModeSwitch('Sea')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              localFilters.mode === 'Sea'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-800'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Ocean Freight</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                localFilters.mode === 'Sea'
                  ? 'bg-teal-800 text-white'
                  : 'bg-slate-200/60 text-slate-700'
              }`}
            >
              {seaShipmentsCount}
            </span>
          </button>
        </div>

        {/* Category Description Tag */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Search Scope:</span>
          <span
            className={`font-semibold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded border ${
              localFilters.mode === 'Air'
                ? 'bg-sky-50 text-sky-700 border-sky-200/80'
                : localFilters.mode === 'Sea'
                ? 'bg-teal-50 text-teal-800 border-teal-200/80'
                : 'bg-blue-50 text-blue-700 border-blue-200/80'
            }`}
          >
            {localFilters.mode === 'Air'
              ? '✈ Air Cargo Only (Airports & Airlines)'
              : localFilters.mode === 'Sea'
              ? '⚓ Ocean Freight Only (Seaports & Vessel Lines)'
              : '🌐 Multi-Modal (Air & Sea)'}
          </span>
        </div>
      </div>

      {/* 2. SEARCHABLE FROM & TO ROUTE SEARCH */}
      <form onSubmit={handleSearchSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin (From) - Searchable Manual Place Input */}
          <div className="md:col-span-4">
            <LocationSearchInput
              id="from-location"
              label={
                localFilters.mode === 'Air'
                  ? 'Origin Airport (From)'
                  : localFilters.mode === 'Sea'
                  ? 'Origin Seaport (From)'
                  : 'Origin (From)'
              }
              type="origin"
              mode={localFilters.mode as any}
              iconColor={
                localFilters.mode === 'Air'
                  ? 'text-sky-600'
                  : localFilters.mode === 'Sea'
                  ? 'text-teal-600'
                  : 'text-blue-600'
              }
              placeholder={
                localFilters.mode === 'Air'
                  ? 'Type airport name or IATA code (e.g. BOM, LHR, JFK)...'
                  : localFilters.mode === 'Sea'
                  ? 'Type seaport name or code (e.g. Jebel Ali, JNPT, Rotterdam)...'
                  : 'Type city, airport code, or seaport...'
              }
              value={localFilters.fromLocation}
              shipments={shipments}
              onChange={(val) => {
                setLocalFilters((prev) => ({ ...prev, fromLocation: val }));
              }}
            />
          </div>

          {/* Swap Button (between From & To) */}
          <div className="md:col-span-1 flex justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwapLocations}
              title="Swap Origin and Destination"
              aria-label="Swap Origin and Destination"
              className="p-2 border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination (To) - Searchable Manual Place Input */}
          <div className="md:col-span-4">
            <LocationSearchInput
              id="to-location"
              label={
                localFilters.mode === 'Air'
                  ? 'Destination Airport (To)'
                  : localFilters.mode === 'Sea'
                  ? 'Destination Seaport (To)'
                  : 'Destination (To)'
              }
              type="destination"
              mode={localFilters.mode as any}
              iconColor="text-red-500"
              placeholder={
                localFilters.mode === 'Air'
                  ? 'Type airport name or IATA code (e.g. JED, DXB, LHR)...'
                  : localFilters.mode === 'Sea'
                  ? 'Type seaport name or code (e.g. Jeddah Islamic, Singapore)...'
                  : 'Type destination city, airport, or seaport...'
              }
              value={localFilters.toLocation}
              shipments={shipments}
              onChange={(val) => {
                setLocalFilters((prev) => ({ ...prev, toLocation: val }));
              }}
            />
          </div>

          {/* Action Buttons: Search & Reset */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className={`flex-1 inline-flex items-center justify-center gap-2 text-white font-medium text-sm py-2 px-4 rounded-md shadow-xs transition-colors focus:outline-hidden focus:ring-2 cursor-pointer ${
                localFilters.mode === 'Air'
                  ? 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 focus:ring-sky-500'
                  : localFilters.mode === 'Sea'
                  ? 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 focus:ring-teal-600'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>
                {localFilters.mode === 'Air'
                  ? 'Search Air'
                  : localFilters.mode === 'Sea'
                  ? 'Search Sea'
                  : 'Search All'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetClick}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-sm py-2 px-3 rounded-md transition-colors active:bg-slate-200 cursor-pointer"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. QUICK SCENARIOS & ROUTE PRESETS */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Quick Routes:</span>

        {localFilters.mode === 'Air' ? (
          <>
            <button
              type="button"
              onClick={() => handleQuickPreset('Mumbai', 'Jeddah', 'Air')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 cursor-pointer"
            >
              ✈ Mumbai (BOM) → Jeddah (JED)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Bangkok', 'London', 'Air')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 cursor-pointer"
            >
              ✈ Bangkok (BKK) → London (LHR)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Frankfurt', 'Dubai', 'Air')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 cursor-pointer"
            >
              ✈ Frankfurt (FRA) → Dubai (DXB)
            </button>
          </>
        ) : localFilters.mode === 'Sea' ? (
          <>
            <button
              type="button"
              onClick={() => handleQuickPreset('Mumbai', 'Jeddah', 'Sea')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 cursor-pointer"
            >
              ⚓ Nhava Sheva → Jeddah Port (FCL)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Bangkok', 'London', 'Sea')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 cursor-pointer"
            >
              ⚓ Laem Chabang → London Gateway
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Singapore', 'London', 'Sea')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 cursor-pointer"
            >
              ⚓ Singapore (PSA) → Felixstowe
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleQuickPreset('Mumbai', 'Jeddah')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Mumbai → Jeddah (3)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Bangkok', 'London')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Bangkok → London (3)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Singapore', 'London')}
              className="px-2.5 py-1 rounded text-xs transition-colors border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Singapore → London (2)
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="ml-auto inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 text-xs font-medium cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide More Filters' : 'More Filters'}</span>
          {(localFilters.status !== 'ALL' ||
            localFilters.carrier !== 'ALL' ||
            localFilters.keyword !== '') && (
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          )}
        </button>
      </div>

      {/* 4. ADVANCED FILTER STRIP */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/60 p-3 rounded-md">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-[11px] font-semibold text-slate-600 uppercase mb-1"
            >
              Shipment Status
            </label>
            <select
              id="status-filter"
              value={localFilters.status}
              onChange={(e) => {
                const updated = { ...localFilters, status: e.target.value };
                setLocalFilters(updated);
                onApplyFilters(updated);
              }}
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="In Transit">In Transit</option>
              <option value="Arrived">Arrived</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Carrier Filter (Airlines / Shipping Lines based on Mode) */}
          <div>
            <label
              htmlFor="carrier-filter"
              className="block text-[11px] font-semibold text-slate-600 uppercase mb-1"
            >
              {localFilters.mode === 'Air'
                ? 'Airline Carrier'
                : localFilters.mode === 'Sea'
                ? 'Ocean Shipping Line'
                : 'Carrier (Airline / Ocean Line)'}
            </label>
            <select
              id="carrier-filter"
              value={localFilters.carrier}
              onChange={(e) => {
                const updated = { ...localFilters, carrier: e.target.value };
                setLocalFilters(updated);
                onApplyFilters(updated);
              }}
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">
                All {localFilters.mode === 'Air' ? 'Airlines' : localFilters.mode === 'Sea' ? 'Shipping Lines' : 'Carriers'} ({filteredCarriers.length})
              </option>
              {filteredCarriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label
              htmlFor="keyword-search"
              className="block text-[11px] font-semibold text-slate-600 uppercase mb-1"
            >
              {localFilters.mode === 'Air'
                ? 'Search AWB / Flight # / Air Cargo'
                : localFilters.mode === 'Sea'
                ? 'Search B/L / Vessel / Container #'
                : 'Keyword / ID / AWB / BL / Cargo'}
            </label>
            <div className="relative">
              <input
                id="keyword-search"
                type="text"
                placeholder={
                  localFilters.mode === 'Air'
                    ? 'e.g. 065-49120931, SV 981, Boeing...'
                    : localFilters.mode === 'Sea'
                    ? 'e.g. MAEU-849204812, MSKU9021482...'
                    : 'e.g. SHP-10101, AWB, micro...'
                }
                value={localFilters.keyword}
                onChange={(e) => {
                  const updated = { ...localFilters, keyword: e.target.value };
                  setLocalFilters(updated);
                  onApplyFilters(updated);
                }}
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
