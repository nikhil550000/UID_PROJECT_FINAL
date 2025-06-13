import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for updating employee permissions
const updatePermissionsSchema = z.object({
  can_manage_medicines: z.boolean().optional(),
  can_manage_stores: z.boolean().optional(),
  can_approve_orders: z.boolean().optional(),
  can_manage_supplies: z.boolean().optional(),
});

export const permissionController = {
  // Get all employee permissions
  getAllEmployeePermissions: async (req: Request, res: Response) => {
    try {
      const employees = await prisma.user.findMany({
        where: {
          role: 'employee'
        },
        include: {
          employee: true
        }
      });

      return res.status(200).json({
        success: true,
        data: employees,
        message: 'Employee permissions retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting employee permissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve employee permissions'
      });
    }
  },

  // Get permissions for a specific employee
  getEmployeePermissions: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const employee = await prisma.user.findUnique({
        where: { 
          id: Number(id),
          role: 'employee'
        },
        include: {
          employee: true
        }
      });

      if (!employee || !employee.employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          message: `Employee with ID ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.employee.department,
          permissions: {
            can_manage_medicines: employee.employee.can_manage_medicines,
            can_manage_stores: employee.employee.can_manage_stores,
            can_approve_orders: employee.employee.can_approve_orders,
            can_manage_supplies: employee.employee.can_manage_supplies
          }
        },
        message: 'Employee permissions retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting employee permissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve employee permissions'
      });
    }
  },

  // Update permissions for an employee (admin only)
  updateEmployeePermissions: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const permissions = updatePermissionsSchema.parse(req.body);
      
      // Verify that the user is an employee
      const employee = await prisma.user.findUnique({
        where: { 
          id: Number(id),
          role: 'employee'
        },
        include: {
          employee: true
        }
      });

      if (!employee || !employee.employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          message: `Employee with ID ${id} not found`
        });
      }

      // Update permissions
      const updatedEmployee = await prisma.employee.update({
        where: { user_id: Number(id) },
        data: permissions
      });

      return res.status(200).json({
        success: true,
        data: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          department: updatedEmployee.department,
          permissions: {
            can_manage_medicines: updatedEmployee.can_manage_medicines,
            can_manage_stores: updatedEmployee.can_manage_stores,
            can_approve_orders: updatedEmployee.can_approve_orders,
            can_manage_supplies: updatedEmployee.can_manage_supplies
          }
        },
        message: 'Employee permissions updated successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors
        });
      }

      console.error('Error updating employee permissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update employee permissions'
      });
    }
  },

  // Check if current user has specific permission
  checkPermission: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { permission } = req.query as { permission: string };
      
      if (!permission) {
        return res.status(400).json({
          success: false,
          error: 'Missing permission parameter',
          message: 'Please specify the permission to check'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          employee: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${userId} not found`
        });
      }

      // Admins have all permissions
      if (user.role === 'admin') {
        return res.status(200).json({
          success: true,
          data: { 
            hasPermission: true,
            isAdmin: true
          },
          message: 'Permission check successful'
        });
      }

      // For employees, check specific permissions
      if (user.role === 'employee' && user.employee) {
        let hasPermission = false;
        
        switch (permission) {
          case 'manage_medicines':
            hasPermission = user.employee.can_manage_medicines;
            break;
          case 'manage_stores':
            hasPermission = user.employee.can_manage_stores;
            break;
          case 'approve_orders':
            hasPermission = user.employee.can_approve_orders;
            break;
          case 'manage_supplies':
            hasPermission = user.employee.can_manage_supplies;
            break;
          default:
            return res.status(400).json({
              success: false,
              error: 'Invalid permission',
              message: `Unknown permission: ${permission}`
            });
        }

        return res.status(200).json({
          success: true,
          data: { 
            hasPermission,
            isAdmin: false
          },
          message: 'Permission check successful'
        });
      }

      // Default: no permission
      return res.status(200).json({
        success: true,
        data: { 
          hasPermission: false,
          isAdmin: false
        },
        message: 'Permission check successful'
      });
    } catch (error) {
      console.error('Error checking permission:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to check permission'
      });
    }
  }
};

export default permissionController;
