import express from 'express';
import orderController from '../controllers/orderController';

const router = express.Router();

// Get all orders
router.get('/', orderController.getAllOrders);

// Get pending orders
router.get('/pending', orderController.getPendingOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/', orderController.createOrder);

// Approve an order
router.put('/:id/approve', orderController.approveOrder);

// Reject an order
router.put('/:id/reject', orderController.rejectOrder);

// Mark order as delivered
router.put('/:id/deliver', orderController.markOrderDelivered);

export default router;
