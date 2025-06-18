
import { z } from 'zod';

// Express Request interface extension for auth middleware
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

// Zod schemas for validation
export const CreateMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required').max(255),
  company: z.string().min(1, 'Company name is required').max(255),
  batch_number: z.string().optional(),
  date_of_manufacture: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  date_of_expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  dosage_form: z.string().optional(),
  strength: z.string().optional(),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative').optional(),
  minimum_stock: z.number().int().min(0, 'Minimum stock cannot be negative').optional()
});

export const UpdateMedicineSchema = CreateMedicineSchema.partial();

export const CreateStoreSchema = z.object({
  store_name: z.string().min(1, 'Store name is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  street_address: z.string().min(1, 'Street address is required').max(255),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  license_number: z.string().optional()
});

export const UpdateStoreSchema = CreateStoreSchema.partial();

export const CreateSupplySchema = z.object({
  medicine_id: z.number().int().positive('Valid medicine ID is required'),
  store_id: z.number().int().positive('Valid store ID is required'),
  user_email: z.string().email('Valid user email is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  supply_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  unit_price: z.number().positive('Unit price must be positive'),
  batch_info: z.string().optional(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  notes: z.string().optional(),
  status: z.string().optional()
});

export const UpdateSupplySchema = CreateSupplySchema.partial();

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'employee']).optional(),
  primary_phone: z.string().optional(),
  is_active: z.boolean().optional()
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const CreateOrderSchema = z.object({
  medicine_id: z.number().int().positive('Valid medicine ID is required'),
  store_id: z.number().int().positive('Valid store ID is required'),
  requester_email: z.string().email().optional(),
  quantity: z.number().int().positive('Quantity must be positive'),
  requested_price: z.number().positive().optional(),
  priority: z.enum(['normal', 'urgent', 'emergency']).optional(),
  notes: z.string().optional()
});

export const UpdateOrderSchema = CreateOrderSchema.partial();

export const CreateMedicinePricingSchema = z.object({
  medicine_name: z.string().min(1, 'Medicine name is required'),
  company: z.string().min(1, 'Company name is required'),
  current_price: z.number().positive('Price must be positive'),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  price_type: z.enum(['standard', 'bulk', 'promotional']).optional(),
  created_by: z.string().email('Valid creator email is required')
});

export const CreateEmployeeSchema = z.object({
  user_email: z.string().email('Valid user email is required'),
  department: z.string().min(1, 'Department is required'),
  employee_id: z.string().optional(),
  join_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  salary: z.number().positive().optional()
});

export const CreateAdminSchema = z.object({
  user_email: z.string().email('Valid user email is required'),
  admin_level: z.number().int().min(1).max(5).optional(),
  department: z.string().optional(),
  appointed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional()
});

// TypeScript types
export type CreateMedicineInput = z.infer<typeof CreateMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof UpdateMedicineSchema>;
export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>;
export type CreateSupplyInput = z.infer<typeof CreateSupplySchema>;
export type UpdateSupplyInput = z.infer<typeof UpdateSupplySchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type CreateMedicinePricingInput = z.infer<typeof CreateMedicinePricingSchema>;
export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MedicineWithSupplies {
  id: number;
  name: string;
  company: string;
  date_of_manufacture: Date;
  date_of_expiry: Date;
  price: number;
  stock_quantity: number;
  minimum_stock: number;
  created_at: Date;
  updated_at: Date;
  supplies: Array<{
    supply_id: number;
    store_id: number;
    user_id: number;
    quantity: number;
    supply_date: Date;
    status: string;
    store: {
      store_id: number;
      store_name: string;
      city: string;
      state: string;
      pin_code: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
}

export interface StoreWithSupplies {
  store_id: number;
  store_name: string;
  city: string;
  state: string;
  pin_code: string;
  created_at: Date;
  updated_at: Date;
  supplies: Array<{
    supply_id: number;
    medicine_id: number;
    user_id: number;
    quantity: number;
    supply_date: Date;
    status: string;
    medicine: {
      id: number;
      name: string;
      company: string;
      date_of_manufacture: Date;
      date_of_expiry: Date;
      price: number;
      stock_quantity: number;
      minimum_stock: number;
    };
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
}
