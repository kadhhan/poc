/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { SummaryCards } from './components/SummaryCards';
import { ShipmentTable } from './components/ShipmentTable';
import { ShipmentDetailModal } from './components/ShipmentDetailModal';
import { EmptyState } from './components/EmptyState';
import { HowToGuideModal } from './components/HowToGuideModal';
import { INITIAL_SHIPMENTS } from './data/shipments';
import { SearchFilterState, Shipment } from './types/shipment';
import { filterShipments, calculateSummary, exportShipmentsToCSV } from './utils/shipmentUtils';

export default function App() {
  // Global filter state
  const [filters, setFilters] = useState<SearchFilterState>({
    fromLocation: 'ALL',
    toLocation: 'ALL',
    mode: 'ALL',
    status: 'ALL',
    carrier: 'ALL',
    keyword: '',
  });

  // Selected shipment for View Details modal
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Guide / Documentation modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // List of all distinct carriers from dataset for carrier dropdown
  const availableCarriers = useMemo(() => {
    const set = new Set<string>();
    INITIAL_SHIPMENTS.forEach((s) => set.add(s.carrier));
    return Array.from(set).sort();
  }, []);

  // Filtered shipments based on current active filters
  const filteredShipments = useMemo(() => {
    return filterShipments(INITIAL_SHIPMENTS, filters);
  }, [filters]);

  // Dynamic summary stats calculated reactively from filtered results
  const summary = useMemo(() => {
    return calculateSummary(filteredShipments);
  }, [filteredShipments]);

  // Handlers
  const handleApplyFilters = (newFilters: SearchFilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      fromLocation: 'ALL',
      toLocation: 'ALL',
      mode: 'ALL',
      status: 'ALL',
      carrier: 'ALL',
      keyword: '',
    });
  };

  const handleSelectRoutePreset = (from: string, to: string) => {
    setFilters({
      fromLocation: from,
      toLocation: to,
      mode: 'ALL',
      status: 'ALL',
      carrier: 'ALL',
      keyword: '',
    });
  };

  const handleExportCSV = () => {
    exportShipmentsToCSV(filteredShipments, `shipments-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Navbar */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onExportCSV={handleExportCSV}
        shipmentCount={filteredShipments.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Panel */}
        <section aria-label="Shipment Search and Filters">
          <SearchFilters
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onReset={handleResetFilters}
            availableCarriers={availableCarriers}
          />
        </section>

        {/* Dynamic Shipment Summary KPI Cards */}
        <section aria-label="Shipment Metric Summaries">
          <SummaryCards summary={summary} />
        </section>

        {/* Shipment Results Section */}
        <section aria-label="Shipment Results">
          {filteredShipments.length > 0 ? (
            <ShipmentTable
              shipments={filteredShipments}
              onSelectShipment={(shipment) => setSelectedShipment(shipment)}
            />
          ) : (
            <EmptyState
              filters={filters}
              onReset={handleResetFilters}
              onSelectRoute={handleSelectRoutePreset}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Shipment Explorer POC</span>
            <span>·</span>
            <span>Internal Freight Management Prototype</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Developer Architecture & Adding Data
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Total Catalog: {INITIAL_SHIPMENTS.length} records</span>
          </div>
        </div>
      </footer>

      {/* Shipment Details Drawer/Modal */}
      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      {/* How-To & Architecture Documentation Modal */}
      <HowToGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
