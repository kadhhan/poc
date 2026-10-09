import React from 'react';
import { Package, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onExportCSV: () => void;
  shipmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onExportCSV, shipmentCount }) => {
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
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  POC Demo
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
              onClick={onExportCSV}
              disabled={shipmentCount === 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                shipmentCount === 0
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
              }`}
              title="Export current filtered results to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              title="View Architecture Guide & Add Records Instructions"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">POC Documentation</span>
              <span className="sm:hidden">Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
