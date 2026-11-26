import axios from 'axios';

export const FACILITY_DATABASE = [
  {
    id: 'fac-citycare',
    name: 'CityCare Medical & Trauma Center',
    type: 'Hospital & Emergency Care',
    specialties: ['General Physician', 'Internal medicine specialist', 'Emergency Care', 'Pulmonologist', 'Cardiologist'],
    address: '450 Metro Blvd, Downtown Metro',
    lat: 45.4215,
    lng: -75.6972,
    isOpen: true,
    hours: 'Open Now · 24/7 Emergency',
    phone: '(555) 234-5678',
    emergency: true
  },
  {
    id: 'fac-stjude',
    name: 'St. Jude Community Health Clinic',
    type: 'Community Clinic',
    specialties: ['General Physician', 'Paediatrician', 'Gynaecologist', 'Internal medicine specialist'],
    address: '782 Elm Ave, Riverside District',
    lat: 45.4275,
    lng: -75.6845,
    isOpen: true,
    hours: 'Open until 8:00 PM',
    phone: '(555) 345-6789',
    emergency: false
  },
  {
    id: 'fac-westside',
    name: 'Westside Family & Urgent Care Practice',
    type: 'Primary Care Practice',
    specialties: ['General Physician', 'Orthopedic', 'Dermatologist'],
    address: '1209 West Highland Way',
    lat: 45.415,
    lng: -75.715,
    isOpen: true,
    hours: 'Open until 7:00 PM',
    phone: '(555) 456-7890',
    emergency: false
  },
  {
    id: 'fac-general',
    name: 'Ottawa Metropolitan General Hospital',
    type: 'University Teaching Hospital',
    specialties: ['Pulmonologist', 'Cardiologist', 'Neurologist', 'Gastroenterologist', 'Immunologist', 'Orthopedic', 'Emergency Care', 'General Physician'],
    address: '501 Smyth Road, Medical Campus',
    lat: 45.401,
    lng: -75.651,
    isOpen: true,
    hours: 'Open Now · 24/7',
    phone: '(555) 567-8901',
    emergency: true
  },
  {
    id: 'fac-cardio',
    name: 'Heart & Vascular Specialty Institute',
    type: 'Cardiology & Vascular Center',
    specialties: ['Cardiologist', 'Internal medicine specialist'],
    address: '320 Cardio Vista Ave',
    lat: 45.418,
    lng: -75.689,
    isOpen: true,
    hours: 'Open until 5:30 PM',
    phone: '(555) 678-9012',
    emergency: false
  },
  {
    id: 'fac-neuro-ortho',
    name: 'Spine & Neuro-Musculoskeletal Institute',
    type: 'Specialty Center',
    specialties: ['Neurologist', 'Orthopedic', 'Rheumatologist', 'Internal medicine specialist'],
    address: '880 Ortho Way, North Wing',
    lat: 45.435,
    lng: -75.705,
    isOpen: true,
    hours: 'Open until 6:00 PM',
    phone: '(555) 789-0123',
    emergency: false
  },
  {
    id: 'fac-digestive',
    name: 'Digestive & Gastrointestinal Center',
    type: 'Gastroenterology Center',
    specialties: ['Gastroenterologist', 'Internal medicine specialist', 'General Physician'],
    address: '610 Wellness Parkway',
    lat: 45.411,
    lng: -75.722,
    isOpen: true,
    hours: 'Open until 5:00 PM',
    phone: '(555) 890-1234',
    emergency: false
  }
];

// In-memory 5-minute cache for Overpass API queries keyed by rounded coordinates
const overpassCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function estimateDriveMinutes(distanceKm) {
  return Math.max(4, Math.round(distanceKm * 2.2 + 3));
}

function formatOsmAddress(tags = {}) {
  if (tags['addr:full']) return tags['addr:full'];
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city']
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Nearby Medical Facility';
}

async function fetchOsmFacilities(lat, lng) {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = overpassCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const delta = 0.08; // ~9km bounding box
  const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
  const url = `https://nominatim.openstreetmap.org/search?q=hospital&format=jsonv2&addressdetails=1&extratags=1&limit=15&viewbox=${viewbox}&bounded=1`;

  const response = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'MedEaseAI/1.0 (healthcare-navigation-app)'
    },
    timeout: 7000
  });

  const elements = Array.isArray(response.data) ? response.data : [];
  const seenNames = new Set();
  const parsed = [];

  for (const el of elements) {
    const name = (el.name || '').trim();
    if (!name || name.toLowerCase() === 'hospital' || seenNames.has(name.toLowerCase())) continue;

    const elLat = parseFloat(el.lat);
    const elLng = parseFloat(el.lon);
    if (Number.isNaN(elLat) || Number.isNaN(elLng)) continue;

    seenNames.add(name.toLowerCase());

    const extratags = el.extratags || {};
    const isHospital = el.type === 'hospital' || el.category === 'amenity';
    const hasEmergency = extratags.emergency === 'yes' || isHospital;

    const specialties = ['General Physician', 'Internal medicine specialist'];
    if (isHospital) {
      specialties.push('Emergency Care', 'Pulmonologist', 'Cardiologist', 'Neurologist', 'Orthopedic', 'Gastroenterologist');
    }
    if (extratags['healthcare:speciality']) {
      for (const sp of extratags['healthcare:speciality'].split(';')) {
        const cleanSp = sp.trim();
        if (cleanSp && !specialties.includes(cleanSp)) {
          specialties.push(cleanSp);
        }
      }
    }

    // Format clean short address from display_name
    const addrParts = (el.display_name || '').split(',').map(p => p.trim()).slice(1, 4);
    const shortAddr = addrParts.length > 0 ? addrParts.join(', ') : 'Nearby Medical Facility';

    parsed.push({
      id: `osm-${el.osm_type || 'node'}-${el.osm_id || el.place_id}`,
      name,
      type: hasEmergency ? 'Hospital & Emergency Care' : 'Hospital & Medical Center',
      specialties,
      address: shortAddr,
      lat: elLat,
      lng: elLng,
      isOpen: true,
      hours: extratags.opening_hours || (hasEmergency ? 'Open Now · 24/7 Emergency' : 'Standard Clinic Hours'),
      phone: extratags.phone || extratags['contact:phone'] || 'Contact facility',
      emergency: hasEmergency
    });
  }

  if (parsed.length > 0) {
    overpassCache.set(cacheKey, { timestamp: Date.now(), data: parsed });
  }

  return parsed;
}

export async function findNearbyFacilities({
  userLat = null,
  userLng = null,
  specialty = null,
  searchQuery = ''
} = {}) {
  const hasUserCoords = userLat !== null && userLat !== undefined && userLng !== null && userLng !== undefined;
  const refLat = hasUserCoords ? Number(userLat) : 45.4215;
  const refLng = hasUserCoords ? Number(userLng) : -75.6972;

  let sourceFacilities = FACILITY_DATABASE;

  // Query real OpenStreetMap hospitals & clinics near user's coordinates
  if (hasUserCoords) {
    try {
      const osmResults = await fetchOsmFacilities(refLat, refLng, 10000);
      if (osmResults.length > 0) {
        sourceFacilities = osmResults;
      }
    } catch (err) {
      console.warn('Overpass API unavailable, falling back to local facilities:', err.message);
    }
  }

  const normalizedSpec = (specialty || '').toLowerCase().trim();
  const queryClean = (searchQuery || '').toLowerCase().trim();

  const processed = [];

  for (const fac of sourceFacilities) {
    const distKm = haversineDistance(refLat, refLng, fac.lat, fac.lng);
    const driveMins = estimateDriveMinutes(distKm);

    const specMatch = normalizedSpec
      ? fac.specialties.some(s => s.toLowerCase().includes(normalizedSpec))
      : false;

    const queryMatch = queryClean
      ? fac.name.toLowerCase().includes(queryClean) ||
        fac.type.toLowerCase().includes(queryClean) ||
        fac.specialties.some(s => s.toLowerCase().includes(queryClean))
      : true;

    if (!queryMatch && queryClean) {
      continue;
    }

    let score = distKm;
    const reasons = [];

    if (specMatch) {
      score -= 1.5;
      reasons.push(`Specialized in ${specialty}`);
    } else if (fac.specialties.includes('General Physician')) {
      reasons.push('General consultation available');
    }

    if (distKm <= 5.0) {
      reasons.push(`Nearby (${distKm} km)`);
    }
    if (fac.emergency) {
      reasons.push('24/7 Emergency unit');
    } else if (fac.isOpen) {
      reasons.push('Open now');
    }

    processed.push({
      id: fac.id,
      name: fac.name,
      type: fac.type,
      specialties: fac.specialties,
      distanceKm: distKm,
      driveMinutes: driveMins,
      address: fac.address,
      lat: fac.lat,
      lng: fac.lng,
      isOpen: fac.isOpen,
      hours: fac.hours,
      phone: fac.phone,
      emergency: Boolean(fac.emergency),
      matchScore: score,
      matchReason: reasons.slice(0, 3),
      isBestMatch: false
    });
  }

  processed.sort((a, b) => a.matchScore - b.matchScore);
  if (processed.length > 0) {
    processed[0].isBestMatch = true;
  }

  return processed;
}
