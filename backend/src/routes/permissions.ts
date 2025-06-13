import express from 'express';
import permissionController from '../controllers/permissionController';

const router = express.Router();

// Get all employee permissions
router.get('/employees', permissionController.getAllEmployeePermissions);

// Get permissions for a specific employee
router.get('/employees/:id', permissionController.getEmployeePermissions);

// Update permissions for an employee (admin only)
router.put('/employees/:id', permissionController.updateEmployeePermissions);

// Check if current user has specific permission
router.get('/check/:userId', permissionController.checkPermission);

export default router;
