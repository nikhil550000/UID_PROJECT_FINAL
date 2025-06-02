
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_stores table
CREATE TABLE medical_stores (
  store_id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create supplies table (junction table for many-to-many relationship)
CREATE TABLE supplies (
  supply_id SERIAL PRIMARY KEY,
  medicine_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  supply_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE,
  UNIQUE(medicine_id, store_id, supply_date)
);

-- Create indexes for better performance
CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_company ON medicines(company);
CREATE INDEX idx_medicines_expiry ON medicines(date_of_expiry);
CREATE INDEX idx_stores_name ON medical_stores(store_name);
CREATE INDEX idx_stores_location ON medical_stores(location);
CREATE INDEX idx_supplies_medicine ON supplies(medicine_id);
CREATE INDEX idx_supplies_store ON supplies(store_id);
CREATE INDEX idx_supplies_date ON supplies(supply_date);

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
