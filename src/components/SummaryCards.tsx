import React from 'react';
import { Package, Truck, Navigation, CheckCircle2, Weight, Box, Plane, Ship, Anchor } from 'lucide-react';
import { ShipmentSummary } from '../utils/shipmentUtils';

interface SummaryCardsProps {
  summary: ShipmentSummary;
  mode?: string; // 'ALL' | 'Air' | 'Sea'
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, mode = 'ALL' }) => {
  const isAir = mode === 'Air';
  const isSea = mode === 'Sea';

  return (
    <div className="space-y-3">
      {/* 4 Required Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Shipments */}
        <div
          className={`bg-white border rounded-xl p-4 shadow-2xs transition-colors ${
            isAir
              ? 'border-sky-200 hover:border-sky-300'
              : isSea
              ? 'border-teal-200 hover:border-teal-300'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isAir ? 'text-sky-700' : isSea ? 'text-teal-800' : 'text-slate-600'
              }`}
            >
              {isAir ? 'Air Shipments' : isSea ? 'Sea Shipments' : 'Total Shipments'}
            </span>
            <div
              className={`p-2 rounded-lg ${
                isAir
                  ? 'bg-sky-100 text-sky-700'
                  : isSea
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {isAir ? (
                <Plane className="w-4 h-4" />
              ) : isSea ? (
                <Ship className="w-4 h-4" />
              ) : (
                <Package className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${
                isAir ? 'text-sky-950' : isSea ? 'text-teal-950' : 'text-slate-900'
              }`}
            >
              {summary.totalShipments}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              {isAir ? 'air flights' : isSea ? 'sea sailings' : 'records'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Matching active filters</span>
            <span className="font-mono text-slate-700 font-medium">
              {summary.totalPieces.toLocaleString()} pcs
            </span>
          </div>
        </div>

        {/* Unique Carriers */}
        <div
          className={`bg-white border rounded-xl p-4 shadow-2xs transition-colors ${
            isAir
              ? 'border-sky-200 hover:border-sky-300'
              : isSea
              ? 'border-teal-200 hover:border-teal-300'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {isAir ? 'Airlines' : isSea ? 'Shipping Lines' : 'Unique Carriers'}
            </span>
            <div
              className={`p-2 rounded-lg ${
                isAir
                  ? 'bg-sky-100 text-sky-700'
                  : isSea
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {isAir ? (
                <Plane className="w-4 h-4" />
              ) : isSea ? (
                <Anchor className="w-4 h-4" />
              ) : (
                <Truck className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {summary.uniqueCarriers}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              {isAir ? 'airlines' : isSea ? 'ocean lines' : 'carriers'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {isAir
                ? 'Scheduled Air Fleets'
                : isSea
                ? 'Ocean Container Lines'
                : 'Airlines & Ocean lines'}
            </span>
            <span className="font-medium text-slate-700">Active</span>
          </div>
        </div>

        {/* In Transit */}
        <div
          className={`bg-white border rounded-xl p-4 shadow-2xs transition-colors ${
            isAir
              ? 'border-sky-200 hover:border-sky-300'
              : isSea
              ? 'border-teal-200 hover:border-teal-300'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              {isAir ? 'Airborne / Transit' : isSea ? 'Sailing / Transit' : 'In Transit'}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
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
            <span>{isAir ? 'Flight en route' : isSea ? 'Vessel en route' : 'En route / Sailing'}</span>
            <span className="text-blue-600 font-mono font-medium">
              {summary.totalShipments > 0
                ? Math.round((summary.inTransit / summary.totalShipments) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Delivered */}
        <div
          className={`bg-white border rounded-xl p-4 shadow-2xs transition-colors ${
            isAir
              ? 'border-sky-200 hover:border-sky-300'
              : isSea
              ? 'border-teal-200 hover:border-teal-300'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Delivered
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
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
              {summary.totalShipments > 0
                ? Math.round((summary.delivered / summary.totalShipments) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Auxiliary Cargo Metrics Bar */}
      <div
        className={`border rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600 ${
          isAir
            ? 'bg-sky-50/60 border-sky-200/80'
            : isSea
            ? 'bg-teal-50/60 border-teal-200/80'
            : 'bg-slate-50 border-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAir ? 'Air Cargo Gross Weight:' : isSea ? 'Ocean Cargo Weight:' : 'Total Gross Weight:'}</span>
            <span className="font-semibold font-mono text-slate-900">
              {(summary.totalWeightKg / 1000).toFixed(1)} tons
            </span>
            <span className="text-slate-400">({summary.totalWeightKg.toLocaleString()} kg)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAir ? 'Air Pallets & Cartons:' : isSea ? 'Total Containers & Packages:' : 'Total Packages:'}</span>
            <span className="font-semibold font-mono text-slate-900">
              {summary.totalPieces.toLocaleString()} pieces
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>
            Booked: <strong className="text-slate-700 font-mono">{summary.booked}</strong>
          </span>
          <span>·</span>
          <span>
            In Transit: <strong className="text-blue-700 font-mono">{summary.inTransit}</strong>
          </span>
          <span>·</span>
          <span>
            Arrived: <strong className="text-purple-700 font-mono">{summary.arrived}</strong>
          </span>
          <span>·</span>
          <span>
            Delivered: <strong className="text-emerald-700 font-mono">{summary.delivered}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
