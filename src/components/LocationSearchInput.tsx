import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, ChevronDown, Check, Globe } from 'lucide-react';
import { WORLD_LOCATIONS, REGIONS_LIST } from '../data/globalLocations';
import { Shipment } from '../types/shipment';

interface LocationSearchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  shipments?: Shipment[];
  placeholder?: string;
  iconColor?: string;
  type: 'origin' | 'destination';
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  id,
  label,
  value,
  onChange,
  shipments = [],
  placeholder = 'Type country, city, or port code...',
  iconColor = 'text-blue-600',
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations from global catalog based on typed value and region tab
  const query = value === 'ALL' ? '' : value.trim().toLowerCase();

  const matchingLocations = WORLD_LOCATIONS.filter((loc) => {
    const matchesRegion =
      selectedRegion === 'All Regions' || loc.region === selectedRegion;
    if (!matchesRegion) return false;

    if (!query) return true;
    return (
      loc.city.toLowerCase().includes(query) ||
      loc.code.toLowerCase().includes(query) ||
      loc.country.toLowerCase().includes(query) ||
      loc.region.toLowerCase().includes(query)
    );
  });

  // Calculate shipment counts for each location dynamically
  const getShipmentCount = (city: string) => {
    return shipments.filter((s) => {
      if (type === 'origin') {
        return s.origin.city.toLowerCase() === city.toLowerCase();
      } else {
        return s.destination.city.toLowerCase() === city.toLowerCase();
      }
    }).length;
  };

  const handleSelectLocation = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const displayValue = value === 'ALL' ? '' : value;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          <span className="flex items-center gap-1.5">
            <MapPin className={`w-3.5 h-3.5 ${iconColor}`} />
            {label}
          </span>
        </label>
        <span className="text-[10px] text-slate-400">
          75+ countries & ports
        </span>
      </div>

      <div className="relative">
        <input
          id={id}
          type="text"
          value={displayValue}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 pl-3 pr-16 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {displayValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 transition-colors"
              title="Clear input"
              aria-label={`Clear ${label}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            title="Browse worldwide locations"
            aria-label="Browse worldwide locations"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Suggestion & Catalog Dropdown */}
      {isOpen && (
        <div className="absolute z-30 mt-1 w-full sm:w-[420px] bg-white rounded-lg border border-slate-200 shadow-2xl max-h-80 overflow-hidden flex flex-col text-xs animate-in fade-in">
          {/* Quick Option: Any Location */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleSelectLocation('ALL')}
              className={`px-3 py-1.5 rounded text-left flex items-center gap-2 hover:bg-slate-200/60 transition-colors text-xs ${
                value === 'ALL' || value === '' ? 'bg-blue-600 text-white font-medium' : 'text-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Locations (Any Worldwide)</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              {WORLD_LOCATIONS.length} hubs
            </span>
          </div>

          {/* Region Tabs for rapid discovery */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto text-[11px] py-1 px-2 gap-1 scrollbar-none">
            {REGIONS_LIST.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Locations Scroll List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 py-1">
            {matchingLocations.length > 0 ? (
              matchingLocations.map((loc) => {
                const count = getShipmentCount(loc.city);
                const isSelected =
                  value.toLowerCase() === loc.city.toLowerCase() ||
                  value.toUpperCase() === loc.code;

                return (
                  <button
                    key={`${type}-${loc.code}`}
                    type="button"
                    onClick={() => handleSelectLocation(loc.city)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/70 text-blue-700 font-medium' : 'text-slate-800'
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-slate-900">{loc.city}</span>
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                        {loc.code}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {loc.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {count > 0 ? (
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-medium px-1.5 py-0.5 rounded border border-blue-200/60">
                          {count} {count === 1 ? 'shipment' : 'shipments'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 px-1 py-0.5">
                          0
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs">
                <p>No catalog match for &ldquo;{displayValue}&rdquo; in {selectedRegion}.</p>
                <p className="mt-1 text-slate-400">
                  You can still press <strong>Search</strong> to search or generate dummy shipments for this custom location.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
