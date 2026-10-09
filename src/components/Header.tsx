import React from 'react';
import { Package, HelpCircle, FileSpreadsheet, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onExportCSV: () => void;
  onGenerateMore: () => void;
  shipmentCount: number;
  totalCatalogCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onExportCSV,
  onGenerateMore,
  shipmentCount,
  totalCatalogCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Shipment Explorer
                </h1>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                  Worldwide POC · {totalCatalogCount} records
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Search and track shipment records.
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onGenerateMore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
              title="Generate 20 additional realistic global dummy shipments"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">+20 Global Shipments</span>
              <span className="sm:hidden">+20 More</span>
            </button>

            <button
              onClick={onExportCSV}
              disabled={shipmentCount === 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                shipmentCount === 0
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 cursor-pointer'
              }`}
              title="Export current filtered results to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title="View Architecture Guide & Add Records Instructions"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
