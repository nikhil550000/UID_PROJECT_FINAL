
import { Router } from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiringMedicines
} from '../controllers/medicineController';
import { validateRequest } from '../middleware/validation';
import { CreateMedicineSchema, UpdateMedicineSchema } from '../types';
import { z } from 'zod';

const router = Router();

// GET /api/medicines - Get all medicines
router.get('/', getAllMedicines);

// GET /api/medicines/expiring - Get medicines expiring soon
router.get('/expiring', getExpiringMedicines);

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', getMedicineById);

// POST /api/medicines - Create new medicine
router.post('/', validateRequest(CreateMedicineSchema), createMedicine);

// PUT /api/medicines/:id - Update medicine
router.put('/:id', validateRequest(UpdateMedicineSchema), updateMedicine);

// DELETE /api/medicines/:id - Delete medicine
router.delete('/:id', deleteMedicine);

export default router;
