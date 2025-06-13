import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for updating stock
const updateStockSchema = z.object({
  medicine_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  quantity_change: z.number().int(),
  reason: z.string().min(1).max(100),
  notes: z.string().optional(),
  reference_id: z.number().int().optional()
});

// Schema for checking inventory
const inventoryCheckSchema = z.object({
  minimum_stock: z.boolean().optional(),
  expired: z.boolean().optional()
});

export const stockController = {
  // Get stock information for a medicine (including last restock info)
  getMedicineStockInfo: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const medicine = await prisma.medicine.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          company: true,
          stock_quantity: true,
          minimum_stock: true,
          last_restocked_quantity: true,
          restocked_at: true,
          restocked_by: true,
          stock_notes: true,
          updated_at: true
        }
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found',
          message: `Medicine with ID ${id} not found`
        });
      }

      // Get user info if restocked_by exists
      let restockedByUser = null;
      if (medicine.restocked_by) {
        restockedByUser = await prisma.user.findUnique({
          where: { id: medicine.restocked_by },
          select: {
            id: true,
            name: true,
            role: true
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          ...medicine,
          restockedByUser
        },
        message: 'Stock information retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting stock information:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve stock information'
      });
    }
  },

  // Update stock quantity
  updateStock: async (req: Request, res: Response) => {
    try {
      const { medicine_id, user_id, quantity_change, reason, notes, reference_id } = updateStockSchema.parse(req.body);

      // Check if the user has permissions
      const user = await prisma.user.findUnique({
        where: { id: user_id },
        include: {
          employee: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${user_id} not found`
        });
      }

      const canManageStock = user.role === 'admin' || 
        (user.employee && user.employee.can_manage_medicines);

      if (!canManageStock) {
        return res.status(403).json({
          success: false,
          error: 'Permission denied',
          message: 'You do not have permission to update stock'
        });
      }

      // Find the medicine and update stock in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Get current medicine stock
        const medicine = await tx.medicine.findUnique({
          where: { id: medicine_id }
        });

        if (!medicine) {
          throw new Error(`Medicine with ID ${medicine_id} not found`);
        }

        // Calculate new quantity
        const newQuantity = medicine.stock_quantity + quantity_change;
        
        if (newQuantity < 0) {
          throw new Error('Stock cannot be negative');
        }

        // Update medicine stock (basic implementation for now)
        const updatedMedicine = await tx.medicine.update({
          where: { id: medicine_id },
          data: {
            stock_quantity: newQuantity,
            updated_at: new Date()
          }
        });

        return { updatedMedicine };
      });

      return res.status(200).json({
        success: true,
        data: {
          medicine: result.updatedMedicine
        },
        message: 'Stock updated successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error updating stock:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to update stock'
      });
    }
  },

  // Get medicines that are low on stock
  getLowStockMedicines: async (req: Request, res: Response) => {
    try {
      const lowStockMedicines = await prisma.$queryRaw`
        SELECT * FROM medicines 
        WHERE stock_quantity <= minimum_stock
        ORDER BY stock_quantity ASC
      `;

      return res.status(200).json({
        success: true,
        data: lowStockMedicines,
        message: 'Low stock medicines retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting low stock medicines:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve low stock medicines'
      });
    }
  },

  // Get inventory status
  getInventoryStatus: async (req: Request, res: Response) => {
    try {
      const { minimum_stock, expired } = inventoryCheckSchema.parse(req.query);
      
      const today = new Date();
      
      let whereClause: any = {};
      
      if (expired) {
        whereClause = {
          ...whereClause,
          date_of_expiry: {
            lte: today
          }
        };
      }
      
      let medicines;
      
      if (minimum_stock) {
        // Use raw query for comparing stock_quantity with minimum_stock
        medicines = await prisma.$queryRaw`
          SELECT * FROM medicines 
          WHERE stock_quantity <= minimum_stock
          ${expired ? 'AND date_of_expiry <= CURRENT_DATE' : ''}
          ORDER BY stock_quantity ASC, date_of_expiry ASC
        `;
      } else {
        medicines = await prisma.medicine.findMany({
          where: whereClause,
          orderBy: [
            { stock_quantity: 'asc' },
            { date_of_expiry: 'asc' }
          ]
        });
      }

      return res.status(200).json({
        success: true,
        data: medicines,
        message: 'Inventory status retrieved successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error getting inventory status:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve inventory status'
      });
    }
  }
};

export default stockController;
