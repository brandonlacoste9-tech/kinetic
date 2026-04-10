/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Hero from "./components/Hero";
import DisciplineFilters from "./components/DisciplineFilters";
import GymGrid from "./components/GymGrid";
import LocalIntensity from "./components/LocalIntensity";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import OnboardingForm from "./components/OnboardingForm";
import StudioDetail from "./components/StudioDetail";
import AmenityFilter from "./components/AmenityFilter";
import LiveIntensityFeed from "./components/LiveIntensityFeed";
import RadarMap from "./components/RadarMap";
import SectorDeepDive from "./components/SectorDeepDive";
import OperatorDashboard from "./components/OperatorDashboard";
import Leaderboard from "./components/Leaderboard";
import ErrorBoundary from "./components/ErrorBoundary";
import { type Studio } from "./lib/supabase";
import { AnimatePresence } from "motion/react";

import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [searchOptions, setSearchOptions] = useState<{ 
    featuredOnly?: boolean; 
    nearby?: { lat: number; lng: number; radius: number };
    amenityIds?: string[];
  }>({ featuredOnly: false });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchOptions(prev => ({
          ...prev,
          nearby: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 5000 // 5km radius
          }
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  const toggleAmenity = (id: string) => {
    const newIds = selectedAmenityIds.includes(id)
      ? selectedAmenityIds.filter(i => i !== id)
      : [...selectedAmenityIds, id];
    
    setSelectedAmenityIds(newIds);
    setSearchOptions(prev => ({ ...prev, amenityIds: newIds }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onOpenRadar={() => setIsRadarOpen(true)} 
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />
      
      <main className="flex-grow pt-16 pb-24 md:pb-0">
        <Hero onNearbySearch={handleNearbySearch} isSearchingNearby={!!searchOptions.nearby} />
        <AmenityFilter selectedIds={selectedAmenityIds} onToggle={toggleAmenity} />
        <GymGrid 
          searchOptions={searchOptions} 
          onSelectStudio={setSelectedStudio} 
          onSelectSector={setSelectedSector}
        />
        <LocalIntensity onSelectSector={setSelectedSector} />
        <CTA />
      </main>

      <Footer />
      <MobileNav />
      <LiveIntensityFeed />

      <OnboardingForm isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

      <AnimatePresence>
        {selectedStudio && (
          <StudioDetail 
            studio={selectedStudio} 
            onClose={() => setSelectedStudio(null)} 
            onSelectSector={setSelectedSector}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRadarOpen && (
          <RadarMap 
            isOpen={isRadarOpen} 
            onClose={() => setIsRadarOpen(false)} 
            onSelectSector={setSelectedSector}
          />
        )}
      </AnimatePresence>

      <SectorDeepDive 
        neighborhoodName={selectedSector || ""} 
        isOpen={!!selectedSector} 
        onClose={() => setSelectedSector(null)} 
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      <AnimatePresence>
        {isDashboardOpen && (
          <OperatorDashboard 
            isOpen={isDashboardOpen} 
            onClose={() => setIsDashboardOpen(false)} 
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLeaderboardOpen && (
          <Leaderboard 
            isOpen={isLeaderboardOpen} 
            onClose={() => setIsLeaderboardOpen(false)} 
            sector={selectedSector}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button 
        onClick={() => setIsOnboardingOpen(true)}
        whileHover={{ rotate: 12, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 kinetic-gradient text-on-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl z-40"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
}
