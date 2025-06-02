
import { z } from 'zod';

// Zod schemas for validation
export const CreateMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required').max(255),
  company: z.string().min(1, 'Company name is required').max(255),
  date_of_manufacture: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  date_of_expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  price: z.number().positive('Price must be positive')
});

export const UpdateMedicineSchema = CreateMedicineSchema.partial();

export const CreateStoreSchema = z.object({
  store_name: z.string().min(1, 'Store name is required').max(255),
  location: z.string().min(1, 'Location is required')
});

export const UpdateStoreSchema = CreateStoreSchema.partial();

export const CreateSupplySchema = z.object({
  medicine_id: z.number().int().positive('Valid medicine ID is required'),
  store_id: z.number().int().positive('Valid store ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  supply_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
});

export const UpdateSupplySchema = CreateSupplySchema.partial();

// TypeScript types
export type CreateMedicineInput = z.infer<typeof CreateMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof UpdateMedicineSchema>;
export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>;
export type CreateSupplyInput = z.infer<typeof CreateSupplySchema>;
export type UpdateSupplyInput = z.infer<typeof UpdateSupplySchema>;

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
  created_at: Date;
  updated_at: Date;
  supplies: Array<{
    supply_id: number;
    store_id: number;
    quantity: number;
    supply_date: Date;
    store: {
      store_id: number;
      store_name: string;
      location: string;
    };
  }>;
}

export interface StoreWithSupplies {
  store_id: number;
  store_name: string;
  location: string;
  created_at: Date;
  updated_at: Date;
  supplies: Array<{
    supply_id: number;
    medicine_id: number;
    quantity: number;
    supply_date: Date;
    medicine: {
      id: number;
      name: string;
      company: string;
      date_of_manufacture: Date;
      date_of_expiry: Date;
      price: number;
    };
  }>;
}
