-- ================================================================
-- PHARMACEUTICAL MANAGEMENT SYSTEM - NORMALIZED DATABASE SCHEMA
-- ================================================================

-- Create the database (run this separately if needed)
-- CREATE DATABASE pharma_db;
-- \c pharma_db;


-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- TABLE CREATION
-- ================================================================

-- ✅ USERS TABLE (Primary Key: Email, 3NF Compliant)
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    primary_phone VARCHAR(20),
    last_login TIMESTAMP,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ✅ USER PHONE NUMBERS (2NF Fixed - Removed is_primary column)
CREATE TABLE user_phone_numbers (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_type VARCHAR(20) NOT NULL DEFAULT 'secondary',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_phone_user FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    CONSTRAINT unique_user_phone UNIQUE (user_email, phone)
);

-- ✅ ADMINS (Simplified)
CREATE TABLE admins (
    user_email VARCHAR(255) PRIMARY KEY,
    admin_level INTEGER NOT NULL DEFAULT 1,
    department VARCHAR(100),
    appointed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- ✅ EMPLOYEES (3NF Fixed - Removed permission columns)
CREATE TABLE employees (
    user_email VARCHAR(255) PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50),
    join_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    CONSTRAINT fk_employee_user FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- ✅ SUPERVISIONS (2NF Fixed - Removed assigned_at column)
CREATE TABLE supervisions (
    id SERIAL PRIMARY KEY,
    supervisor_email VARCHAR(255) NOT NULL,
    supervisee_email VARCHAR(255) NOT NULL,
    relationship_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    relationship_end TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_supervision_supervisor FOREIGN KEY (supervisor_email) REFERENCES users(email) ON DELETE CASCADE,
    CONSTRAINT fk_supervision_supervisee FOREIGN KEY (supervisee_email) REFERENCES users(email) ON DELETE CASCADE,
    CONSTRAINT unique_supervision UNIQUE (supervisor_email, supervisee_email)
);

-- ✅ MEDICINES (3NF Fixed - Removed price column)
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    date_of_manufacture DATE NOT NULL,
    date_of_expiry DATE NOT NULL,
    dosage_form VARCHAR(100),
    strength VARCHAR(50),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 10,
    last_restocked_quantity INTEGER,
    restocked_at TIMESTAMP,
    restocked_by VARCHAR(255),
    stock_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_medicine_batch UNIQUE (name, company, batch_number)
);

-- ✅ MEDICAL STORES (3NF Fixed - Removed pin_code column)
CREATE TABLE medical_stores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ✅ SUPPLIES (2NF Fixed - Removed unique constraint and modified structure)
CREATE TABLE supplies (
    supply_id SERIAL PRIMARY KEY,
    medicine_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    supply_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    batch_info VARCHAR(255),
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_supply_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    CONSTRAINT fk_supply_store FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE,
    CONSTRAINT fk_supply_user FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- ✅ ORDERS (Updated with email references)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    medicine_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    requester_email VARCHAR(255),
    approver_email VARCHAR(255),
    quantity INTEGER NOT NULL,
    requested_price DECIMAL(10, 2),
    approved_price DECIMAL(10, 2),
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    notes TEXT,
    approved_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_store FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_approver FOREIGN KEY (approver_email) REFERENCES users(email),
    CONSTRAINT fk_order_requester FOREIGN KEY (requester_email) REFERENCES users(email)
);

-- ✅ MEDICINE PRICING (New table for 3NF compliance)
CREATE TABLE medicine_pricing (
    id SERIAL PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    price_type VARCHAR(50) NOT NULL DEFAULT 'standard',
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_medicine_pricing UNIQUE (medicine_name, company, effective_date)
);

-- ✅ SYSTEM PERMISSIONS (Replaces department permissions)
CREATE TABLE system_permissions (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    permission_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_role_dept_permission UNIQUE (role, department, permission_type)
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Users table indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Medicine table indexes
CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_company ON medicines(company);
CREATE INDEX idx_medicines_expiry ON medicines(date_of_expiry);

-- Medical stores indexes
CREATE INDEX idx_stores_name ON medical_stores(store_name);
CREATE INDEX idx_stores_city_state ON medical_stores(city, state);

-- Supply table indexes
CREATE INDEX idx_supplies_medicine ON supplies(medicine_id);
CREATE INDEX idx_supplies_store ON supplies(store_id);
CREATE INDEX idx_supplies_user ON supplies(user_email);
CREATE INDEX idx_supplies_date ON supplies(supply_date);

-- Order table indexes
CREATE INDEX idx_orders_medicine ON orders(medicine_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_approver ON orders(approver_email);
CREATE INDEX idx_orders_requester ON orders(requester_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Medicine pricing indexes
CREATE INDEX idx_pricing_medicine_company ON medicine_pricing(medicine_name, company);
CREATE INDEX idx_pricing_effective_date ON medicine_pricing(effective_date);

-- System permissions indexes
CREATE INDEX idx_permissions_role ON system_permissions(role);
CREATE INDEX idx_permissions_department ON system_permissions(department);

-- ================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ================================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
    BEFORE UPDATE ON medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_stores_updated_at
    BEFORE UPDATE ON medical_stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- CHECK CONSTRAINTS FOR DATA INTEGRITY
-- ================================================================

-- User role validation
ALTER TABLE users ADD CONSTRAINT check_user_role 
    CHECK (role IN ('admin', 'employee', 'manager', 'pharmacist', 'doctor'));

-- Medicine stock validation
ALTER TABLE medicines ADD CONSTRAINT check_stock_positive 
    CHECK (stock_quantity >= 0 AND minimum_stock >= 0);

-- Medicine dates validation
ALTER TABLE medicines ADD CONSTRAINT check_medicine_dates 
    CHECK (date_of_expiry > date_of_manufacture);

-- Supply quantity validation
ALTER TABLE supplies ADD CONSTRAINT check_supply_quantity 
    CHECK (quantity > 0);

-- Supply amount validation
ALTER TABLE supplies ADD CONSTRAINT check_supply_amounts 
    CHECK (unit_price > 0 AND total_amount > 0);

-- Order quantity validation
ALTER TABLE orders ADD CONSTRAINT check_order_quantity 
    CHECK (quantity > 0);

-- Order status validation
ALTER TABLE orders ADD CONSTRAINT check_order_status 
    CHECK (status IN ('pending', 'approved', 'rejected', 'delivered', 'cancelled'));

-- Order priority validation
ALTER TABLE orders ADD CONSTRAINT check_order_priority 
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Medicine pricing validation
ALTER TABLE medicine_pricing ADD CONSTRAINT check_pricing_positive 
    CHECK (current_price > 0);

-- Admin level validation
ALTER TABLE admins ADD CONSTRAINT check_admin_level 
    CHECK (admin_level >= 1 AND admin_level <= 5);

-- Employee salary validation
ALTER TABLE employees ADD CONSTRAINT check_salary_positive 
    CHECK (salary IS NULL OR salary > 0);

-- Phone type validation
ALTER TABLE user_phone_numbers ADD CONSTRAINT check_phone_type 
    CHECK (phone_type IN ('primary', 'secondary', 'emergency', 'work', 'home'));

-- ================================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================================

-- Table comments
COMMENT ON TABLE users IS 'Main users table with email as primary key (3NF compliant)';
COMMENT ON TABLE user_phone_numbers IS 'User phone numbers with type classification (2NF fixed)';
COMMENT ON TABLE admins IS 'Admin-specific information linked to users';
COMMENT ON TABLE employees IS 'Employee-specific information without embedded permissions (3NF compliant)';
COMMENT ON TABLE supervisions IS 'User supervision relationships (2NF fixed)';
COMMENT ON TABLE medicines IS 'Medicine inventory without pricing (3NF compliant)';
COMMENT ON TABLE medical_stores IS 'Medical store information without pin_code (3NF compliant)';
COMMENT ON TABLE supplies IS 'Supply records with pricing at time of supply (2NF fixed)';
COMMENT ON TABLE orders IS 'Order requests and approvals using email references';
COMMENT ON TABLE medicine_pricing IS 'Separate pricing table for medicines (3NF compliance)';
COMMENT ON TABLE system_permissions IS 'Role and department-based permission system';

-- Column comments
COMMENT ON COLUMN users.email IS 'Primary key - user email address';
COMMENT ON COLUMN users.role IS 'User role: admin, employee, manager, pharmacist, doctor';
COMMENT ON COLUMN users.primary_phone IS 'Primary contact phone number';
COMMENT ON COLUMN medicines.stock_quantity IS 'Current stock quantity';
COMMENT ON COLUMN medicines.minimum_stock IS 'Minimum stock threshold for reordering';
COMMENT ON COLUMN supplies.total_amount IS 'Calculated total: quantity * unit_price';
COMMENT ON COLUMN medicine_pricing.price_type IS 'Type: standard, bulk, promotional';
COMMENT ON COLUMN system_permissions.permission_type IS 'Permission: manage_medicines, approve_orders, etc.';

-- ================================================================
-- END OF SCHEMA
-- ================================================================
