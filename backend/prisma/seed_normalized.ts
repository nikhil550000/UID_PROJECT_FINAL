import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with normalized schema...');

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
      email: 'admin@pharma.com',
      name: 'System Administrator',
      password_hash: hashedPassword,
      role: 'admin',
      primary_phone: '+1234567890',
      is_active: true
    },
    {
      email: 'pharmacy.manager@pharma.com',
      name: 'Pharmacy Manager',
      password_hash: hashedPassword,
      role: 'employee',
      primary_phone: '+1234567891',
      is_active: true
    },
    {
      email: 'sales.rep@pharma.com',
      name: 'Sales Representative',
      password_hash: hashedPassword,
      role: 'employee',
      primary_phone: '+1234567892',
      is_active: true
    },
    {
      email: 'inventory.clerk@pharma.com',
      name: 'Inventory Clerk',
      password_hash: hashedPassword,
      role: 'employee',
      primary_phone: '+1234567893',
      is_active: true
    },
    {
      email: 'dr.smith@pharma.com',
      name: 'Dr. John Smith',
      password_hash: hashedPassword,
      role: 'employee',
      primary_phone: '+1234567894',
      is_active: true
    }
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // 3. Create Admin records
  console.log('👑 Creating admin records...');
  await prisma.admin.create({
    data: {
      user_email: 'admin@pharma.com',
      admin_level: 3,
      department: 'Administration',
      appointed_at: new Date('2024-01-01')
    }
  });

  // 4. Create Employee records
  console.log('👷 Creating employee records...');
  const employees = [
    {
      user_email: 'pharmacy.manager@pharma.com',
      department: 'Pharmacy',
      employee_id: 'EMP001',
      join_date: new Date('2024-01-15'),
      salary: 75000
    },
    {
      user_email: 'sales.rep@pharma.com',
      department: 'Sales',
      employee_id: 'EMP002',
      join_date: new Date('2024-02-01'),
      salary: 65000
    },
    {
      user_email: 'inventory.clerk@pharma.com',
      department: 'Inventory',
      employee_id: 'EMP003',
      join_date: new Date('2024-02-15'),
      salary: 55000
    },
    {
      user_email: 'dr.smith@pharma.com',
      department: 'Pharmacy',
      employee_id: 'EMP004',
      join_date: new Date('2024-03-01'),
      salary: 85000
    }
  ];

  for (const employee of employees) {
    await prisma.employee.create({ data: employee });
  }

  // 5. Create additional phone numbers
  console.log('📱 Creating additional phone numbers...');
  const phoneNumbers = [
    { user_email: 'admin@pharma.com', phone: '+1234567800', phone_type: 'work' },
    { user_email: 'pharmacy.manager@pharma.com', phone: '+1234567801', phone_type: 'home' },
    { user_email: 'sales.rep@pharma.com', phone: '+1234567802', phone_type: 'work' },
  ];

  for (const phoneNumber of phoneNumbers) {
    await prisma.userPhoneNumber.create({ data: phoneNumber });
  }

  // 6. Create Supervisions
  console.log('👥 Creating supervision relationships...');
  const supervisions = [
    {
      supervisor_email: 'admin@pharma.com',
      supervisee_email: 'pharmacy.manager@pharma.com',
      relationship_start: new Date('2024-01-15'),
      notes: 'Direct supervision of pharmacy operations'
    },
    {
      supervisor_email: 'pharmacy.manager@pharma.com',
      supervisee_email: 'inventory.clerk@pharma.com',
      relationship_start: new Date('2024-02-15'),
      notes: 'Inventory management supervision'
    },
    {
      supervisor_email: 'pharmacy.manager@pharma.com',
      supervisee_email: 'dr.smith@pharma.com',
      relationship_start: new Date('2024-03-01'),
      notes: 'Clinical supervision'
    }
  ];

  for (const supervision of supervisions) {
    await prisma.supervision.create({ data: supervision });
  }

  // 7. Create Medical Stores
  console.log('🏪 Creating medical stores...');
  const stores = [
    {
      store_name: 'Central Pharmacy',
      city: 'New York',
      state: 'New York',
      street_address: '123 Main Street, New York, NY 10001',
      contact_person: 'Alice Johnson',
      phone: '+1555001001',
      email: 'central@pharmacy.com',
      license_number: 'LIC001NY'
    },
    {
      store_name: 'Health Plus Store',
      city: 'Los Angeles',
      state: 'California',
      street_address: '456 Sunset Blvd, Los Angeles, CA 90210',
      contact_person: 'Bob Wilson',
      phone: '+1555001002',
      email: 'healthplus@pharmacy.com',
      license_number: 'LIC002CA'
    },
    {
      store_name: 'Community Care Pharmacy',
      city: 'Chicago',
      state: 'Illinois',
      street_address: '789 Michigan Ave, Chicago, IL 60601',
      contact_person: 'Carol Davis',
      phone: '+1555001003',
      email: 'community@pharmacy.com',
      license_number: 'LIC003IL'
    },
    {
      store_name: 'MediCare Plus',
      city: 'Houston',
      state: 'Texas',
      street_address: '321 Texas Ave, Houston, TX 77001',
      contact_person: 'David Brown',
      phone: '+1555001004',
      email: 'medicare@pharmacy.com',
      license_number: 'LIC004TX'
    },
    {
      store_name: 'Wellness Pharmacy',
      city: 'Phoenix',
      state: 'Arizona',
      street_address: '654 Desert Road, Phoenix, AZ 85001',
      contact_person: 'Eva Martinez',
      phone: '+1555001005',
      email: 'wellness@pharmacy.com',
      license_number: 'LIC005AZ'
    }
  ];

  for (const store of stores) {
    await prisma.medicalStore.create({ data: store });
  }

  // 8. Create Medicines
  console.log('💊 Creating medicines...');
  const medicines = [
    {
      name: 'Paracetamol',
      company: 'Sun Pharma',
      batch_number: 'PAR001',
      date_of_manufacture: new Date('2024-01-15'),
      date_of_expiry: new Date('2026-01-15'),
      dosage_form: 'Tablet',
      strength: '500mg',
      stock_quantity: 1000,
      minimum_stock: 100,
      restocked_by: 'inventory.clerk@pharma.com'
    },
    {
      name: 'Amoxicillin',
      company: 'Cipla',
      batch_number: 'AMX001',
      date_of_manufacture: new Date('2024-02-01'),
      date_of_expiry: new Date('2026-02-01'),
      dosage_form: 'Capsule',
      strength: '250mg',
      stock_quantity: 800,
      minimum_stock: 80,
      restocked_by: 'inventory.clerk@pharma.com'
    },
    {
      name: 'Insulin Glargine',
      company: 'Novo Nordisk',
      batch_number: 'INS001',
      date_of_manufacture: new Date('2024-03-01'),
      date_of_expiry: new Date('2025-03-01'),
      dosage_form: 'Injection',
      strength: '100 units/ml',
      stock_quantity: 200,
      minimum_stock: 50,
      restocked_by: 'dr.smith@pharma.com'
    },
    {
      name: 'Ibuprofen',
      company: 'Johnson & Johnson',
      batch_number: 'IBU001',
      date_of_manufacture: new Date('2024-01-20'),
      date_of_expiry: new Date('2026-01-20'),
      dosage_form: 'Tablet',
      strength: '400mg',
      stock_quantity: 1200,
      minimum_stock: 120,
      restocked_by: 'inventory.clerk@pharma.com'
    },
    {
      name: 'Cough Syrup',
      company: 'Pfizer',
      batch_number: 'COU001',
      date_of_manufacture: new Date('2024-02-10'),
      date_of_expiry: new Date('2025-02-10'),
      dosage_form: 'Syrup',
      strength: '100ml',
      stock_quantity: 500,
      minimum_stock: 50,
      restocked_by: 'pharmacy.manager@pharma.com'
    }
  ];

  for (const medicine of medicines) {
    await prisma.medicine.create({ data: medicine });
  }

  // 9. Create Medicine Pricing
  console.log('💰 Creating medicine pricing...');
  const pricing = [
    {
      medicine_name: 'Paracetamol',
      company: 'Sun Pharma',
      current_price: 25.50,
      effective_date: new Date('2024-01-01'),
      price_type: 'standard',
      created_by: 'admin@pharma.com'
    },
    {
      medicine_name: 'Amoxicillin',
      company: 'Cipla',
      current_price: 45.75,
      effective_date: new Date('2024-01-01'),
      price_type: 'standard',
      created_by: 'admin@pharma.com'
    },
    {
      medicine_name: 'Insulin Glargine',
      company: 'Novo Nordisk',
      current_price: 125.00,
      effective_date: new Date('2024-01-01'),
      price_type: 'standard',
      created_by: 'admin@pharma.com'
    },
    {
      medicine_name: 'Ibuprofen',
      company: 'Johnson & Johnson',
      current_price: 35.25,
      effective_date: new Date('2024-01-01'),
      price_type: 'standard',
      created_by: 'admin@pharma.com'
    },
    {
      medicine_name: 'Cough Syrup',
      company: 'Pfizer',
      current_price: 55.00,
      effective_date: new Date('2024-01-01'),
      price_type: 'standard',
      created_by: 'admin@pharma.com'
    },
    // Bulk pricing
    {
      medicine_name: 'Paracetamol',
      company: 'Sun Pharma',
      current_price: 22.50,
      effective_date: new Date('2024-01-01'),
      price_type: 'bulk',
      created_by: 'admin@pharma.com'
    }
  ];

  for (const price of pricing) {
    await prisma.medicinePricing.create({ data: price });
  }

  // 10. Create Supplies
  console.log('📦 Creating supplies...');
  const supplies = [
    {
      medicine_id: 1, // Paracetamol
      store_id: 1,    // Central Pharmacy
      user_email: 'inventory.clerk@pharma.com',
      quantity: 200,
      supply_date: new Date('2024-03-01'),
      status: 'completed',
      unit_price: 25.50,
      total_amount: 5100.00,
      batch_info: 'PAR001-Batch1',
      expiry_date: new Date('2026-01-15'),
      notes: 'Regular monthly supply'
    },
    {
      medicine_id: 2, // Amoxicillin
      store_id: 2,    // Health Plus Store
      user_email: 'pharmacy.manager@pharma.com',
      quantity: 150,
      supply_date: new Date('2024-03-05'),
      status: 'completed',
      unit_price: 45.75,
      total_amount: 6862.50,
      batch_info: 'AMX001-Batch1',
      expiry_date: new Date('2026-02-01'),
      notes: 'Antibiotic supply for flu season'
    },
    {
      medicine_id: 3, // Insulin
      store_id: 3,    // Community Care
      user_email: 'dr.smith@pharma.com',
      quantity: 50,
      supply_date: new Date('2024-03-10'),
      status: 'pending',
      unit_price: 125.00,
      total_amount: 6250.00,
      batch_info: 'INS001-Batch1',
      expiry_date: new Date('2025-03-01'),
      notes: 'Diabetes medication - priority delivery'
    }
  ];

  for (const supply of supplies) {
    await prisma.supply.create({ data: supply });
  }

  // 11. Create Orders
  console.log('📋 Creating orders...');
  const orders = [
    {
      medicine_id: 1,
      store_id: 1,
      requester_email: 'sales.rep@pharma.com',
      approver_email: 'pharmacy.manager@pharma.com',
      quantity: 100,
      requested_price: 25.50,
      approved_price: 25.50,
      order_date: new Date('2024-03-15'),
      status: 'approved',
      priority: 'normal',
      notes: 'Regular stock replenishment',
      approved_at: new Date('2024-03-16')
    },
    {
      medicine_id: 3,
      store_id: 2,
      requester_email: 'sales.rep@pharma.com',
      quantity: 25,
      requested_price: 125.00,
      order_date: new Date('2024-03-18'),
      status: 'pending',
      priority: 'urgent',
      notes: 'Emergency insulin request for diabetic patient'
    },
    {
      medicine_id: 4,
      store_id: 4,
      requester_email: 'sales.rep@pharma.com',
      approver_email: 'pharmacy.manager@pharma.com',
      quantity: 200,
      requested_price: 35.25,
      approved_price: 32.00,
      order_date: new Date('2024-03-12'),
      status: 'approved',
      priority: 'normal',
      notes: 'Bulk order - negotiated price',
      approved_at: new Date('2024-03-13'),
      delivered_at: new Date('2024-03-20')
    },
    {
      medicine_id: 5,
      store_id: 5,
      requester_email: 'sales.rep@pharma.com',
      quantity: 75,
      requested_price: 55.00,
      order_date: new Date('2024-03-20'),
      status: 'pending',
      priority: 'normal',
      notes: 'Seasonal demand for cough syrup'
    }
  ];

  for (const order of orders) {
    await prisma.order.create({ data: order });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`  - Users: ${users.length}`);
  console.log(`  - System Permissions: ${permissions.length}`);
  console.log(`  - Medical Stores: ${stores.length}`);
  console.log(`  - Medicines: ${medicines.length}`);
  console.log(`  - Medicine Pricing: ${pricing.length}`);
  console.log(`  - Supplies: ${supplies.length}`);
  console.log(`  - Orders: ${orders.length}`);
  console.log(`  - Supervisions: ${supervisions.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
