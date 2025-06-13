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
  can_manage_medicines: boolean;
  can_manage_stores: boolean;
  can_approve_orders: boolean;
  can_manage_supplies: boolean;
}

interface Admin {
  admin_level: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  employee?: Employee;
  admin?: Admin;
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
  date_of_manufacture: string;
  date_of_expiry: string;
  price: number;
  stock_quantity: number;
  minimum_stock: number;
  last_restocked_quantity?: number;
  restocked_at?: string;
  restocked_by?: number;
  stock_notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateMedicineInput {
  name: string;
  company: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  price: number;
  stock_quantity?: number;
  minimum_stock?: number;
}

// Store interfaces
interface MedicalStore {
  store_id: number;
  store_name: string;
  city: string;
  state: string;
  pin_code: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateStoreInput {
  store_name: string;
  city: string;
  state: string;
  pin_code: string;
}

// Supply interfaces
interface Supply {
  supply_id: number;
  medicine_id: number;
  store_id: number;
  user_id: number;
  quantity: number;
  supply_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  medicine?: Medicine;
  store?: MedicalStore;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface CreateSupplyInput {
  medicine_id: number;
  store_id: number;
  user_id: number;
  quantity: number;
  supply_date: string;
  status?: string;
}

// Order interfaces
interface Order {
  order_id: number;
  medicine_id: number;
  store_id: number;
  requester_id: number | null;
  approver_id?: number | null;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  notes?: string | null;
  order_date: string;
  approved_at?: string | null;
  delivered_at?: string | null;
  created_at?: string;
  updated_at?: string;
  medicine?: Medicine;
  store?: MedicalStore;
  requester?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  approver?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface CreateOrderInput {
  medicine_id: number;
  store_id: number;
  quantity: number;
  notes?: string;
}

interface ProcessOrderInput {
  approver_id: number;
  notes?: string;
}

// User interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
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
  
  getById: (id: number) => apiRequest<User>(`/users/${id}`),
  
  create: (data: CreateUserInput) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: UpdateUserInput) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
  
  toggleStatus: (id: number) =>
    apiRequest<User>(`/users/${id}/toggle-status`, {
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
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
};
