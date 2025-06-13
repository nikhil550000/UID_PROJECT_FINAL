import express from 'express';
import analyticsController from '../controllers/analyticsController';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', analyticsController.getDashboardStats);

// Get medicine categories
router.get('/medicines/categories', analyticsController.getMedicineCategories);

// Get supply trends
router.get('/supplies/trends', analyticsController.getSupplyTrends);

// Get order analytics
router.get('/orders/analytics', analyticsController.getOrderAnalytics);

export default router;
