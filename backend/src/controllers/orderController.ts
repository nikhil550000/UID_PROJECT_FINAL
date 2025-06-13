import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import '../types'; // Import types to extend Express Request interface

const prisma = new PrismaClient();

// Schema for creating an order
const createOrderSchema = z.object({
  medicine_id: z.number().int().positive(),
  store_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

// Schema for approving/rejecting an order
const processOrderSchema = z.object({
  approver_id: z.number().int().positive(),
  notes: z.string().optional(),
});

export const orderController = {
  // Get all orders
  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          medicine: true,
          store: true,
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: orders,
        message: 'Orders retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting orders:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve orders'
      });
    }
  },

  // Get order by ID
  getOrderById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const order = await prisma.order.findUnique({
        where: { order_id: Number(id) },
        include: {
          medicine: true,
          store: true,
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
        message: 'Order retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting order:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve order'
      });
    }
  },

  // Create a new order
  createOrder: async (req: Request, res: Response) => {
    try {
      const { medicine_id, store_id, quantity, notes } = createOrderSchema.parse(req.body);
      const requester_id = req.user?.id; // Assuming user info is attached to request by auth middleware

      // Check if medicine exists and has enough stock
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicine_id }
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found',
          message: `Medicine with ID ${medicine_id} not found`
        });
      }

      // Create the order
      const order = await prisma.order.create({
        data: {
          medicine_id,
          store_id,
          requester_id,
          quantity,
          notes,
          status: 'pending'
        },
        include: {
          medicine: true,
          store: true
        }
      });

      return res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error creating order:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create order'
      });
    }
  },

  // Get pending orders
  getPendingOrders: async (req: Request, res: Response) => {
    try {
      const pendingOrders = await prisma.order.findMany({
        where: { status: 'pending' },
        include: {
          medicine: true,
          store: true,
          requester: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: pendingOrders,
        message: 'Pending orders retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting pending orders:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve pending orders'
      });
    }
  },

  // Approve an order
  approveOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { approver_id, notes } = processOrderSchema.parse(req.body);

      // Check user permissions (admin or employee with order approval permission)
      const user = await prisma.user.findUnique({
        where: { id: approver_id },
        include: {
          employee: true,
          admin: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${approver_id} not found`
        });
      }

      const canApprove = user.role === 'admin' || 
        (user.employee && user.employee.can_approve_orders);

      if (!canApprove) {
        return res.status(403).json({
          success: false,
          error: 'Permission denied',
          message: 'You do not have permission to approve orders'
        });
      }

      // Find the order
      const order = await prisma.order.findUnique({
        where: { order_id: Number(id) },
        include: { medicine: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${id} not found`
        });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Invalid order status',
          message: `Order is already ${order.status}`
        });
      }

      // Check if there is enough stock
      if (order.medicine.stock_quantity < order.quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock',
          message: `Not enough stock to fulfill this order. Available: ${order.medicine.stock_quantity}, Requested: ${order.quantity}`
        });
      }

      // Approve the order and update stock in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update the order
        const updatedOrder = await tx.order.update({
          where: { order_id: Number(id) },
          data: {
            approver_id,
            status: 'approved',
            notes: notes || order.notes,
            approved_at: new Date(),
            delivered_at: null // Will be set when delivered
          },
          include: {
            medicine: true,
            store: true
          }
        });

        // Update medicine stock and track restocking info
        const updatedMedicine = await tx.medicine.update({
          where: { id: order.medicine_id },
          data: {
            stock_quantity: {
              decrement: order.quantity
            },
            updated_at: new Date()
          }
        });

        return { updatedOrder, updatedMedicine };
      });

      return res.status(200).json({
        success: true,
        data: result.updatedOrder,
        message: 'Order approved successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error approving order:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to approve order'
      });
    }
  },

  // Reject an order
  rejectOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { approver_id, notes } = processOrderSchema.parse(req.body);

      // Check user permissions (admin or employee with order approval permission)
      const user = await prisma.user.findUnique({
        where: { id: approver_id },
        include: {
          employee: true,
          admin: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${approver_id} not found`
        });
      }

      const canApprove = user.role === 'admin' || 
        (user.employee && user.employee.can_approve_orders);

      if (!canApprove) {
        return res.status(403).json({
          success: false,
          error: 'Permission denied',
          message: 'You do not have permission to reject orders'
        });
      }

      // Find the order
      const order = await prisma.order.findUnique({
        where: { order_id: Number(id) }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${id} not found`
        });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Invalid order status',
          message: `Order is already ${order.status}`
        });
      }

      // Reject the order
      const updatedOrder = await prisma.order.update({
        where: { order_id: Number(id) },
        data: {
          approver_id,
          status: 'rejected',
          notes: notes || 'Order rejected',
          approved_at: new Date()
        },
        include: {
          medicine: true,
          store: true
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedOrder,
        message: 'Order rejected successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error rejecting order:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to reject order'
      });
    }
  },

  // Mark order as delivered
  markOrderDelivered: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Find the order
      const order = await prisma.order.findUnique({
        where: { order_id: Number(id) }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${id} not found`
        });
      }

      if (order.status !== 'approved') {
        return res.status(400).json({
          success: false,
          error: 'Invalid order status',
          message: `Only approved orders can be marked as delivered. Current status: ${order.status}`
        });
      }

      if (order.delivered_at) {
        return res.status(400).json({
          success: false,
          error: 'Already delivered',
          message: `Order was already delivered on ${order.delivered_at}`
        });
      }

      // Mark as delivered
      const updatedOrder = await prisma.order.update({
        where: { order_id: Number(id) },
        data: {
          delivered_at: new Date()
        },
        include: {
          medicine: true,
          store: true
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedOrder,
        message: 'Order marked as delivered successfully'
      });
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to mark order as delivered'
      });
    }
  }
};

export default orderController;
