import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, ChevronDown, Check } from 'lucide-react';
import { LOCATIONS_CATALOG, INITIAL_SHIPMENTS } from '../data/shipments';
import { LocationInfo } from '../types/shipment';

interface LocationSearchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  iconColor?: string;
  type: 'origin' | 'destination';
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type city, port, or code...',
  iconColor = 'text-blue-600',
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  // Filter locations from catalog based on typed value
  const query = value === 'ALL' ? '' : value.trim().toLowerCase();

  const matchingLocations = LOCATIONS_CATALOG.filter((loc) => {
    if (!query) return true;
    return (
      loc.city.toLowerCase().includes(query) ||
      loc.code.toLowerCase().includes(query) ||
      loc.country.toLowerCase().includes(query)
    );
  });

  // Calculate shipment counts for each location
  const getShipmentCount = (loc: LocationInfo) => {
    return INITIAL_SHIPMENTS.filter((s) => {
      if (type === 'origin') {
        return s.origin.city.toLowerCase() === loc.city.toLowerCase();
      } else {
        return s.destination.city.toLowerCase() === loc.city.toLowerCase();
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
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
      >
        <span className="flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${iconColor}`} />
          {label}
        </span>
      </label>

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
            title="Toggle suggestions list"
            aria-label="Toggle suggestions list"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-xl max-h-60 overflow-y-auto text-xs py-1 animate-in fade-in">
          {/* Quick Option: Any Location */}
          <button
            type="button"
            onClick={() => handleSelectLocation('ALL')}
            className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
              value === 'ALL' || value === '' ? 'bg-blue-50/70 text-blue-700 font-medium' : 'text-slate-700'
            }`}
          >
            <div>
              <span className="font-semibold">All Locations</span>
              <span className="text-[11px] text-slate-400 ml-1.5">(No filter)</span>
            </div>
            {(value === 'ALL' || value === '') && <Check className="w-3.5 h-3.5 text-blue-600" />}
          </button>

          <div className="border-t border-slate-100 my-1"></div>

          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {query ? 'Matching Places' : 'Known Locations & Hubs'}
          </div>

          {matchingLocations.length > 0 ? (
            matchingLocations.map((loc) => {
              const count = getShipmentCount(loc);
              const isSelected = value.toLowerCase() === loc.city.toLowerCase() || value.toUpperCase() === loc.code;
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
                    <span className="font-medium text-slate-900">{loc.city}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      ({loc.code})
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[90px]">
                      {loc.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {count} {count === 1 ? 'shp' : 'shps'}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-slate-500 italic">
              No preset catalog match for &ldquo;{displayValue}&rdquo;. Press <strong>Search</strong> to search manually by this name.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
