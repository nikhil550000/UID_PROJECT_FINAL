
import { Router } from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoresByLocation
} from '../controllers/storeController';
import { validateRequest } from '../middleware/validation';
import { CreateStoreSchema, UpdateStoreSchema } from '../types';

const router = Router();

// GET /api/stores - Get all medical stores
router.get('/', getAllStores);

// GET /api/stores/location/:location - Get stores by location
router.get('/location/:location', getStoresByLocation);

// GET /api/stores/:id - Get store by ID
router.get('/:id', getStoreById);

// POST /api/stores - Create new medical store
router.post('/', validateRequest(CreateStoreSchema), createStore);

// PUT /api/stores/:id - Update medical store
router.put('/:id', validateRequest(UpdateStoreSchema), updateStore);

// DELETE /api/stores/:id - Delete medical store
router.delete('/:id', deleteStore);

export default router;
