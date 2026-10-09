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
import { OpeningIntroAnimation } from './components/OpeningIntroAnimation';
import { INITIAL_SHIPMENTS } from './data/shipments';
import { WORLD_LOCATIONS } from './data/globalLocations';
import { SearchFilterState, Shipment } from './types/shipment';
import {
  calculateSummary,
  exportShipmentsToCSV,
  searchShipmentsWithAlternatives,
  filterShipments,
} from './utils/shipmentUtils';
import {
  createShipment,
  generateShipmentsForSpecificRoute,
} from './utils/dummyDataGenerator';

export default function App() {
  // Opening Intro Animation state (only on initial website load per session)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('hmd_intro_viewed');
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('hmd_intro_viewed', 'true');
    } catch {
      // ignore
    }
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Dynamic shipment database state (initialized with 320+ baseline global shipments)
  const [shipmentsList, setShipmentsList] = useState<Shipment[]>(INITIAL_SHIPMENTS);

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

  // Toast notification for data generation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Automatically guarantee at least 6 authentic direct shipments for any selected route pair
  React.useEffect(() => {
    const hasFrom = filters.fromLocation && filters.fromLocation !== 'ALL' && filters.fromLocation.trim() !== '';
    const hasTo = filters.toLocation && filters.toLocation !== 'ALL' && filters.toLocation.trim() !== '';

    if (hasFrom && hasTo) {
      const directMatches = filterShipments(shipmentsList, {
        fromLocation: filters.fromLocation,
        toLocation: filters.toLocation,
        mode: 'ALL',
        carrier: 'ALL',
        status: 'ALL',
        keyword: '',
      });

      if (directMatches.length < 6) {
        const needed = 6 - directMatches.length;
        const newShipments = generateShipmentsForSpecificRoute(
          filters.fromLocation,
          filters.toLocation,
          shipmentsList.length,
          needed
        );
        setShipmentsList((prev) => [...newShipments, ...prev]);
      }
    }
  }, [filters.fromLocation, filters.toLocation]);

  // List of all distinct carriers from active dataset
  const availableCarriers = useMemo(() => {
    const set = new Set<string>();
    shipmentsList.forEach((s) => set.add(s.carrier));
    return Array.from(set).sort();
  }, [shipmentsList]);

  // Search results
  const searchResult = useMemo(() => {
    return searchShipmentsWithAlternatives(shipmentsList, filters);
  }, [shipmentsList, filters]);

  const filteredShipments = searchResult.combinedResults;

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

  // Generate 25 more random global shipments across worldwide ports
  const handleGenerateMoreGlobal = () => {
    const newRecords: Shipment[] = [];
    const count = 25;
    const startId = 40000 + shipmentsList.length;

    for (let i = 0; i < count; i++) {
      const origIdx = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      let destIdx = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      while (destIdx === origIdx) {
        destIdx = Math.floor(Math.random() * WORLD_LOCATIONS.length);
      }
      newRecords.push(
        createShipment(
          startId + i,
          WORLD_LOCATIONS[origIdx],
          WORLD_LOCATIONS[destIdx]
        )
      );
    }

    setShipmentsList((prev) => [...prev, ...newRecords]);
    showToast(`✨ Generated 25 new realistic global shipments (Total: ${shipmentsList.length + count})`);
  };

  // Generate shipments specifically for a requested route (on-demand route synthesizer)
  const handleGenerateForRoute = (from: string, to: string) => {
    const newShipments = generateShipmentsForSpecificRoute(from, to, shipmentsList.length);
    setShipmentsList((prev) => [...newShipments, ...prev]);
    showToast(`✨ Generated ${newShipments.length} authentic shipments for route: ${from} → ${to}`);
  };

  const handleExportCSV = () => {
    exportShipmentsToCSV(filteredShipments, `hmd-shipments-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-slate-700 animate-in slide-in-from-bottom-2 fade-in">
          {toastMessage}
        </div>
      )}

      {/* Full-Screen Opening Cinematic Intro Animation */}
      {showIntro && (
        <OpeningIntroAnimation onComplete={handleIntroComplete} />
      )}

      {/* Top Application Navbar */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onExportCSV={handleExportCSV}
        onGenerateMore={handleGenerateMoreGlobal}
        onReplayIntro={handleReplayIntro}
        shipmentCount={filteredShipments.length}
        totalCatalogCount={shipmentsList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Panel with Worldwide Autocomplete and Free Typing */}
        <section aria-label="Shipment Search and Filters">
          <SearchFilters
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onReset={handleResetFilters}
            availableCarriers={availableCarriers}
            shipments={shipmentsList}
          />
        </section>

        {/* Dynamic Shipment Summary KPI Cards */}
        <section aria-label="Shipment Metric Summaries">
          <SummaryCards summary={summary} />
        </section>

        {/* Shipment Results Table */}
        <section aria-label="Shipment Results Table">
          {filteredShipments.length > 0 ? (
            <ShipmentTable
              shipments={filteredShipments}
              onSelectShipment={(shipment) => setSelectedShipment(shipment)}
              activeMode={filters.mode}
              onModeChange={(m) => {
                const nextFilters = { ...filters, mode: m, carrier: 'ALL' };
                setFilters(nextFilters);
              }}
              totalAllCount={shipmentsList.length}
              totalAirCount={shipmentsList.filter((s) => s.mode === 'Air').length}
              totalSeaCount={shipmentsList.filter((s) => s.mode === 'Sea').length}
            />
          ) : (
            <EmptyState
              filters={filters}
              onReset={handleResetFilters}
              onSelectRoute={handleSelectRoutePreset}
              onGenerateForRoute={handleGenerateForRoute}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">HMD Global Shipments</span>
            <span>·</span>
            <span>Connecting the World, One Shipment at a Time.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerateMoreGlobal}
              className="text-indigo-600 hover:underline font-medium cursor-pointer"
            >
              + Generate More Records
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Architecture & Data Guide
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">
              {shipmentsList.length} global records loaded
            </span>
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
