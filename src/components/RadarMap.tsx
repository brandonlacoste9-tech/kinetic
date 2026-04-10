import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useStudios } from "../hooks/useStudios";
import { useLanguage } from "../contexts/LanguageContext";
import { X } from "lucide-react";
import { 
  KineticCrosshair, 
  KineticZap, 
  KineticActivity, 
  KineticShieldAlert 
} from "./KineticIcons";

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ac2c00; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #ac2c00;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

interface RadarMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSector?: (sector: string) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function RadarMap({ isOpen, onClose, onSelectSector }: RadarMapProps) {
  const { studios } = useStudios();
  const { t, locale } = useLanguage();
  const [center] = useState<[number, number]>([45.5017, -73.5673]); // Montreal center

  const localizeNeighborhood = (name: string | undefined) => {
    if (!name || locale !== 'joual') return name;
    const mapping: Record<string, string> = {
      'Plateau': "L'Plateau",
      'Le Plateau-Mont-Royal': "L'Plateau",
      'Hochelaga-Maisonneuve': 'Hochelaga',
      'Ville-Marie': 'Centre-Ville',
    };
    return mapping[name] || name;
  };

  // Calculate Hot Zones (Neighborhood Clusters)
  const hotZones = useMemo(() => {
    const zones: Record<string, { lat: number; lng: number; count: number; name: string }> = {};
    
    studios.forEach(studio => {
      const neighborhood = studio.neighborhood?.name || studio.city;
      if (!zones[neighborhood]) {
        zones[neighborhood] = { 
          lat: studio.lat || 45.5, 
          lng: studio.lng || -73.5, 
          count: 0, 
          name: neighborhood 
        };
      }
      // Simple average for center (not perfect but good enough for demo)
      zones[neighborhood].lat = (zones[neighborhood].lat + (studio.lat || 45.5)) / 2;
      zones[neighborhood].lng = (zones[neighborhood].lng + (studio.lng || -73.5)) / 2;
      zones[neighborhood].count += 1;
    });

    return Object.values(zones);
  }, [studios]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col"
    >
      {/* Radar Overlay UI */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-primary/20 shadow-[0_0_20px_rgba(172,44,0,0.5)] z-20"
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(172,44,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(172,44,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Header UI */}
      <header className="relative z-30 p-8 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <h2 className="font-headline text-4xl font-black italic tracking-tighter text-white uppercase">
              {t.radar.toggle}
            </h2>
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-primary font-bold tracking-widest uppercase">
            <span>{t.radar.status}: {t.radar.optimal}</span>
            <span>//</span>
            <span>{t.radar.scanning}: {t.radar.currentSector}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="bg-primary text-on-primary p-4 rounded-2xl hover:scale-110 transition-transform shadow-2xl"
        >
          <X size={32} />
        </button>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer 
          center={center} 
          zoom={13} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapController center={center} />

          {/* Render Hot Zones (Clusters) */}
          {hotZones.map(zone => (
            <Circle 
              key={`zone-${zone.name}`}
              center={[zone.lat, zone.lng]}
              radius={400 + (zone.count * 100)}
              eventHandlers={{
                click: () => onSelectSector && onSelectSector(zone.name)
              }}
              pathOptions={{ 
                fillColor: '#ac2c00', 
                fillOpacity: 0.2 + (zone.count * 0.05), 
                color: '#ac2c00',
                weight: 2,
                dashArray: '5, 10',
                className: 'cursor-pointer hover:fill-opacity-40 transition-all'
              }}
            >
              <Popup>
                <div className="p-2 text-center">
                  <h4 className="font-headline font-black text-primary uppercase text-lg">
                    {localizeNeighborhood(zone.name)}
                  </h4>
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    {zone.count} ACTIVE STATIONS
                  </p>
                  <div className="mt-2 font-headline text-[10px] font-black text-primary uppercase">
                    CLICK TO DEEP DIVE
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {studios.map(studio => (
            <div key={studio.id}>
              {/* Individual Heat Bloom */}
              <Circle 
                center={[studio.lat || 45.5, studio.lng || -73.5]}
                radius={200}
                pathOptions={{ 
                  fillColor: '#ac2c00', 
                  fillOpacity: 0.1, 
                  color: 'transparent',
                  className: 'pointer-events-none'
                }}
              />
              
              {/* Studio Marker */}
              <Marker 
                position={[studio.lat || 45.5, studio.lng || -73.5]} 
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2 space-y-2">
                    <h4 className="font-headline font-black text-primary uppercase text-lg">{studio.name}</h4>
                    <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                      {localizeNeighborhood(studio.neighborhood?.name) || studio.city}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px]">
                      <KineticCrosshair size={12} />
                      {studio.rating} {t.radar.eliteStatus}
                    </div>
                    <button 
                      onClick={() => onSelectSector && onSelectSector(studio.neighborhood?.name || studio.city)}
                      className="w-full mt-2 bg-primary text-on-primary font-headline font-black text-[10px] py-2 rounded-lg uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      {locale === 'joual' ? "INTEL DU COIN" : "SECTOR INTEL"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>

        {/* Sidebar Logs */}
        <div className="absolute left-8 bottom-24 z-30 w-80 space-y-4 hidden lg:block">
          <div className="bg-black/60 backdrop-blur-md border border-primary/20 p-6 rounded-2xl space-y-4">
            <h3 className="font-headline text-xs font-black tracking-widest text-primary uppercase">
              {t.radar.intensityHubs}
            </h3>
            <div className="space-y-3">
              <LogItem 
                icon={<KineticZap size={12} />} 
                text={t.radar.log1} 
                onClick={() => onSelectSector && onSelectSector("Plateau")}
              />
              <LogItem 
                icon={<KineticActivity size={12} />} 
                text={t.radar.log2} 
                onClick={() => onSelectSector && onSelectSector("Griffintown")}
              />
              <LogItem 
                icon={<KineticShieldAlert size={12} />} 
                text={t.radar.log3} 
                onClick={() => onSelectSector && onSelectSector("Mile End")}
              />
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-primary/20 p-4 rounded-2xl">
            <div className="flex justify-between font-mono text-[9px] text-primary/60 font-bold uppercase">
              <span>{t.radar.coordinates}</span>
              <span>45.5017° N, 73.5673° W</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Exit Button */}
      <footer className="relative z-30 p-8 flex justify-center">
        <button 
          onClick={onClose}
          className="kinetic-gradient text-on-primary font-headline font-black px-12 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest"
        >
          {t.radar.exit}
        </button>
      </footer>
    </motion.div>
  );
}

function LogItem({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 text-white/80 font-mono text-[10px] tracking-wider uppercase ${onClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
    >
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}
