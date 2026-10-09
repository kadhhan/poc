import React from 'react';
import { Package, Truck, Navigation, CheckCircle2, Weight, Box } from 'lucide-react';
import { ShipmentSummary } from '../utils/shipmentUtils';

interface SummaryCardsProps {
  summary: ShipmentSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="space-y-3">
      {/* 4 Required Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Shipments */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Shipments
            </span>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {summary.totalShipments}
            </span>
            <span className="text-xs text-slate-500 font-normal">records</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Matching active filters</span>
            <span className="font-mono text-slate-600">{summary.totalPieces.toLocaleString()} pcs</span>
          </div>
        </div>

        {/* Unique Carriers */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Unique Carriers
            </span>
            <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {summary.uniqueCarriers}
            </span>
            <span className="text-xs text-slate-500 font-normal">carriers</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Airlines & Ocean lines</span>
            <span className="font-medium text-slate-700">Active</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-700">
              In Transit
            </span>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
              <Navigation className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 tracking-tight">
              {summary.inTransit}
            </span>
            <span className="text-xs text-slate-500 font-normal">active</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>En route / Airborne / Sailing</span>
            <span className="text-blue-600 font-mono font-medium">
              {summary.totalShipments > 0 ? Math.round((summary.inTransit / summary.totalShipments) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700">
              Delivered
            </span>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 tracking-tight">
              {summary.delivered}
            </span>
            <span className="text-xs text-slate-500 font-normal">completed</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Proof of delivery signed</span>
            <span className="text-emerald-600 font-mono font-medium">
              {summary.totalShipments > 0 ? Math.round((summary.delivered / summary.totalShipments) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Auxiliary Cargo Metrics Bar */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-slate-500" />
            <span>Total Gross Weight:</span>
            <span className="font-semibold font-mono text-slate-900">
              {(summary.totalWeightKg / 1000).toFixed(1)} tons
            </span>
            <span className="text-slate-400">({summary.totalWeightKg.toLocaleString()} kg)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-slate-500" />
            <span>Total Packages:</span>
            <span className="font-semibold font-mono text-slate-900">
              {summary.totalPieces.toLocaleString()} pieces
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Booked: <strong className="text-slate-700 font-mono">{summary.booked}</strong></span>
          <span>·</span>
          <span>In Transit: <strong className="text-blue-700 font-mono">{summary.inTransit}</strong></span>
          <span>·</span>
          <span>Arrived: <strong className="text-purple-700 font-mono">{summary.arrived}</strong></span>
          <span>·</span>
          <span>Delivered: <strong className="text-emerald-700 font-mono">{summary.delivered}</strong></span>
        </div>
      </div>
    </div>
  );
};
