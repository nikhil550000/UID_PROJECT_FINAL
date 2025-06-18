// API service for pharmaceutical management system
const API_BASE_URL = 'http://localhost:5001/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication interfaces
interface Employee {
  department: string;
  employee_id: string;
  join_date: string;
  salary?: number;
}

interface Admin {
  admin_level: number;
  department: string;
  appointed_at?: string;
}

interface User {
  email: string;
  name: string;
  role: string;
  primary_phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  employee?: Employee;
  admin?: Admin;
  phone_numbers?: Array<{
    phone: string;
    phone_type: string;
  }>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Medicine interfaces
interface Medicine {
  id: number;
  name: string;
  company: string;
  batch_number?: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  dosage_form?: string;
  strength?: string;
  stock_quantity: number;
  minimum_stock: number;
  last_restocked_quantity?: number;
  restocked_at?: string;
  restocked_by?: string;
  stock_notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateMedicineInput {
  name: string;
  company: string;
  batch_number?: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  dosage_form?: string;
  strength?: string;
  stock_quantity?: number;
  minimum_stock?: number;
}

// Store interfaces
interface MedicalStore {
  store_id: number;
  store_name: string;
  city: string;
  state: string;
  street_address: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  license_number?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreateStoreInput {
  store_name: string;
  city: string;
  state: string;
  street_address: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  license_number?: string;
}

// Supply interfaces
interface Supply {
  supply_id: number;
  medicine_id: number;
  store_id: number;
  user_email: string;
  quantity: number;
  supply_date: string;
  status: string;
  unit_price: number;
  total_amount: number;
  batch_info?: string;
  expiry_date?: string;
  notes?: string;
  created_at?: string;
  medicine?: Medicine;
  store?: MedicalStore;
  user?: {
    email: string;
    name: string;
    role: string;
  };
}

interface CreateSupplyInput {
  medicine_id: number;
  store_id: number;
  user_email: string;
  quantity: number;
  supply_date: string;
  unit_price: number;
  batch_info?: string;
  expiry_date?: string;
  notes?: string;
  status?: string;
}

// Order interfaces
interface Order {
  order_id: number;
  medicine_id: number;
  store_id: number;
  requester_email: string | null;
  approver_email?: string | null;
  quantity: number;
  requested_price?: number;
  approved_price?: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  priority?: string;
  notes?: string | null;
  order_date: string;
  approved_at?: string | null;
  delivered_at?: string | null;
  created_at?: string;
  medicine?: Medicine;
  store?: MedicalStore;
  requester?: {
    name: string;
    email: string;
    role: string;
  };
  approver?: {
    name: string;
    email: string;
    role: string;
  };
}

interface CreateOrderInput {
  medicine_id: number;
  store_id: number;
  quantity: number;
  requested_price?: number;
  priority?: string;
  notes?: string;
}

interface ProcessOrderInput {
  approver_email: string;
  approved_price?: number;
  notes?: string;
}

// User management interfaces
interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  primary_phone?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  primary_phone?: string;
  is_active?: boolean;
}

// Analytics interfaces
interface DashboardStats {
  counts: {
    medicines: number;
    stores: number;
    users: number;
    supplies: number;
    orders: number;
    lowStock: number;
    expiringMedicines: number;
    pendingOrders: number;
  };
  values: {
    totalInventoryValue: number;
    currency: string;
  };
  trends: {
    monthly: Array<{
      month: string;
      year: string;
      order_count: string;
      supply_count: string;
      total_order_value: string;
      total_supply_value: string;
    }>;
  };
}

interface MedicineCategory {
  company: string;
  count: number;
  totalValue: number;
  totalStock: number;
}

interface SupplyTrend {
  month: number;
  year: number;
  supplyCount: number;
  totalQuantity: number;
  totalValue: number;
}

interface OrderAnalytics {
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: number;
    year: number;
    totalOrders: number;
    approved: number;
    rejected: number;
    pending: number;
  }>;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    // Return the parsed response regardless of status
    // Let the calling code handle success/error based on data.success
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    // Return a standardized error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
}

// Authentication API functions
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (data: RegisterData) =>
    apiRequest<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Medicine API functions
export const medicineApi = {
  getAll: () => apiRequest<Medicine[]>('/medicines'),
  
  getById: (id: number) => apiRequest<Medicine>(`/medicines/${id}`),
  
  create: (data: CreateMedicineInput) => 
    apiRequest<Medicine>('/medicines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<CreateMedicineInput>) =>
    apiRequest<Medicine>(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/medicines/${id}`, {
      method: 'DELETE',
    }),
};

// Store API functions
export const storeApi = {
  getAll: () => apiRequest<MedicalStore[]>('/stores'),
  
  getById: (id: number) => apiRequest<MedicalStore>(`/stores/${id}`),
  
  create: (data: CreateStoreInput) =>
    apiRequest<MedicalStore>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<CreateStoreInput>) =>
    apiRequest<MedicalStore>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/stores/${id}`, {
      method: 'DELETE',
    }),
};

// Supply API functions
export const supplyApi = {
  getAll: () => apiRequest<Supply[]>('/supplies'),
  
  getById: (id: number) => apiRequest<Supply>(`/supplies/${id}`),
  
  create: (data: CreateSupplyInput) =>
    apiRequest<Supply>('/supplies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<CreateSupplyInput>) =>
    apiRequest<Supply>(`/supplies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) =>
    apiRequest(`/supplies/${id}`, {
      method: 'DELETE',
    }),
};

// Order API functions
export const orderApi = {
  getAll: () => apiRequest<Order[]>('/orders'),
  
  getPending: () => apiRequest<Order[]>('/orders/pending'),
  
  getById: (id: number) => apiRequest<Order>(`/orders/${id}`),
  
  create: (data: CreateOrderInput) =>
    apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  approve: (id: number, data: ProcessOrderInput) =>
    apiRequest<Order>(`/orders/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  reject: (id: number, data: ProcessOrderInput) =>
    apiRequest<Order>(`/orders/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  markDelivered: (id: number) =>
    apiRequest<Order>(`/orders/${id}/deliver`, {
      method: 'PUT',
    }),
};

// User API functions
export const userApi = {
  getAll: () => apiRequest<User[]>('/users'),
  
  getByEmail: (email: string) => apiRequest<User>(`/users/${email}`),
  
  create: (data: CreateUserInput) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (email: string, data: UpdateUserInput) =>
    apiRequest<User>(`/users/${email}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (email: string) =>
    apiRequest(`/users/${email}`, {
      method: 'DELETE',
    }),
  
  toggleStatus: (email: string) =>
    apiRequest<User>(`/users/${email}/toggle-status`, {
      method: 'PATCH',
    }),
};

// Stock Management API functions
export const stockApi = {
  getMedicineStockInfo: (id: number) => 
    apiRequest<Medicine & { restockedByUser?: User }>(`/stock/medicine/${id}/info`),
  
  getLowStockMedicines: () => 
    apiRequest<Medicine[]>('/stock/low-stock'),
  
  getInventoryStatus: (params?: { minimum_stock?: boolean; expired?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.minimum_stock) queryParams.append('minimum_stock', 'true');
    if (params?.expired) queryParams.append('expired', 'true');
    
    const queryString = queryParams.toString();
    return apiRequest<Medicine[]>(`/stock/inventory${queryString ? `?${queryString}` : ''}`);
  },
  
  updateStock: (data: {
    medicine_id: number;
    user_id: number;
    quantity_change: number;
    reason: string;
    notes?: string;
    reference_id?: number;
  }) =>
    apiRequest<{ medicine: Medicine }>('/stock/update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Analytics API functions
export const analyticsApi = {
  getDashboardStats: () => apiRequest<DashboardStats>('/analytics/dashboard'),
  
  getMedicineCategories: () => apiRequest<MedicineCategory[]>('/analytics/medicines/categories'),
  
  getSupplyTrends: () => apiRequest<SupplyTrend[]>('/analytics/supplies/trends'),
  
  getOrderAnalytics: () => apiRequest<OrderAnalytics>('/analytics/orders/analytics'),
};

// Export types
export type {
  Medicine,
  CreateMedicineInput,
  MedicalStore,
  CreateStoreInput,
  Supply,
  CreateSupplyInput,
  Order,
  CreateOrderInput,
  ProcessOrderInput,
  User,
  Employee,
  Admin,
  CreateUserInput,
  UpdateUserInput,
  DashboardStats,
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
};
