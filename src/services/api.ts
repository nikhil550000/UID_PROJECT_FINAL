// API service for pharmaceutical management system
const API_BASE_URL = 'http://localhost:5001/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Medicine interfaces
interface Medicine {
  id: number;
  name: string;
  company: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

interface CreateMedicineInput {
  name: string;
  company: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  price: number;
}

// Store interfaces
interface MedicalStore {
  store_id: number;
  store_name: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateStoreInput {
  store_name: string;
  location: string;
}

// Supply interfaces
interface Supply {
  supply_id: number;
  medicine_id: number;
  store_id: number;
  quantity: number;
  supply_date: string;
  created_at?: string;
  updated_at?: string;
  medicine?: Medicine;
  store?: MedicalStore;
}

interface CreateSupplyInput {
  medicine_id: number;
  store_id: number;
  quantity: number;
  supply_date: string;
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

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

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

// Export types
export type {
  Medicine,
  CreateMedicineInput,
  MedicalStore,
  CreateStoreInput,
  Supply,
  CreateSupplyInput,
  User,
  CreateUserInput,
  UpdateUserInput,
  ApiResponse,
};
