import React, { useState } from 'react';
import { X, BookOpen, Database, Code2, PlusCircle, Terminal, CheckCircle2 } from 'lucide-react';

interface HowToGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToGuideModal: React.FC<HowToGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'addRecord' | 'setup'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Logistics Shipment Explorer — Technical Guide
              </h2>
              <p className="text-xs text-slate-500">
                POC Architecture, Data Models & Setup Instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            How Search & Counts Work
          </button>
          <button
            onClick={() => setActiveTab('addRecord')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'addRecord'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Adding More Shipment Records
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Local Setup & Commands
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  1. Search Engine Logic
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  The search engine evaluates filters in <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded">src/utils/shipmentUtils.ts</code> using a compound predicate function:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>
                    <strong>Minimum Records & Robust Data:</strong> Over 320+ global shipments seeded across 64 global hubs in all continents, guaranteeing at least 5-8 records for every country and city.
                  </li>
                  <li>
                    <strong>Country & Alias Matching:</strong> Supports spelling variations, country codes, and common aliases (e.g., <em>USA / US / America</em>, <em>UK / Britain</em>, <em>UAE / Emirates</em>, <em>KSA / Saudi Arabia</em>, <em>South Korea</em>).
                  </li>
                  <li>
                    <strong>Direct Route Guarantee:</strong> Every queried origin and destination corridor automatically provides direct matching air cargo flights and ocean vessel voyages without mixing in unrelated destinations.
                  </li>
                  <li>
                    <strong>Separate Air & Sea Modes:</strong> Filter air freight (airports, airlines, AWB) or sea freight (seaports, shipping lines, container equipment) independently or combined.
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  2. Dynamic Summary Calculations
                </h3>
                <p className="leading-relaxed">
                  The summary cards recalculate reactively whenever filtered records change:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <strong>Total Shipments:</strong> <code className="font-mono text-slate-700">shipments.length</code>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <strong>Unique Carriers:</strong> <code className="font-mono text-slate-700">new Set(shipments.map(s =&gt; s.carrier)).size</code>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <strong>In Transit:</strong> Count of records where <code className="font-mono text-slate-700">status === &apos;In Transit&apos;</code>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <strong>Delivered:</strong> Count of records where <code className="font-mono text-slate-700">status === &apos;Delivered&apos;</code>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  3. Decoupled Architecture
                </h3>
                <p>
                  The dummy dataset is isolated in <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">src/data/shipments.ts</code>. The UI components are completely stateless with respect to storage, meaning you can swap the local array with an asynchronous API fetch or database query without refactoring any UI views.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'addRecord' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                How to Add New Shipment Records
              </h3>
              <p>
                Open <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">src/data/shipments.ts</code> and append a new object to the <code className="font-mono text-slate-800">INITIAL_SHIPMENTS</code> array matching the <code className="font-mono text-slate-800">Shipment</code> interface:
              </p>

              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`{
  id: 'SHP-10125',
  origin: { city: 'Mumbai', code: 'BOM', country: 'India' },
  destination: { city: 'Jeddah', code: 'JED', country: 'Saudi Arabia' },
  carrier: 'Saudia Cargo',
  mode: 'Air', // 'Air' or 'Sea'
  etd: '2026-10-15 08:30',
  eta: '2026-10-15 12:45',
  pieces: 35,
  grossWeightKg: 850,
  status: 'Booked', // 'Booked' | 'In Transit' | 'Arrived' | 'Delivered'
  referenceType: 'AWB', // 'AWB' or 'B/L'
  referenceNumber: '065-98321044',
  serviceLevel: 'Express Cargo',
  cargoDescription: 'Pharmaceutical packaging supplies',
  vesselOrFlight: 'SV 985',
  containerOrPackageType: '1 x PAG Pallet',
  dimensions: '120 x 80 x 140 cm',
  volumeCbm: 2.4,
  consignor: 'Apex Pharma Packaging, Mumbai',
  consignee: 'National Medical Distribution, Jeddah',
  milestones: [
    { step: 'Booking Confirmed', timestamp: '2026-10-08 14:00', location: 'BOM', completed: true },
    { step: 'Cargo Acceptance', timestamp: '2026-10-14 10:00', location: 'BOM Cargo', completed: false }
  ]
}`}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-2.5 text-blue-800">
                <strong>Tip:</strong> If you introduce a new city, also add its entry to <code className="font-mono">LOCATIONS_CATALOG</code> in the same file so it appears automatically in the dropdown selectors!
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Local Setup & Execution Instructions
              </h3>
              <p>
                To run this POC locally on your machine:
              </p>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">1. Prerequisites:</div>
                <p className="text-slate-600 pl-3">
                  Install Node.js (version 18, 20, or 22 LTS) from <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-blue-600 underline">nodejs.org</a>.
                </p>

                <div className="font-semibold text-slate-800">2. Install Dependencies:</div>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[11px]">
                  npm install
                </div>

                <div className="font-semibold text-slate-800">3. Run Development Server:</div>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[11px]">
                  npm run dev
                </div>
                <p className="text-slate-500 pl-3">
                  Open your browser at <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">http://localhost:3000</code>.
                </p>

                <div className="font-semibold text-slate-800">4. Production Build:</div>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[11px]">
                  npm run build
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors"
          >
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
