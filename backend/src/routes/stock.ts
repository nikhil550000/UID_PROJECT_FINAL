import express from 'express';
import stockController from '../controllers/stockController';

const router = express.Router();

// Get inventory status (with query parameters for filtering)
router.get('/inventory', stockController.getInventoryStatus);

// Get medicines with low stock
router.get('/low-stock', stockController.getLowStockMedicines);

// Get stock information for a specific medicine (including restock info)
router.get('/medicine/:id/info', stockController.getMedicineStockInfo);

// Update stock levels
router.post('/update', stockController.updateStock);

export default router;
