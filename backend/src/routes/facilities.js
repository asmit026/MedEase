import { Router } from 'express';
import { findNearbyFacilities } from '../data/facilities.js';

const router = Router();

router.get('/', async (req, res) => {
  const lat = req.query.lat !== undefined ? parseFloat(req.query.lat) : null;
  const lng = req.query.lng !== undefined ? parseFloat(req.query.lng) : null;
  const specialty = req.query.specialty || null;
  const search = req.query.search || '';

  const validLat = lat !== null && !Number.isNaN(lat) ? lat : null;
  const validLng = lng !== null && !Number.isNaN(lng) ? lng : null;

  const facilities = await findNearbyFacilities({
    userLat: validLat,
    userLng: validLng,
    specialty,
    searchQuery: search
  });

  res.json({
    total: facilities.length,
    userLocation: {
      lat: validLat !== null ? validLat : 45.4215,
      lng: validLng !== null ? validLng : -75.6972,
      isDefault: validLat === null || validLng === null
    },
    facilities
  });
});

export default router;
