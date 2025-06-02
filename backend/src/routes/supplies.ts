
import { Router } from 'express';
import {
  getAllSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
  deleteSupply,
  getMedicinesByStore,
  getStoresByMedicine
} from '../controllers/supplyController';
import { validateRequest } from '../middleware/validation';
import { CreateSupplySchema, UpdateSupplySchema } from '../types';

const router = Router();

// GET /api/supplies - Get all supply records
router.get('/', getAllSupplies);

// GET /api/supplies/:id - Get supply by ID
router.get('/:id', getSupplyById);

// GET /api/supplies/store/:storeId - Get medicines supplied to a store
router.get('/store/:storeId', getMedicinesByStore);

// GET /api/supplies/medicine/:medicineId - Get stores that received a medicine
router.get('/medicine/:medicineId', getStoresByMedicine);

// POST /api/supplies - Create new supply record
router.post('/', validateRequest(CreateSupplySchema), createSupply);

// PUT /api/supplies/:id - Update supply record
router.put('/:id', validateRequest(UpdateSupplySchema), updateSupply);

// DELETE /api/supplies/:id - Delete supply record
router.delete('/:id', deleteSupply);

export default router;
