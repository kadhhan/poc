import React, { useEffect } from 'react';
import {
  X,
  Plane,
  Ship,
  ArrowRight,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Circle,
  Copy,
  Check,
  Package,
  Layers,
  MapPin,
  FileText
} from 'lucide-react';
import { Shipment } from '../types/shipment';
import { getStatusStyle, formatWeight } from '../utils/shipmentUtils';

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!shipment) return null;

  const statusStyle = getStatusStyle(shipment.status);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(shipment.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden transform transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
              {shipment.mode === 'Air' ? (
                <Plane className="w-5 h-5" />
              ) : (
                <Ship className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold font-mono text-slate-900 tracking-tight">
                  {shipment.id}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border ${statusStyle.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {shipment.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {shipment.carrier} · {shipment.serviceLevel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Route Banner */}
          <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Origin
                </div>
                <div className="text-xl font-bold font-mono tracking-tight flex items-baseline gap-1.5">
                  <span>{shipment.origin.code}</span>
                  <span className="text-xs font-normal text-slate-300">
                    {shipment.origin.city}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {shipment.mode === 'Air'
                    ? shipment.origin.airportName || `${shipment.origin.city} Airport`
                    : shipment.origin.seaportName || `${shipment.origin.city} Port`}
                </div>
                <div className="text-[10px] text-slate-400">{shipment.origin.country}</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                  shipment.mode === 'Air' ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-teal-950 text-teal-400 border border-teal-800'
                }`}>
                  {shipment.mode === 'Air' ? '✈ Air Cargo' : '⚓ Ocean Freight'}
                </span>
                <div className="flex items-center text-blue-400 my-1">
                  <span className="w-10 sm:w-16 h-0.5 bg-blue-500/40 inline-block"></span>
                  <ArrowRight className="w-4 h-4 mx-1" />
                  <span className="w-10 sm:w-16 h-0.5 bg-blue-500/40 inline-block"></span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono">
                  {shipment.vesselOrFlight}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase text-right">
                  {shipment.mode === 'Air' ? 'Destination Airport' : 'Destination Seaport'}
                </div>
                <div className="text-xl font-bold font-mono tracking-tight flex items-baseline gap-1.5 justify-end">
                  <span className="text-xs font-normal text-slate-300">
                    {shipment.destination.city}
                  </span>
                  <span>{shipment.destination.code}</span>
                </div>
                <div className="text-[11px] text-slate-300 text-right">
                  {shipment.mode === 'Air'
                    ? shipment.destination.airportName || `${shipment.destination.city} Airport`
                    : shipment.destination.seaportName || `${shipment.destination.city} Port`}
                </div>
                <div className="text-[10px] text-slate-400 text-right">{shipment.destination.country}</div>
              </div>
            </div>

            <div className="sm:border-l sm:border-slate-800 sm:pl-4 text-xs space-y-1 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-800">
              <div className="flex justify-between sm:block gap-4">
                <span className="text-slate-400">ETD: </span>
                <span className="font-mono text-slate-200">{shipment.etd}</span>
              </div>
              <div className="flex justify-between sm:block gap-4">
                <span className="text-slate-400">ETA: </span>
                <span className="font-mono text-emerald-300 font-semibold">{shipment.eta}</span>
              </div>
            </div>
          </div>

          {/* Reference & Document Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center justify-between">
                <span>
                  {shipment.referenceType === 'AWB' ? 'Master Air Waybill (MAWB)' : 'Ocean Bill of Lading (B/L)'}
                </span>
                <button
                  onClick={handleCopyRef}
                  className="text-[11px] text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-normal cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-base font-bold font-mono text-slate-900 tracking-tight">
                {shipment.referenceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Voyage / Flight: <strong className="text-slate-700">{shipment.vesselOrFlight}</strong></span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium mb-1">
                Cargo Specifications
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Gross Weight:</span>
                  <div className="font-mono font-semibold text-slate-800">
                    {formatWeight(shipment.grossWeightKg)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Total Pieces:</span>
                  <div className="font-mono font-semibold text-slate-800">
                    {shipment.pieces} packages
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Volume:</span>
                  <div className="font-mono text-slate-800">
                    {shipment.volumeCbm ? `${shipment.volumeCbm} CBM` : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Equipment / ULD:</span>
                  <div className="font-mono text-slate-800 truncate" title={shipment.containerOrPackageType}>
                    {shipment.containerOrPackageType}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commodity & Parties */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Commodity / Cargo Description
              </div>
              <div className="text-sm font-medium text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200/80">
                {shipment.cargoDescription}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Shipper (Consignor)
                </span>
                <div className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200/60">
                  {shipment.consignor}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Consignee (Receiver)
                </span>
                <div className="text-xs text-slate-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-200/60">
                  {shipment.consignee}
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Milestone Timeline */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Shipment Milestones & Progress</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                real-time event checkpoints
              </span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {shipment.milestones.map((m, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className="absolute -left-6 mt-0.5">
                    {m.completed ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : m.isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 animate-pulse">
                        <Clock className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center ring-4 ring-white">
                        <Circle className="w-2.5 h-2.5 fill-slate-300 text-transparent" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          m.completed
                            ? 'text-slate-900'
                            : m.isCurrent
                            ? 'text-blue-700 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {m.step}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {m.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {m.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Commercial logistics checkpoint data · Verified milestones.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
