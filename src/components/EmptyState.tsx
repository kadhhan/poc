import React from 'react';
import { SearchX, RotateCcw, MapPin, ArrowRight } from 'lucide-react';
import { SearchFilterState } from '../types/shipment';

interface EmptyStateProps {
  filters: SearchFilterState;
  onReset: () => void;
  onSelectRoute: (from: string, to: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filters, onReset, onSelectRoute }) => {
  const isSpecificRoute =
    filters.fromLocation !== 'ALL' || filters.toLocation !== 'ALL';

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
              {filters.fromLocation === 'ALL' ? 'Any Origin' : filters.fromLocation}
            </strong>{' '}
            and{' '}
            <strong className="text-slate-800">
              {filters.toLocation === 'ALL' ? 'Any Destination' : filters.toLocation}
            </strong>{' '}
            under the selected criteria.
          </span>
        ) : (
          <span>No shipments match the selected status, mode, or keyword filters.</span>
        )}
      </p>

      {/* Suggested Routes */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 mb-6 text-left">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Try these available sample routes:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectRoute('Mumbai', 'Jeddah')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Mumbai → Jeddah</span>
            <span className="text-[10px] font-mono text-slate-400">3 shipments</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectRoute('Bangkok', 'London')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Bangkok → London</span>
            <span className="text-[10px] font-mono text-slate-400">3 shipments</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectRoute('Frankfurt', 'Dubai')}
            className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <span>Frankfurt → Dubai</span>
            <span className="text-[10px] font-mono text-slate-400">2 shipments</span>
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset All Search Filters</span>
      </button>
    </div>
  );
};
