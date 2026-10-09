import React, { useState } from 'react';
import { Search, RotateCcw, ArrowRightLeft, Filter, Plane, Ship, Building2, MapPin } from 'lucide-react';
import { SearchFilterState } from '../types/shipment';
import { LOCATIONS_CATALOG } from '../data/shipments';

interface SearchFiltersProps {
  filters: SearchFilterState;
  onApplyFilters: (newFilters: SearchFilterState) => void;
  onReset: () => void;
  availableCarriers: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onApplyFilters,
  onReset,
  availableCarriers,
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

  const handleQuickPreset = (from: string, to: string) => {
    const updated: SearchFilterState = {
      ...localFilters,
      fromLocation: from,
      toLocation: to,
    };
    setLocalFilters(updated);
    onApplyFilters(updated);
  };

  const hasActiveFilters =
    localFilters.fromLocation !== 'ALL' ||
    localFilters.toLocation !== 'ALL' ||
    localFilters.mode !== 'ALL' ||
    localFilters.status !== 'ALL' ||
    localFilters.carrier !== 'ALL' ||
    localFilters.keyword.trim() !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-4 sm:p-5 space-y-4">
      {/* Route Search Primary Section */}
      <form onSubmit={handleSearchSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin (From) */}
          <div className="md:col-span-4">
            <label
              htmlFor="from-location"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Origin (From)
              </span>
            </label>
            <div className="relative">
              <select
                id="from-location"
                value={localFilters.fromLocation}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, fromLocation: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Origins (Any Location)</option>
                {LOCATIONS_CATALOG.map((loc) => (
                  <option key={`from-${loc.code}`} value={loc.city}>
                    {loc.city} ({loc.code}) — {loc.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button (between From & To) */}
          <div className="md:col-span-1 flex justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwapLocations}
              title="Swap Origin and Destination"
              aria-label="Swap Origin and Destination"
              className="p-2 border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination (To) */}
          <div className="md:col-span-4">
            <label
              htmlFor="to-location"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Destination (To)
              </span>
            </label>
            <div className="relative">
              <select
                id="to-location"
                value={localFilters.toLocation}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, toLocation: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Destinations (Any Location)</option>
                {LOCATIONS_CATALOG.map((loc) => (
                  <option key={`to-${loc.code}`} value={loc.city}>
                    {loc.city} ({loc.code}) — {loc.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: Search & Reset */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-md shadow-xs transition-colors active:bg-blue-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={handleResetClick}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-sm py-2 px-3 rounded-md transition-colors active:bg-slate-200"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Test Route Scenarios (Per Requirements) */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Quick Scenarios:</span>
        <button
          type="button"
          onClick={() => handleQuickPreset('Mumbai', 'Jeddah')}
          className={`px-2.5 py-1 rounded text-xs transition-colors border ${
            localFilters.fromLocation === 'Mumbai' && localFilters.toLocation === 'Jeddah'
              ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          Mumbai → Jeddah (Route)
        </button>

        <button
          type="button"
          onClick={() => handleQuickPreset('Mumbai', 'ALL')}
          className={`px-2.5 py-1 rounded text-xs transition-colors border ${
            localFilters.fromLocation === 'Mumbai' && localFilters.toLocation === 'ALL'
              ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          From Mumbai Only
        </button>

        <button
          type="button"
          onClick={() => handleQuickPreset('ALL', 'Jeddah')}
          className={`px-2.5 py-1 rounded text-xs transition-colors border ${
            localFilters.fromLocation === 'ALL' && localFilters.toLocation === 'Jeddah'
              ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          To Jeddah Only
        </button>

        <button
          type="button"
          onClick={() => handleQuickPreset('Bangkok', 'London')}
          className={`px-2.5 py-1 rounded text-xs transition-colors border ${
            localFilters.fromLocation === 'Bangkok' && localFilters.toLocation === 'London'
              ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          Bangkok → London
        </button>

        <button
          type="button"
          onClick={() => handleQuickPreset('Tokyo', 'Jeddah')}
          className={`px-2.5 py-1 rounded text-xs transition-colors border ${
            localFilters.fromLocation === 'Tokyo' && localFilters.toLocation === 'Jeddah'
              ? 'bg-amber-50 text-amber-800 border-amber-300 font-medium'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
          title="Directly tests empty results handling requirement"
        >
          Tokyo → Jeddah (Empty test)
        </button>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="ml-auto inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 text-xs font-medium cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide More Filters' : 'More Filters'}</span>
          {(localFilters.mode !== 'ALL' ||
            localFilters.status !== 'ALL' ||
            localFilters.carrier !== 'ALL' ||
            localFilters.keyword !== '') && (
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          )}
        </button>
      </div>

      {/* Advanced Filter Strip (Mode, Status, Carrier, Keyword) */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/60 p-3 rounded-md">
          {/* Transport Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Transport Mode
            </label>
            <div className="flex rounded-md border border-slate-300 bg-white p-0.5">
              {(['ALL', 'Air', 'Sea'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => {
                    const updated = { ...localFilters, mode: m };
                    setLocalFilters(updated);
                    onApplyFilters(updated);
                  }}
                  className={`flex-1 py-1 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                    localFilters.mode === m
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'Air' && <Plane className="w-3 h-3" />}
                  {m === 'Sea' && <Ship className="w-3 h-3" />}
                  {m === 'ALL' ? 'All Modes' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
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

          {/* Carrier Filter */}
          <div>
            <label htmlFor="carrier-filter" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Carrier
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
              <option value="ALL">All Carriers ({availableCarriers.length})</option>
              {availableCarriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label htmlFor="keyword-search" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Keyword / ID / AWB / Cargo
            </label>
            <div className="relative">
              <input
                id="keyword-search"
                type="text"
                placeholder="e.g. SHP-10101, AWB, micro..."
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
