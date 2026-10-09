import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';
import { SearchFilterState } from '../types/shipment';

interface EmptyStateProps {
  filters: SearchFilterState;
  onReset: () => void;
  onSelectRoute: (from: string, to: string) => void;
  onGenerateForRoute?: (from: string, to: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filters,
  onReset,
  onSelectRoute,
  onGenerateForRoute,
}) => {
  const hasFrom = filters.fromLocation && filters.fromLocation !== 'ALL' && filters.fromLocation.trim() !== '';
  const hasTo = filters.toLocation && filters.toLocation !== 'ALL' && filters.toLocation.trim() !== '';
  const isSpecificRoute = hasFrom || hasTo;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xs">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">
        No matching shipments found
      </h3>

      <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
        {isSpecificRoute ? (
          <span>
            No scheduled or active shipments currently found between{' '}
            <strong className="text-slate-800">
              {hasFrom ? filters.fromLocation : 'Any Origin'}
            </strong>{' '}
            and{' '}
            <strong className="text-slate-800">
              {hasTo ? filters.toLocation : 'Any Destination'}
            </strong>{' '}
            under the selected criteria.
          </span>
        ) : (
          <span>No shipments match the selected status, mode, or keyword filters.</span>
        )}
      </p>

      {/* Dynamic Route Generator Button for Any Unlimited Location */}
      {hasFrom && hasTo && onGenerateForRoute && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50/80 border border-blue-200 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Generate Dummy Data for {filters.fromLocation} → {filters.toLocation}
            </h4>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Instantly create authentic air and ocean shipments for this specific route.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGenerateForRoute(filters.fromLocation, filters.toLocation)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Generate Records
          </button>
        </div>
      )}

      {/* Suggested Routes */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 mb-6 text-left">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Or try these active global routes:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectRoute('Mumbai', 'Jeddah')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Mumbai → Jeddah</span>
            <span className="text-[10px] font-mono text-slate-400">Asia / Middle East</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectRoute('Bangkok', 'London')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Bangkok → London</span>
            <span className="text-[10px] font-mono text-slate-400">Asia / Europe</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectRoute('Frankfurt', 'Dubai')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Frankfurt → Dubai</span>
            <span className="text-[10px] font-mono text-slate-400">Europe / Middle East</span>
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset All Search Filters</span>
      </button>
    </div>
  );
};
