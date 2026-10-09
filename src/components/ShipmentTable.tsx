import React, { useState } from 'react';
import {
  Plane,
  Ship,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
  Weight,
  Box,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/shipment';
import { getStatusStyle, formatWeight } from '../utils/shipmentUtils';

type SortField =
  | 'id'
  | 'origin'
  | 'destination'
  | 'carrier'
  | 'mode'
  | 'etd'
  | 'eta'
  | 'pieces'
  | 'grossWeightKg'
  | 'status';

interface ShipmentTableProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onSelectShipment,
}) => {
  const [sortField, setSortField] = useState<SortField>('etd');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedShipments = [...shipments].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case 'id':
        aVal = a.id;
        bVal = b.id;
        break;
      case 'origin':
        aVal = a.origin.city;
        bVal = b.origin.city;
        break;
      case 'destination':
        aVal = a.destination.city;
        bVal = b.destination.city;
        break;
      case 'carrier':
        aVal = a.carrier;
        bVal = b.carrier;
        break;
      case 'mode':
        aVal = a.mode;
        bVal = b.mode;
        break;
      case 'etd':
        aVal = a.etd;
        bVal = b.etd;
        break;
      case 'eta':
        aVal = a.eta;
        bVal = b.eta;
        break;
      case 'pieces':
        aVal = a.pieces;
        bVal = b.pieces;
        break;
      case 'grossWeightKg':
        aVal = a.grossWeightKg;
        bVal = b.grossWeightKg;
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      default:
        aVal = a.id;
        bVal = b.id;
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 inline ml-1" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-blue-600 inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 inline ml-1" />
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      {/* Table Header Controls / Info */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Shipment Records
          </span>
          <span className="text-xs font-mono font-medium bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
            {shipments.length} matching
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Click column headers to sort · Click row or &ldquo;View Details&rdquo; for full AWB/BL
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider select-none text-[11px]">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Shipment ID</span>
                {renderSortIcon('id')}
              </th>
              <th
                onClick={() => handleSort('origin')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Origin</span>
                {renderSortIcon('origin')}
              </th>
              <th
                onClick={() => handleSort('destination')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Destination</span>
                {renderSortIcon('destination')}
              </th>
              <th
                onClick={() => handleSort('carrier')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Carrier</span>
                {renderSortIcon('carrier')}
              </th>
              <th
                onClick={() => handleSort('mode')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
              >
                <span>Mode</span>
                {renderSortIcon('mode')}
              </th>
              <th
                onClick={() => handleSort('etd')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>ETD</span>
                {renderSortIcon('etd')}
              </th>
              <th
                onClick={() => handleSort('eta')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>ETA</span>
                {renderSortIcon('eta')}
              </th>
              <th
                onClick={() => handleSort('pieces')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-right"
              >
                <span>Pieces</span>
                {renderSortIcon('pieces')}
              </th>
              <th
                onClick={() => handleSort('grossWeightKg')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors text-right"
              >
                <span>Gross Wt (kg)</span>
                {renderSortIcon('grossWeightKg')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Status</span>
                {renderSortIcon('status')}
              </th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {sortedShipments.map((s) => {
              const statusStyle = getStatusStyle(s.status);
              return (
                <tr
                  key={s.id}
                  onClick={() => onSelectShipment(s)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  {/* Shipment ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <span className="group-hover:text-blue-600 transition-colors">
                      {s.id}
                    </span>
                  </td>

                  {/* Origin */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{s.origin.city}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {s.origin.code} · {s.origin.country}
                    </div>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{s.destination.city}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {s.destination.code} · {s.destination.country}
                    </div>
                  </td>

                  {/* Carrier */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{s.carrier}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {s.referenceType}: {s.referenceNumber}
                    </div>
                  </td>

                  {/* Transport Mode */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center p-1.5 rounded-md ${
                        s.mode === 'Air'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}
                      title={`${s.mode} Transport`}
                    >
                      {s.mode === 'Air' ? (
                        <Plane className="w-3.5 h-3.5" />
                      ) : (
                        <Ship className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                      {s.mode}
                    </span>
                  </td>

                  {/* ETD */}
                  <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    <div>{s.etd.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400">{s.etd.split(' ')[1]}</div>
                  </td>

                  {/* ETA */}
                  <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{s.eta.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400">{s.eta.split(' ')[1]}</div>
                  </td>

                  {/* Pieces */}
                  <td className="py-3.5 px-3 font-mono font-medium text-slate-800 text-right whitespace-nowrap">
                    {s.pieces}
                  </td>

                  {/* Gross Weight */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 text-right whitespace-nowrap">
                    {s.grossWeightKg.toLocaleString()}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${statusStyle.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {s.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShipment(s);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< md screens) */}
      <div className="md:hidden divide-y divide-slate-200">
        {sortedShipments.map((s) => {
          const statusStyle = getStatusStyle(s.status);
          return (
            <div
              key={s.id}
              onClick={() => onSelectShipment(s)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
            >
              {/* Header: ID, Status, Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {s.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      s.mode === 'Air'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {s.mode === 'Air' ? (
                      <Plane className="w-2.5 h-2.5" />
                    ) : (
                      <Ship className="w-2.5 h-2.5" />
                    )}
                    {s.mode}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${statusStyle.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {s.status}
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between bg-slate-50 rounded-md p-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{s.origin.city}</span>
                  <span className="font-mono text-slate-500 text-[11px] ml-1">
                    ({s.origin.code})
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">→</div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{s.destination.city}</span>
                  <span className="font-mono text-slate-500 text-[11px] ml-1">
                    ({s.destination.code})
                  </span>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Carrier:</span>
                  <span className="font-medium text-slate-800 truncate block">
                    {s.carrier}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gross Weight:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {s.grossWeightKg.toLocaleString()} kg ({s.pieces} pcs)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ETD:</span>
                  <span className="font-mono text-slate-700">{s.etd}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ETA:</span>
                  <span className="font-mono text-slate-900 font-semibold">{s.eta}</span>
                </div>
              </div>

              {/* Footer View Details button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {s.referenceType}: {s.referenceNumber}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShipment(s);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
