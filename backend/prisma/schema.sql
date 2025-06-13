
-- PostgreSQL Schema for Pharmaceutical Company Database
-- Run this if you want to create tables manually instead of using Prisma

-- Create medicines table
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  date_of_manufacture DATE NOT NULL,
  date_of_expiry DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  minimum_stock INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_stores table with composite attribute (location split into city, state, pin_code)
CREATE TABLE medical_stores (
  store_id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (base entity for specialization)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multivalued attribute: User phone numbers
CREATE TABLE user_phone_numbers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, phone)
);

-- Specialization: Admins
CREATE TABLE admins (
  user_id INTEGER PRIMARY KEY,
  admin_level INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Specialization: Employees
CREATE TABLE employees (
  user_id INTEGER PRIMARY KEY,
  department VARCHAR(100) NOT NULL,
  can_manage_medicines BOOLEAN NOT NULL DEFAULT FALSE,
  can_manage_stores BOOLEAN NOT NULL DEFAULT FALSE,
  can_approve_orders BOOLEAN NOT NULL DEFAULT FALSE,
  can_manage_supplies BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Unary relationship: Admin supervises employees
CREATE TABLE supervisions (
  id SERIAL PRIMARY KEY,
  supervisor_id INTEGER NOT NULL,
  supervisee_id INTEGER NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (supervisee_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(supervisor_id, supervisee_id)
);

-- Create supplies table (ternary relationship between medicine, store, and user)
CREATE TABLE supplies (
  supply_id SERIAL PRIMARY KEY,
  medicine_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  supply_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(medicine_id, store_id, supply_date)
);

-- Create orders table for approval workflow
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  medicine_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  requester_id INTEGER NULL,
  approver_id INTEGER NULL,
  quantity INTEGER NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT NULL,
  approved_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_company ON medicines(company);
CREATE INDEX idx_medicines_expiry ON medicines(date_of_expiry);

CREATE INDEX idx_stores_name ON medical_stores(store_name);
CREATE INDEX idx_stores_city ON medical_stores(city);
CREATE INDEX idx_stores_state ON medical_stores(state);
CREATE INDEX idx_stores_pin ON medical_stores(pin_code);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_supplies_medicine ON supplies(medicine_id);
CREATE INDEX idx_supplies_store ON supplies(store_id);
CREATE INDEX idx_supplies_user ON supplies(user_id);
CREATE INDEX idx_supplies_date ON supplies(supply_date);

CREATE INDEX idx_orders_medicine ON orders(medicine_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_requester ON orders(requester_id);
CREATE INDEX idx_orders_approver ON orders(approver_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at updates
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_stores_updated_at BEFORE UPDATE ON medical_stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create stock update tracking table
CREATE TABLE stock_updates (
  update_id SERIAL PRIMARY KEY,
  medicine_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL,
  reference_id INTEGER NULL,
  notes TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for stock_updates
CREATE INDEX idx_stock_updates_medicine ON stock_updates(medicine_id);
CREATE INDEX idx_stock_updates_user ON stock_updates(user_id);
CREATE INDEX idx_stock_updates_date ON stock_updates(updated_at);
