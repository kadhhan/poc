import React, { useState } from 'react';
import {
  Plane,
  Ship,
  Globe,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ChevronRight,
  Anchor,
  Box,
  Layers,
  Calendar,
  Info,
} from 'lucide-react';
import { Shipment, TransportMode } from '../types/shipment';
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
  activeMode?: string; // 'ALL' | 'Air' | 'Sea'
  onModeChange?: (mode: 'ALL' | 'Air' | 'Sea') => void;
  totalAllCount?: number;
  totalAirCount?: number;
  totalSeaCount?: number;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onSelectShipment,
  activeMode = 'ALL',
  onModeChange,
  totalAllCount,
  totalAirCount,
  totalSeaCount,
}) => {
  const [sortField, setSortField] = useState<SortField>('etd');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Reset page when shipments list changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [shipments.length]);

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

  const totalPages = Math.max(1, Math.ceil(sortedShipments.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedShipments = sortedShipments.slice(startIndex, startIndex + pageSize);

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

  const isAirView = activeMode === 'Air';
  const isSeaView = activeMode === 'Sea';

  return (
    <div
      className={`bg-white border rounded-xl shadow-2xs overflow-hidden transition-all duration-300 ${
        isAirView
          ? 'border-sky-200'
          : isSeaView
          ? 'border-teal-200'
          : 'border-slate-200'
      }`}
    >
      {/* 1. TABLE HEADER WITH SEPARATE AIR / SEA SWITCHER & STATS */}
      <div
        className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          isAirView
            ? 'bg-sky-50/70 border-sky-200 text-sky-950'
            : isSeaView
            ? 'bg-teal-50/70 border-teal-200 text-teal-950'
            : 'bg-slate-50/80 border-slate-200 text-slate-900'
        }`}
      >
        {/* Left: View Mode Indicator & Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs ${
              isAirView
                ? 'bg-sky-600'
                : isSeaView
                ? 'bg-teal-700'
                : 'bg-slate-800'
            }`}
          >
            {isAirView ? (
              <Plane className="w-5 h-5" />
            ) : isSeaView ? (
              <Ship className="w-5 h-5" />
            ) : (
              <Globe className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">
                {isAirView
                  ? 'Air Freight Shipments'
                  : isSeaView
                  ? 'Ocean Freight Shipments'
                  : 'All Cargo Shipments (Multi-Modal)'}
              </h2>
              <span
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                  isAirView
                    ? 'bg-sky-200/70 text-sky-900'
                    : isSeaView
                    ? 'bg-teal-200/70 text-teal-900'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {shipments.length} matching
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isAirView
                ? 'Displaying air cargo flights, airport routing & airway bills (AWB)'
                : isSeaView
                ? 'Displaying ocean container vessels, seaport berths & bills of lading (B/L)'
                : 'Showing combined air cargo and sea freight trade lane records'}
            </p>
          </div>
        </div>

        {/* Right: Quick Category Switcher Tabs (Directly on Table Header) */}
        {onModeChange && (
          <div className="flex items-center gap-1 p-0.5 bg-white/80 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => onModeChange('ALL')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeMode === 'ALL'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>All</span>
              {totalAllCount !== undefined && (
                <span className="text-[10px] font-mono opacity-80">({totalAllCount})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onModeChange('Air')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeMode === 'Air'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              <Plane className="w-3 h-3" />
              <span>Air Only</span>
              {totalAirCount !== undefined && (
                <span className="text-[10px] font-mono opacity-80">({totalAirCount})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onModeChange('Sea')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeMode === 'Sea'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-800'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Sea Only</span>
              {totalSeaCount !== undefined && (
                <span className="text-[10px] font-mono opacity-80">({totalSeaCount})</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 2. DESKTOP TAILORED TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead
            className={`border-b font-semibold uppercase tracking-wider select-none text-[11px] ${
              isAirView
                ? 'bg-sky-100/60 text-sky-900 border-sky-200'
                : isSeaView
                ? 'bg-teal-100/60 text-teal-900 border-teal-200'
                : 'bg-slate-100/75 text-slate-700 border-slate-200'
            }`}
          >
            <tr>
              {/* ID & Reference */}
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>
                  {isAirView ? 'Air Waybill (AWB) / ID' : isSeaView ? 'Ocean B/L / ID' : 'Shipment ID'}
                </span>
                {renderSortIcon('id')}
              </th>

              {/* Origin */}
              <th
                onClick={() => handleSort('origin')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>{isAirView ? 'Origin Airport' : isSeaView ? 'Origin Seaport' : 'Origin'}</span>
                {renderSortIcon('origin')}
              </th>

              {/* Destination */}
              <th
                onClick={() => handleSort('destination')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>
                  {isAirView ? 'Destination Airport' : isSeaView ? 'Destination Seaport' : 'Destination'}
                </span>
                {renderSortIcon('destination')}
              </th>

              {/* Carrier */}
              <th
                onClick={() => handleSort('carrier')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>
                  {isAirView ? 'Airline & Flight' : isSeaView ? 'Shipping Line & Vessel' : 'Carrier'}
                </span>
                {renderSortIcon('carrier')}
              </th>

              {/* Mode (Only shown if viewing All) */}
              {!isAirView && !isSeaView && (
                <th
                  onClick={() => handleSort('mode')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-center"
                >
                  <span>Mode</span>
                  {renderSortIcon('mode')}
                </th>
              )}

              {/* Air/Sea specific equipment column */}
              {isAirView && <th className="py-3 px-3">Air Cargo Service</th>}
              {isSeaView && <th className="py-3 px-3">Container Equipment</th>}

              {/* ETD */}
              <th
                onClick={() => handleSort('etd')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>{isAirView ? 'Flight ETD' : isSeaView ? 'Sailing ETD' : 'ETD'}</span>
                {renderSortIcon('etd')}
              </th>

              {/* ETA */}
              <th
                onClick={() => handleSort('eta')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>{isAirView ? 'Flight ETA' : isSeaView ? 'Berthing ETA' : 'ETA'}</span>
                {renderSortIcon('eta')}
              </th>

              {/* Pieces */}
              <th
                onClick={() => handleSort('pieces')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/50 transition-colors text-right"
              >
                <span>Pieces</span>
                {renderSortIcon('pieces')}
              </th>

              {/* Weight */}
              <th
                onClick={() => handleSort('grossWeightKg')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors text-right"
              >
                <span>Weight (kg)</span>
                {renderSortIcon('grossWeightKg')}
              </th>

              {/* Status */}
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50 transition-colors"
              >
                <span>Status</span>
                {renderSortIcon('status')}
              </th>

              {/* Action */}
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70">
            {paginatedShipments.map((s) => {
              const statusStyle = getStatusStyle(s.status);
              const isAirRow = s.mode === 'Air';

              return (
                <tr
                  key={s.id}
                  onClick={() => onSelectShipment(s)}
                  className={`cursor-pointer transition-colors group ${
                    isAirRow
                      ? 'hover:bg-sky-50/50'
                      : 'hover:bg-teal-50/50'
                  }`}
                >
                  {/* Shipment ID & Reference */}
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      {isAirRow ? (
                        <Plane className="w-3 h-3 text-sky-600 inline" />
                      ) : (
                        <Ship className="w-3 h-3 text-teal-700 inline" />
                      )}
                      <span>{s.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {s.referenceType}: <span className="font-mono font-medium">{s.referenceNumber}</span>
                    </div>
                  </td>

                  {/* Origin */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{s.origin.city}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {isAirRow ? s.origin.airportCode || s.origin.code : s.origin.seaportCode || s.origin.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[190px]" title={isAirRow ? s.origin.airportName : s.origin.seaportName}>
                      {isAirRow ? s.origin.airportName || s.origin.country : s.origin.seaportName || s.origin.country}
                    </div>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{s.destination.city}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {isAirRow ? s.destination.airportCode || s.destination.code : s.destination.seaportCode || s.destination.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[190px]" title={isAirRow ? s.destination.airportName : s.destination.seaportName}>
                      {isAirRow ? s.destination.airportName || s.destination.country : s.destination.seaportName || s.destination.country}
                    </div>
                  </td>

                  {/* Carrier & Flight/Vessel Details */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{s.carrier || 'Not available'}</span>
                      {s.carrierCode && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {s.carrierCode}
                        </span>
                      )}
                    </div>
                    {isAirRow ? (
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <span className="text-sky-700 font-semibold">{s.flightNumber ? `Flight ${s.flightNumber}` : s.vesselOrFlight || 'Not available'}</span>
                        {s.aircraftType && <span className="text-slate-400">({s.aircraftType})</span>}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 font-mono">
                        <span className="text-teal-800 font-medium">{s.vesselName || s.vesselOrFlight || 'Not available'}</span>
                        {s.voyageNumber && <span className="text-slate-500 ml-1">· Voy {s.voyageNumber}</span>}
                      </div>
                    )}
                  </td>

                  {/* Mode column (only in ALL view) */}
                  {!isAirView && !isSeaView && (
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          isAirRow
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {isAirRow ? <Plane className="w-3 h-3" /> : <Ship className="w-3 h-3" />}
                        {s.mode}
                      </span>
                    </td>
                  )}

                  {/* Specific Equipment Columns */}
                  {isAirView && (
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{s.serviceLevel}</div>
                      <div className="text-[10px] text-slate-400">{s.containerOrPackageType}</div>
                    </td>
                  )}
                  {isSeaView && (
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px]">
                      <div className="text-slate-800 font-medium">{s.containerOrPackageType}</div>
                      <div className="text-[10px] text-slate-400">{s.serviceLevel}</div>
                    </td>
                  )}

                  {/* ETD */}
                  <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    <div>{s.etd.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400">{s.etd.split(' ')[1]}</div>
                  </td>

                  {/* ETA */}
                  <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{s.eta.split(' ')[0]}</div>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. MOBILE CARD LIST VIEW (< md screens) */}
      <div className="md:hidden divide-y divide-slate-200">
        {paginatedShipments.map((s) => {
          const statusStyle = getStatusStyle(s.status);
          const isAirRow = s.mode === 'Air';

          return (
            <div
              key={s.id}
              onClick={() => onSelectShipment(s)}
              className={`p-4 transition-colors cursor-pointer space-y-3 ${
                isAirRow ? 'hover:bg-sky-50/40' : 'hover:bg-teal-50/40'
              }`}
            >
              {/* Header: ID, Reference, Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {s.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      isAirRow ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {isAirRow ? <Plane className="w-2.5 h-2.5" /> : <Ship className="w-2.5 h-2.5" />}
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
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 text-xs border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900">{s.origin.city}</span>
                  <span className="font-mono text-slate-500 text-[11px] ml-1">
                    ({isAirRow ? s.origin.airportCode || s.origin.code : s.origin.seaportCode || s.origin.code})
                  </span>
                  <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {isAirRow ? s.origin.airportName : s.origin.seaportName}
                  </div>
                </div>
                <div className="text-slate-400 text-xs px-2">→</div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{s.destination.city}</span>
                  <span className="font-mono text-slate-500 text-[11px] ml-1">
                    ({isAirRow ? s.destination.airportCode || s.destination.code : s.destination.seaportCode || s.destination.code})
                  </span>
                  <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {isAirRow ? s.destination.airportName : s.destination.seaportName}
                  </div>
                </div>
              </div>

              {/* Carrier & Flight/Vessel Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/50 p-2 rounded">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {isAirRow ? 'Airline & Flight Number:' : 'Shipping Line & Vessel:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900 truncate">
                      {s.carrier || 'Not available'}
                    </span>
                    {s.carrierCode && (
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 text-slate-700">
                        {s.carrierCode}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-600 truncate block">
                    {isAirRow
                      ? s.flightNumber ? `Flight ${s.flightNumber}` : s.vesselOrFlight || 'Not available'
                      : s.vesselName ? `${s.vesselName} (Voy ${s.voyageNumber || 'N/A'})` : s.vesselOrFlight || 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gross Weight:</span>
                  <span className="font-mono font-medium text-slate-800 block">
                    {s.grossWeightKg.toLocaleString()} kg
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {s.pieces} packages
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {isAirRow ? 'Departure (ETD):' : 'Sailing (ETD):'}
                  </span>
                  <span className="font-mono text-slate-700">{s.etd}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {isAirRow ? 'Arrival (ETA):' : 'Berthing (ETA):'}
                  </span>
                  <span className="font-mono text-slate-900 font-semibold">{s.eta}</span>
                </div>
              </div>

              {/* Footer Details Link */}
              <div className="pt-1 flex items-center justify-between text-xs">
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
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PAGINATION & ROWS PER PAGE */}
      {shipments.length > 0 && (
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/75 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="font-mono text-slate-900">{startIndex + 1}</strong> to{' '}
              <strong className="font-mono text-slate-900">
                {Math.min(startIndex + pageSize, shipments.length)}
              </strong>{' '}
              of <strong className="font-mono text-slate-900">{shipments.length}</strong> {isAirView ? 'air' : isSeaView ? 'sea' : ''} shipments
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-slate-400 text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
              >
                Previous
              </button>

              <span className="px-2 text-xs font-mono text-slate-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
