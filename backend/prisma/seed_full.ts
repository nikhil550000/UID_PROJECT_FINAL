import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding with normalized schema...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.order.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.systemPermission.deleteMany();
  await prisma.medicinePricing.deleteMany();
  await prisma.supervision.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.userPhoneNumber.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.medicalStore.deleteMany();
  await prisma.user.deleteMany();

  // Reset ID sequences
  await prisma.$executeRaw`ALTER SEQUENCE medicines_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE medical_stores_store_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE supplies_supply_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE orders_order_id_seq RESTART WITH 1`;

  // 1. Create System Permissions
  console.log('🔐 Creating system permissions...');
  const permissions = [
    { role: 'admin', department: 'All', permission_type: 'manage_medicines', is_granted: true },
    { role: 'admin', department: 'All', permission_type: 'approve_orders', is_granted: true },
    { role: 'admin', department: 'All', permission_type: 'manage_supplies', is_granted: true },
    { role: 'admin', department: 'All', permission_type: 'manage_stores', is_granted: true },
    { role: 'admin', department: 'All', permission_type: 'view_analytics', is_granted: true },
    
    { role: 'employee', department: 'Pharmacy', permission_type: 'manage_medicines', is_granted: true },
    { role: 'employee', department: 'Pharmacy', permission_type: 'approve_orders', is_granted: true },
    { role: 'employee', department: 'Pharmacy', permission_type: 'manage_supplies', is_granted: true },
    { role: 'employee', department: 'Pharmacy', permission_type: 'view_analytics', is_granted: false },
    
    { role: 'employee', department: 'Sales', permission_type: 'manage_medicines', is_granted: false },
    { role: 'employee', department: 'Sales', permission_type: 'approve_orders', is_granted: false },
    { role: 'employee', department: 'Sales', permission_type: 'manage_stores', is_granted: true },
    { role: 'employee', department: 'Sales', permission_type: 'view_analytics', is_granted: true },
    
    { role: 'employee', department: 'Inventory', permission_type: 'manage_medicines', is_granted: true },
    { role: 'employee', department: 'Inventory', permission_type: 'manage_supplies', is_granted: true },
    { role: 'employee', department: 'Inventory', permission_type: 'approve_orders', is_granted: false },
  ];

  for (const permission of permissions) {
    await prisma.systemPermission.create({ data: permission });
  }

  // 2. Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin' as const,
      primary_phone: '+1555000001',
      is_active: true
    },
    {
      name: 'Dr. Smith',
      email: 'dr.smith@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000002',
      is_active: true
    },
    {
      name: 'Pharmacy Manager',
      email: 'pharmacy.manager@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000003',
      is_active: true
    },
    {
      name: 'Inventory Clerk',
      email: 'inventory.clerk@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000004',
      is_active: true
    },
    {
      name: 'Sales Representative',
      email: 'sales.rep@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000005',
      is_active: true
    },
    {
      name: 'Lab Technician',
      email: 'lab.tech@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000006',
      is_active: true
    },
    {
      name: 'Quality Assurance',
      email: 'qa@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000007',
      is_active: true
    },
    {
      name: 'Warehouse Manager',
      email: 'warehouse@pharma.com',
      password_hash: hashedPassword,
      role: 'employee' as const,
      primary_phone: '+1555000008',
      is_active: true
    }
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // 3. Create Medical Stores
  console.log('🏥 Creating medical stores...');
  const stores = [
    {
      store_name: 'Central Pharmacy',
      city: 'New York',
      state: 'New York',
      street_address: '123 Main Street, New York, NY 10001',
      contact_person: 'Alice Johnson',
      phone: '+1555001001',
      email: 'central@pharmacy.com',
      license_number: 'LIC001NY',
      is_active: true
    },
    {
      store_name: 'Health Plus Store',
      city: 'Los Angeles',
      state: 'California',
      street_address: '456 Sunset Blvd, Los Angeles, CA 90210',
      contact_person: 'Bob Wilson',
      phone: '+1555001002',
      email: 'healthplus@pharmacy.com',
      license_number: 'LIC002CA',
      is_active: true
    },
    {
      store_name: 'Community Care Pharmacy',
      city: 'Chicago',
      state: 'Illinois',
      street_address: '789 Michigan Ave, Chicago, IL 60601',
      contact_person: 'Carol Davis',
      phone: '+1555001003',
      email: 'community@pharmacy.com',
      license_number: 'LIC003IL',
      is_active: true
    },
    {
      store_name: 'MediCare Plus',
      city: 'Houston',
      state: 'Texas',
      street_address: '321 Texas Ave, Houston, TX 77001',
      contact_person: 'David Brown',
      phone: '+1555001004',
      email: 'medicare@pharmacy.com',
      license_number: 'LIC004TX',
      is_active: true
    },
    {
      store_name: 'Wellness Pharmacy',
      city: 'Phoenix',
      state: 'Arizona',
      street_address: '654 Desert Road, Phoenix, AZ 85001',
      contact_person: 'Eva Martinez',
      phone: '+1555001005',
      email: 'wellness@pharmacy.com',
      license_number: 'LIC005AZ',
      is_active: true
    },
    {
      store_name: 'Metro Medical',
      city: 'Seattle',
      state: 'Washington',
      street_address: '987 Pine Street, Seattle, WA 98101',
      contact_person: 'Frank Miller',
      phone: '+1555001006',
      email: 'metro@pharmacy.com',
      license_number: 'LIC006WA',
      is_active: true
    },
    {
      store_name: 'Downtown Pharmacy',
      city: 'Miami',
      state: 'Florida',
      street_address: '159 Ocean Drive, Miami, FL 33101',
      contact_person: 'Grace Chen',
      phone: '+1555001007',
      email: 'downtown@pharmacy.com',
      license_number: 'LIC007FL',
      is_active: true
    },
    {
      store_name: 'University Health Center',
      city: 'Boston',
      state: 'Massachusetts',
      street_address: '753 Harvard Ave, Boston, MA 02101',
      contact_person: 'Henry Davis',
      phone: '+1555001008',
      email: 'university@pharmacy.com',
      license_number: 'LIC008MA',
      is_active: true
    }
  ];

  for (const store of stores) {
    await prisma.medicalStore.create({ data: store });
  }

  // 4. Create Comprehensive Medicine Inventory
  console.log('💊 Creating extensive medicine inventory...');
  const medicines = [
    // Pain Relief & Anti-inflammatory
    { name: 'Paracetamol', company: 'Sun Pharma', batch_number: 'PAR001', date_of_manufacture: '2024-01-15', date_of_expiry: '2026-01-15', dosage_form: 'Tablet', strength: '500mg', stock_quantity: 2500, minimum_stock: 250, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Ibuprofen', company: 'Johnson & Johnson', batch_number: 'IBU001', date_of_manufacture: '2024-01-20', date_of_expiry: '2026-01-20', dosage_form: 'Tablet', strength: '400mg', stock_quantity: 2000, minimum_stock: 200, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Aspirin', company: 'Bayer', batch_number: 'ASP001', date_of_manufacture: '2024-01-10', date_of_expiry: '2026-01-10', dosage_form: 'Tablet', strength: '75mg', stock_quantity: 3000, minimum_stock: 300, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Diclofenac', company: 'Novartis', batch_number: 'DIC001', date_of_manufacture: '2024-02-05', date_of_expiry: '2026-02-05', dosage_form: 'Tablet', strength: '50mg', stock_quantity: 1500, minimum_stock: 150, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Naproxen', company: 'Roche', batch_number: 'NAP001', date_of_manufacture: '2024-02-10', date_of_expiry: '2026-02-10', dosage_form: 'Tablet', strength: '250mg', stock_quantity: 1200, minimum_stock: 120, restocked_by: 'pharmacy.manager@pharma.com' },

    // Antibiotics
    { name: 'Amoxicillin', company: 'Cipla', batch_number: 'AMX001', date_of_manufacture: '2024-02-01', date_of_expiry: '2026-02-01', dosage_form: 'Capsule', strength: '250mg', stock_quantity: 1800, minimum_stock: 180, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Azithromycin', company: 'Pfizer', batch_number: 'AZI001', date_of_manufacture: '2024-02-15', date_of_expiry: '2026-02-15', dosage_form: 'Tablet', strength: '500mg', stock_quantity: 1000, minimum_stock: 100, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Ciprofloxacin', company: 'Teva', batch_number: 'CIP001', date_of_manufacture: '2024-03-01', date_of_expiry: '2026-03-01', dosage_form: 'Tablet', strength: '500mg', stock_quantity: 900, minimum_stock: 90, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Doxycycline', company: 'GSK', batch_number: 'DOX001', date_of_manufacture: '2024-03-05', date_of_expiry: '2026-03-05', dosage_form: 'Capsule', strength: '100mg', stock_quantity: 800, minimum_stock: 80, restocked_by: 'pharmacy.manager@pharma.com' },

    // Cardiovascular
    { name: 'Atorvastatin', company: 'Lipitor', batch_number: 'ATO001', date_of_manufacture: '2024-03-10', date_of_expiry: '2025-03-10', dosage_form: 'Tablet', strength: '10mg', stock_quantity: 1600, minimum_stock: 160, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Simvastatin', company: 'Merck', batch_number: 'SIM001', date_of_manufacture: '2024-01-30', date_of_expiry: '2025-01-30', dosage_form: 'Tablet', strength: '20mg', stock_quantity: 1400, minimum_stock: 140, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Amlodipine', company: 'Pfizer', batch_number: 'AML001', date_of_manufacture: '2024-01-25', date_of_expiry: '2026-01-25', dosage_form: 'Tablet', strength: '5mg', stock_quantity: 1750, minimum_stock: 175, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Losartan', company: 'Merck', batch_number: 'LOS001', date_of_manufacture: '2024-02-20', date_of_expiry: '2026-02-20', dosage_form: 'Tablet', strength: '50mg', stock_quantity: 1350, minimum_stock: 135, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Metoprolol', company: 'AstraZeneca', batch_number: 'MET001', date_of_manufacture: '2024-03-15', date_of_expiry: '2026-03-15', dosage_form: 'Tablet', strength: '25mg', stock_quantity: 1100, minimum_stock: 110, restocked_by: 'pharmacy.manager@pharma.com' },

    // Diabetes
    { name: 'Metformin', company: 'Teva', batch_number: 'MET002', date_of_manufacture: '2024-02-15', date_of_expiry: '2026-02-15', dosage_form: 'Tablet', strength: '500mg', stock_quantity: 2200, minimum_stock: 220, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Insulin Glargine', company: 'Novo Nordisk', batch_number: 'INS001', date_of_manufacture: '2024-03-01', date_of_expiry: '2025-03-01', dosage_form: 'Injection', strength: '100 units/ml', stock_quantity: 500, minimum_stock: 100, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Glimepiride', company: 'Sanofi', batch_number: 'GLI001', date_of_manufacture: '2024-02-25', date_of_expiry: '2026-02-25', dosage_form: 'Tablet', strength: '2mg', stock_quantity: 900, minimum_stock: 90, restocked_by: 'pharmacy.manager@pharma.com' },

    // Gastrointestinal
    { name: 'Omeprazole', company: 'AstraZeneca', batch_number: 'OME001', date_of_manufacture: '2024-03-05', date_of_expiry: '2026-03-05', dosage_form: 'Capsule', strength: '20mg', stock_quantity: 1800, minimum_stock: 180, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Pantoprazole', company: 'Wyeth', batch_number: 'PAN001', date_of_manufacture: '2024-02-28', date_of_expiry: '2026-02-28', dosage_form: 'Tablet', strength: '40mg', stock_quantity: 1300, minimum_stock: 130, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Domperidone', company: 'Cipla', batch_number: 'DOM001', date_of_manufacture: '2024-03-10', date_of_expiry: '2026-03-10', dosage_form: 'Tablet', strength: '10mg', stock_quantity: 1000, minimum_stock: 100, restocked_by: 'pharmacy.manager@pharma.com' },

    // Respiratory
    { name: 'Salbutamol', company: 'GSK', batch_number: 'SAL001', date_of_manufacture: '2024-02-12', date_of_expiry: '2026-02-12', dosage_form: 'Inhaler', strength: '100mcg', stock_quantity: 600, minimum_stock: 60, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Montelukast', company: 'Merck', batch_number: 'MON001', date_of_manufacture: '2024-03-08', date_of_expiry: '2026-03-08', dosage_form: 'Tablet', strength: '10mg', stock_quantity: 800, minimum_stock: 80, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Cetirizine', company: 'UCB', batch_number: 'CET001', date_of_manufacture: '2024-01-18', date_of_expiry: '2026-01-18', dosage_form: 'Tablet', strength: '10mg', stock_quantity: 1500, minimum_stock: 150, restocked_by: 'inventory.clerk@pharma.com' },

    // Neurological
    { name: 'Gabapentin', company: 'Neurontin', batch_number: 'GAB001', date_of_manufacture: '2024-01-05', date_of_expiry: '2026-01-05', dosage_form: 'Capsule', strength: '300mg', stock_quantity: 1200, minimum_stock: 120, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Pregabalin', company: 'Pfizer', batch_number: 'PRE001', date_of_manufacture: '2024-02-08', date_of_expiry: '2026-02-08', dosage_form: 'Capsule', strength: '75mg', stock_quantity: 700, minimum_stock: 70, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Levetiracetam', company: 'UCB', batch_number: 'LEV001', date_of_manufacture: '2024-03-12', date_of_expiry: '2026-03-12', dosage_form: 'Tablet', strength: '500mg', stock_quantity: 400, minimum_stock: 40, restocked_by: 'pharmacy.manager@pharma.com' },

    // Hormonal
    { name: 'Levothyroxine', company: 'Abbott', batch_number: 'LEV002', date_of_manufacture: '2024-02-25', date_of_expiry: '2026-02-25', dosage_form: 'Tablet', strength: '100mcg', stock_quantity: 1100, minimum_stock: 110, restocked_by: 'dr.smith@pharma.com' },
    { name: 'Prednisolone', company: 'Deltasone', batch_number: 'PRE002', date_of_manufacture: '2024-03-15', date_of_expiry: '2025-03-15', dosage_form: 'Tablet', strength: '5mg', stock_quantity: 600, minimum_stock: 60, restocked_by: 'inventory.clerk@pharma.com' },

    // Vitamins & Supplements
    { name: 'Vitamin D3', company: 'Nature Made', batch_number: 'VIT001', date_of_manufacture: '2024-01-08', date_of_expiry: '2026-01-08', dosage_form: 'Tablet', strength: '1000 IU', stock_quantity: 2000, minimum_stock: 200, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Vitamin B12', company: 'Solgar', batch_number: 'VIT002', date_of_manufacture: '2024-02-03', date_of_expiry: '2026-02-03', dosage_form: 'Tablet', strength: '1000mcg', stock_quantity: 1500, minimum_stock: 150, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Folic Acid', company: 'Centrum', batch_number: 'FOL001', date_of_manufacture: '2024-01-12', date_of_expiry: '2026-01-12', dosage_form: 'Tablet', strength: '5mg', stock_quantity: 1800, minimum_stock: 180, restocked_by: 'inventory.clerk@pharma.com' },

    // Others
    { name: 'Cough Syrup', company: 'Pfizer', batch_number: 'COU001', date_of_manufacture: '2024-02-10', date_of_expiry: '2025-02-10', dosage_form: 'Syrup', strength: '100ml', stock_quantity: 800, minimum_stock: 80, restocked_by: 'pharmacy.manager@pharma.com' },
    { name: 'Antiseptic Solution', company: 'Dettol', batch_number: 'ANT001', date_of_manufacture: '2024-01-22', date_of_expiry: '2026-01-22', dosage_form: 'Solution', strength: '500ml', stock_quantity: 1200, minimum_stock: 120, restocked_by: 'inventory.clerk@pharma.com' },
    { name: 'Thermometer', company: 'Omron', batch_number: 'THE001', date_of_manufacture: '2024-01-01', date_of_expiry: '2029-01-01', dosage_form: 'Device', strength: 'Digital', stock_quantity: 150, minimum_stock: 15, restocked_by: 'warehouse@pharma.com' }
  ];

  for (const medicine of medicines) {
    await prisma.medicine.create({
      data: {
        ...medicine,
        date_of_manufacture: new Date(medicine.date_of_manufacture),
        date_of_expiry: new Date(medicine.date_of_expiry)
      }
    });
  }

  // 5. Create Medicine Pricing
  console.log('💰 Creating medicine pricing data...');
  const medicines_list = await prisma.medicine.findMany();
  
  for (const medicine of medicines_list) {
    // Create 3-6 month price history for each medicine
    const priceHistory = [];
    const basePrice = Math.floor(Math.random() * 100) + 10; // Base price between $10-$110
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const priceVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const currentPrice = basePrice * (1 + priceVariation);
      
      priceHistory.push({
        medicine_name: medicine.name,
        company: medicine.company,
        current_price: Math.round(currentPrice * 100) / 100,
        effective_date: date,
        expiry_date: i === 0 ? null : new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
        price_type: Math.random() > 0.8 ? 'promotional' : 'standard',
        created_by: 'admin@example.com'
      });
    }
    
    for (const pricing of priceHistory) {
      await prisma.medicinePricing.create({ data: pricing });
    }
  }

  // 6. Create Comprehensive Supply Records
  console.log('📦 Creating supply records...');
  const stores_list = await prisma.medicalStore.findMany();
  const users_list = await prisma.user.findMany();
  
  for (let i = 0; i < 150; i++) {
    const medicine = medicines_list[Math.floor(Math.random() * medicines_list.length)];
    const store = stores_list[Math.floor(Math.random() * stores_list.length)];
    const user = users_list[Math.floor(Math.random() * users_list.length)];
    
    const supplyDate = new Date();
    supplyDate.setDate(supplyDate.getDate() - Math.floor(Math.random() * 180)); // Random date in last 6 months
    
    const quantity = Math.floor(Math.random() * 500) + 50;
    const unitPrice = Math.floor(Math.random() * 50) + 5;
    
    await prisma.supply.create({
      data: {
        medicine_id: medicine.id,
        store_id: store.store_id,
        user_email: user.email,
        quantity: quantity,
        supply_date: supplyDate,
        unit_price: unitPrice,
        total_amount: quantity * unitPrice,
        batch_info: `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expiry_date: new Date(supplyDate.getTime() + (365 + Math.floor(Math.random() * 365)) * 24 * 60 * 60 * 1000), // 1-2 years from supply date
        notes: `Supply batch for ${medicine.name}`,
        status: Math.random() > 0.1 ? 'completed' : 'pending'
      }
    });
  }

  // 7. Create Comprehensive Order Records
  console.log('📋 Creating order records...');
  
  for (let i = 0; i < 200; i++) {
    const medicine = medicines_list[Math.floor(Math.random() * medicines_list.length)];
    const store = stores_list[Math.floor(Math.random() * stores_list.length)];
    const requester = users_list[Math.floor(Math.random() * users_list.length)];
    const approver = users_list.filter(u => u.role === 'admin' || u.email.includes('manager'))[Math.floor(Math.random() * 3)];
    
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 120)); // Random date in last 4 months
    
    const quantity = Math.floor(Math.random() * 200) + 10;
    const requestedPrice = Math.floor(Math.random() * 40) + 8;
    const approvedPrice = Math.random() > 0.3 ? requestedPrice * (0.9 + Math.random() * 0.2) : null;
    
    const statuses = ['pending', 'approved', 'rejected', 'completed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    await prisma.order.create({
      data: {
        medicine_id: medicine.id,
        store_id: store.store_id,
        requester_email: requester.email,
        approver_email: approver?.email || null,
        quantity: quantity,
        order_date: orderDate,
        requested_price: requestedPrice,
        approved_price: status === 'approved' || status === 'completed' ? approvedPrice : null,
        status: status,
        priority: Math.random() > 0.8 ? 'urgent' : Math.random() > 0.9 ? 'emergency' : 'normal',
        notes: `Order for ${medicine.name} - ${quantity} units`,
        approved_at: status === 'approved' || status === 'completed' ? new Date(orderDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : null
      }
    });
  }

  // 8. Create Employee Records
  console.log('👨‍💼 Creating employee records...');
  const employees = [
    { user_email: 'dr.smith@pharma.com', department: 'Pharmacy', employee_id: 'EMP001', join_date: '2023-01-15', salary: 85000 },
    { user_email: 'pharmacy.manager@pharma.com', department: 'Pharmacy', employee_id: 'EMP002', join_date: '2022-06-10', salary: 75000 },
    { user_email: 'inventory.clerk@pharma.com', department: 'Inventory', employee_id: 'EMP003', join_date: '2023-03-20', salary: 45000 },
    { user_email: 'sales.rep@pharma.com', department: 'Sales', employee_id: 'EMP004', join_date: '2023-05-12', salary: 55000 },
    { user_email: 'lab.tech@pharma.com', department: 'Laboratory', employee_id: 'EMP005', join_date: '2023-08-05', salary: 50000 },
    { user_email: 'qa@pharma.com', department: 'Quality Assurance', employee_id: 'EMP006', join_date: '2022-11-30', salary: 70000 },
    { user_email: 'warehouse@pharma.com', department: 'Warehouse', employee_id: 'EMP007', join_date: '2023-02-14', salary: 48000 }
  ];

  for (const employee of employees) {
    await prisma.employee.create({
      data: {
        ...employee,
        join_date: new Date(employee.join_date)
      }
    });
  }

  // 9. Create Admin Records
  console.log('🔑 Creating admin records...');
  await prisma.admin.create({
    data: {
      user_email: 'admin@example.com',
      admin_level: 3,
      department: 'All'
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Medical Stores: ${await prisma.medicalStore.count()}`);
  console.log(`- Medicines: ${await prisma.medicine.count()}`);
  console.log(`- Medicine Pricing Records: ${await prisma.medicinePricing.count()}`);
  console.log(`- Supply Records: ${await prisma.supply.count()}`);
  console.log(`- Order Records: ${await prisma.order.count()}`);
  console.log(`- Employee Records: ${await prisma.employee.count()}`);
  console.log(`- System Permissions: ${await prisma.systemPermission.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
