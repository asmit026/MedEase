import React, { useState, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { fetchNearbyFacilities } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom clinical pin icon creator
const createClinicalIcon = (isBestMatch, label) => {
  return L.divIcon({
    className: 'custom-clinical-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        <div style="background: ${isBestMatch ? '#006857' : '#ffffff'}; color: ${isBestMatch ? '#ffffff' : '#141d1a'}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: ${isBestMatch ? 'none' : '1px solid #bdc9c4'}; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${isBestMatch ? '#99f3dc' : '#2e6579'};"></span>
          <span>${label}</span>
        </div>
        <div style="width: 8px; height: 8px; background: ${isBestMatch ? '#006857' : '#ffffff'}; transform: rotate(45deg); margin-top: -4px; border-right: ${isBestMatch ? 'none' : '1px solid #bdc9c4'}; border-bottom: ${isBestMatch ? 'none' : '1px solid #bdc9c4'};"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function FindHealthcarePage() {
  const { selectedSpecialty } = useAssessment();
  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [mapCenter, setMapCenter] = useState([45.4215, -75.6972]);
  const [mapZoom, setMapZoom] = useState(13);

  // Default facilities fallback matching Stitch Screen
  const initialFacilities = [
    {
      id: "fac-1",
      name: "CityCare Medical Center",
      type: "Medical Center & Emergency",
      specialties: ["General Medicine", "Emergency Care"],
      distanceKm: 2.4,
      driveMinutes: 8,
      address: "450 Metro Blvd, Downtown Metro",
      lat: 45.4215,
      lng: -75.6972,
      isOpen: true,
      hours: "Open Now · 24/7",
      isBestMatch: true,
      matchReason: ["Relevant specialty", "Nearby", "Open now"],
      phone: "(555) 234-5678"
    },
    {
      id: "fac-2",
      name: "St. Jude Community Clinic",
      type: "Community Clinic",
      specialties: ["General Medicine & Walk-in"],
      distanceKm: 3.8,
      driveMinutes: 12,
      address: "782 Elm Ave, Riverside District",
      lat: 45.4275,
      lng: -75.6845,
      isOpen: true,
      hours: "Open until 8:00 PM",
      isBestMatch: false,
      matchReason: ["Walk-in available"],
      phone: "(555) 345-6789"
    },
    {
      id: "fac-3",
      name: "Westside Health Center",
      type: "Primary Care Practice",
      specialties: ["Primary Care Practice"],
      distanceKm: 5.1,
      driveMinutes: 15,
      address: "1209 West Highland Way",
      lat: 45.4150,
      lng: -75.7150,
      isOpen: true,
      hours: "Open now",
      isBestMatch: false,
      matchReason: ["Primary care practice"],
      phone: "(555) 456-7890"
    },
    {
      id: "fac-4",
      name: "Ottawa General Hospital",
      type: "Hospital",
      specialties: ["Emergency & Outpatient"],
      distanceKm: 6.2,
      driveMinutes: 18,
      address: "501 Smyth Road",
      lat: 45.4010,
      lng: -75.6510,
      isOpen: true,
      hours: "24/7 Service",
      isBestMatch: false,
      matchReason: ["Emergency & trauma"],
      phone: "(555) 567-8901"
    }
  ];

  const loadFacilities = async (query = '', spec = selectedSpecialty) => {
    setLoading(true);
    try {
      const data = await fetchNearbyFacilities({ search: query, specialty: spec });
      if (data && data.facilities && data.facilities.length > 0) {
        setFacilities(data.facilities);
        const best = data.facilities.find(f => f.isBestMatch) || data.facilities[0];
        setSelectedFacility(best);
      } else {
        setFacilities(initialFacilities);
        setSelectedFacility(initialFacilities[0]);
      }
    } catch (err) {
      console.warn("Using local facility fallback:", err);
      setFacilities(initialFacilities);
      setSelectedFacility(initialFacilities[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities(searchQuery, selectedSpecialty);
  }, [selectedSpecialty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFacilities(searchQuery, selectedSpecialty);
  };

  const bestMatchFacility = facilities.find(f => f.isBestMatch) || facilities[0];
  const otherFacilities = facilities.filter(f => f.id !== bestMatchFacility?.id);

  const focusFacilityOnMap = (fac) => {
    setSelectedFacility(fac);
    setMapCenter([fac.lat, fac.lng]);
    setMapZoom(14);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Search & Location Context Bar */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, clinics or specialists"
                className="w-full pl-11 pr-14 py-2.5 bg-surface-container-low text-on-surface text-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:shadow-xs transition-all placeholder:text-outline border border-transparent focus:border-outline-variant"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-mono text-[10px]">
                <span>⌘</span><span>K</span>
              </div>
            </form>

            {/* Location Context Indicator */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3.5 py-2 rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[18px] filled">
                  location_on
                </span>
                <div className="flex items-baseline gap-1.5 text-xs">
                  <span className="font-mono uppercase tracking-wider text-outline text-[11px]">
                    Location:
                  </span>
                  <span className="text-on-surface font-medium">Downtown Metro</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMapCenter([45.4215, -75.6972]);
                    setMapZoom(13);
                  }}
                  className="ml-2 text-primary font-semibold hover:text-primary-container text-xs cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  title="Filter facilities"
                  className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
                <button
                  type="button"
                  title="Layer controls"
                  className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Discovery Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Map & Spatial Telemetry (7 Cols on Desktop / ~58%) */}
          <div className="lg:col-span-7 flex flex-col gap-4 order-2 lg:order-1">
            {/* Map Canvas Card */}
            <div className="relative w-full h-[450px] lg:h-[620px] rounded-xl overflow-hidden shadow-sm bg-surface-container-low border border-outline-variant/30 z-0">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
              >
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {facilities.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  const label = `${fac.name.split(' ')[0]} · ${fac.driveMinutes}m`;
                  return (
                    <Marker
                      key={fac.id}
                      position={[fac.lat, fac.lng]}
                      icon={createClinicalIcon(fac.isBestMatch, label)}
                      eventHandlers={{
                        click: () => focusFacilityOnMap(fac)
                      }}
                    >
                      <Popup>
                        <div className="p-1 font-body">
                          <h4 className="font-semibold text-sm text-on-surface">{fac.name}</h4>
                          <p className="text-xs text-on-surface-variant">{fac.address}</p>
                          <div className="mt-2 text-xs font-mono text-primary font-semibold">
                            {fac.distanceKm} km · {fac.driveMinutes} min drive
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Top Schematic Overlay: Telemetry HUD */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-[1000]">
                <div className="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 border border-outline-variant/30">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface font-semibold">
                    Triage Geo-Radius: 10 KM
                  </span>
                </div>
                <div className="pointer-events-auto flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                    className="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom(prev => Math.max(prev - 1, 10))}
                    className="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (bestMatchFacility) focusFacilityOnMap(bestMatchFacility);
                    }}
                    className="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">my_location</span>
                  </button>
                </div>
              </div>

              {/* Bottom Route Density Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-3 rounded-xl shadow-md flex items-center justify-between border border-outline-variant/30 z-[1000]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">directions_car</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-on-surface">
                      Light Traffic along Express Corridor
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Optimal routing via 4th Avenue · Fastest Emergency Access
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-outline block">
                    ETA Accuracy
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary">±2 MINS</span>
                </div>
              </div>
            </div>

            {/* Controlled Brutalist Data Micro-Summary */}
            <div className="w-full grid grid-cols-3 gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-outline">Nearest ER</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-on-surface mt-0.5">
                  2.4 KM / 8 MIN
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-outline">Open Facilities</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-primary mt-0.5">
                  {facilities.filter(f => f.isOpen).length} WITHIN 10 KM
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-outline">Protocol State</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-on-surface mt-0.5">
                  DIRECT-ACCESS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Healthcare Navigation Feed (5 Cols on Desktop / ~42%) */}
          <div className="lg:col-span-5 flex flex-col gap-4 order-1 lg:order-2">
            {/* Feed Subtitle / Count */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h1 className="font-display text-xl font-semibold text-on-surface">Available Facilities</h1>
                <p className="text-xs text-on-surface-variant">Ranked by proximity and clinical urgency matching</p>
              </div>
              <span className="font-mono text-[11px] bg-surface-container-high px-2.5 py-1 rounded text-on-surface-variant uppercase font-medium">
                {facilities.length} Results
              </span>
            </div>

            {/* 1. RECOMMENDED FACILITY (Best Match Spotlight Card) */}
            {bestMatchFacility && (
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border-2 border-primary/40 relative overflow-hidden transition-all hover:shadow-md">
                {/* Accent Stripe & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary text-on-primary font-mono text-[11px] tracking-wider uppercase font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Best Match
                  </span>
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                    <span className="font-mono text-[11px] uppercase font-semibold">
                      {bestMatchFacility.hours || 'Open Now'}
                    </span>
                  </div>
                </div>

                {/* Facility Name & Department */}
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-semibold text-on-surface tracking-tight">
                    {bestMatchFacility.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {bestMatchFacility.specialties?.join(' · ')}
                  </p>
                </div>

                {/* Key Distance Telemetry Callout */}
                <div className="my-3.5 p-3 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/30">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-on-surface">
                      {bestMatchFacility.distanceKm} KM
                    </span>
                    <span className="text-outline-variant font-mono text-xs">/</span>
                    <span className="font-mono text-base sm:text-lg font-bold text-primary">
                      {bestMatchFacility.driveMinutes < 10 ? `0${bestMatchFacility.driveMinutes}` : bestMatchFacility.driveMinutes} MIN DRIVE
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Fastest Access
                  </span>
                </div>

                {/* AI / Clinical Rationale Box */}
                <div className="bg-surface-container p-3 rounded-lg mb-4">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                    Why Recommended
                  </span>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-xs text-on-surface">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                      <span className="truncate">Relevant care</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                      <span>Nearby</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                      <span>Open now</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${bestMatchFacility.lat},${bestMatchFacility.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-primary text-on-primary text-xs font-semibold py-2.5 px-3 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 shadow-xs text-center"
                  >
                    <span>Get Directions</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => focusFacilityOnMap(bestMatchFacility)}
                    className="w-full bg-surface-container text-on-surface text-xs font-semibold py-2.5 px-3 rounded-lg hover:bg-surface-container-high transition-colors text-center"
                  >
                    Locate on Map
                  </button>
                </div>
              </div>
            )}

            {/* 2. OTHER NEARBY FACILITIES */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-outline px-1">
                Other Nearby Facilities
              </span>

              {otherFacilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => focusFacilityOnMap(fac)}
                  className={`bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    selectedFacility?.id === fac.id
                      ? 'border-primary shadow-sm bg-secondary-container/10'
                      : 'border-outline-variant/30 hover:border-outline-variant hover:shadow-xs'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-on-surface truncate">
                        {fac.name}
                      </h3>
                      {fac.isOpen && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">
                      {fac.specialties?.join(' · ')}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-mono font-medium text-on-surface text-[11px]">
                        {fac.distanceKm} km · {fac.driveMinutes} min
                      </span>
                      <span className="text-outline-variant font-mono">·</span>
                      <span className="text-[11px] text-on-surface-variant">
                        {fac.hours}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusFacilityOnMap(fac);
                    }}
                    className="bg-surface-container-low text-on-surface text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-surface-container hover:text-primary transition-colors flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>

            {/* Emergency Urgent Care Advisory Banner */}
            <div className="mt-2 bg-surface-container-high p-3.5 rounded-xl flex items-center gap-3 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-on-surface leading-snug">
                  <span className="font-semibold text-error mr-1">Life-threatening emergency?</span>
                  Please call local emergency dispatch immediately (911 / 112).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
