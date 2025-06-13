import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple database seeding...');

  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.userPhoneNumber.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.medicalStore.deleteMany();

  // Create medicines with stock quantities and restock information
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: 'Paracetamol',
        company: 'PharmaCorp',
        date_of_manufacture: new Date('2024-01-15'),
        date_of_expiry: new Date('2026-01-15'),
        price: 12.50,
        stock_quantity: 500,
        minimum_stock: 50,
        last_restocked_quantity: 200,
        restocked_at: new Date('2025-06-01'),
        restocked_by: 1,
        stock_notes: 'Regular monthly restock from supplier'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Ibuprofen',
        company: 'MediTech Solutions',
        date_of_manufacture: new Date('2024-02-10'),
        date_of_expiry: new Date('2026-02-10'),
        price: 18.75,
        stock_quantity: 350,
        minimum_stock: 30,
        last_restocked_quantity: 150,
        restocked_at: new Date('2025-05-28'),
        restocked_by: 2,
        stock_notes: 'Emergency restock due to high demand'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Aspirin',
        company: 'HealthCare Inc',
        date_of_manufacture: new Date('2024-03-05'),
        date_of_expiry: new Date('2025-03-05'),
        price: 8.90,
        stock_quantity: 600,
        minimum_stock: 60,
        last_restocked_quantity: 300,
        restocked_at: new Date('2025-06-10'),
        restocked_by: 1,
        stock_notes: 'Bulk purchase from manufacturer - good deal!'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin',
        company: 'BioPharma Ltd',
        date_of_manufacture: new Date('2024-04-20'),
        date_of_expiry: new Date('2026-04-20'),
        price: 25.30,
        stock_quantity: 180,
        minimum_stock: 100,
        last_restocked_quantity: 80,
        restocked_at: new Date('2025-06-05'),
        restocked_by: 2,
        stock_notes: 'Antibiotic - high demand medicine'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Cetirizine',
        company: 'AllerGen Pharma',
        date_of_manufacture: new Date('2024-05-15'),
        date_of_expiry: new Date('2027-05-15'),
        price: 15.80,
        stock_quantity: 25,
        minimum_stock: 40,
        last_restocked_quantity: 50,
        restocked_at: new Date('2025-05-20'),
        restocked_by: 1,
        stock_notes: 'Low stock - needs urgent restocking!'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Metformin',
        company: 'DiabCare Solutions',
        date_of_manufacture: new Date('2024-06-01'),
        date_of_expiry: new Date('2026-06-01'),
        price: 22.45,
        stock_quantity: 890,
        minimum_stock: 200,
        last_restocked_quantity: 400,
        restocked_at: new Date('2025-06-12'),
        restocked_by: 1,
        stock_notes: 'Diabetes medication - bulk order received'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Lisinopril',
        company: 'CardioMed Inc',
        date_of_manufacture: new Date('2024-01-10'),
        date_of_expiry: new Date('2025-12-31'),
        price: 19.65,
        stock_quantity: 145,
        minimum_stock: 75,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-05-15'),
        restocked_by: 2,
        stock_notes: 'Blood pressure medication - expiring soon'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Omeprazole',
        company: 'GastroPharm',
        date_of_manufacture: new Date('2024-03-25'),
        date_of_expiry: new Date('2026-03-25'),
        price: 28.90,
        stock_quantity: 320,
        minimum_stock: 80,
        last_restocked_quantity: 150,
        restocked_at: new Date('2025-06-08'),
        restocked_by: 1,
        stock_notes: 'Acid reflux medication - good stock level'
      }
    }),
    // Adding many more medicines for better analytics
    prisma.medicine.create({
      data: {
        name: 'Loratadine',
        company: 'AllerGen Pharma',
        date_of_manufacture: new Date('2024-04-10'),
        date_of_expiry: new Date('2026-04-10'),
        price: 14.25,
        stock_quantity: 275,
        minimum_stock: 50,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-05-30'),
        restocked_by: 2,
        stock_notes: 'Allergy medication - seasonal demand'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Azithromycin',
        company: 'BioPharma Ltd',
        date_of_manufacture: new Date('2024-05-20'),
        date_of_expiry: new Date('2026-05-20'),
        price: 32.80,
        stock_quantity: 95,
        minimum_stock: 60,
        last_restocked_quantity: 45,
        restocked_at: new Date('2025-06-02'),
        restocked_by: 1,
        stock_notes: 'Antibiotic - prescription required'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Simvastatin',
        company: 'CardioMed Inc',
        date_of_manufacture: new Date('2024-02-28'),
        date_of_expiry: new Date('2026-02-28'),
        price: 26.75,
        stock_quantity: 420,
        minimum_stock: 100,
        last_restocked_quantity: 200,
        restocked_at: new Date('2025-06-01'),
        restocked_by: 1,
        stock_notes: 'Cholesterol medication - bulk order'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Lansoprazole',
        company: 'GastroPharm',
        date_of_manufacture: new Date('2024-03-15'),
        date_of_expiry: new Date('2026-03-15'),
        price: 24.60,
        stock_quantity: 185,
        minimum_stock: 70,
        last_restocked_quantity: 85,
        restocked_at: new Date('2025-05-25'),
        restocked_by: 2,
        stock_notes: 'PPI medication - good demand'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Dextromethorphan',
        company: 'PharmaCorp',
        date_of_manufacture: new Date('2024-04-05'),
        date_of_expiry: new Date('2025-04-05'),
        price: 11.30,
        stock_quantity: 65,
        minimum_stock: 80,
        last_restocked_quantity: 40,
        restocked_at: new Date('2025-04-20'),
        restocked_by: 3,
        stock_notes: 'Cough syrup - low stock alert'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Montelukast',
        company: 'RespiCare Pharma',
        date_of_manufacture: new Date('2024-01-25'),
        date_of_expiry: new Date('2026-01-25'),
        price: 35.90,
        stock_quantity: 140,
        minimum_stock: 50,
        last_restocked_quantity: 70,
        restocked_at: new Date('2025-05-18'),
        restocked_by: 2,
        stock_notes: 'Asthma medication - specialized'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Tramadol',
        company: 'PainRelief Inc',
        date_of_manufacture: new Date('2024-06-10'),
        date_of_expiry: new Date('2026-06-10'),
        price: 29.40,
        stock_quantity: 85,
        minimum_stock: 40,
        last_restocked_quantity: 50,
        restocked_at: new Date('2025-06-05'),
        restocked_by: 1,
        stock_notes: 'Pain medication - controlled substance'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Fluconazole',
        company: 'FungiCure Ltd',
        date_of_manufacture: new Date('2024-05-05'),
        date_of_expiry: new Date('2026-05-05'),
        price: 21.85,
        stock_quantity: 110,
        minimum_stock: 45,
        last_restocked_quantity: 60,
        restocked_at: new Date('2025-05-22'),
        restocked_by: 3,
        stock_notes: 'Antifungal medication'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Sertraline',
        company: 'MentalHealth Pharma',
        date_of_manufacture: new Date('2024-03-12'),
        date_of_expiry: new Date('2026-03-12'),
        price: 38.20,
        stock_quantity: 75,
        minimum_stock: 30,
        last_restocked_quantity: 35,
        restocked_at: new Date('2025-05-28'),
        restocked_by: 2,
        stock_notes: 'Antidepressant - prescription required'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Warfarin',
        company: 'CardioMed Inc',
        date_of_manufacture: new Date('2024-04-18'),
        date_of_expiry: new Date('2026-04-18'),
        price: 16.75,
        stock_quantity: 95,
        minimum_stock: 35,
        last_restocked_quantity: 45,
        restocked_at: new Date('2025-06-03'),
        restocked_by: 1,
        stock_notes: 'Blood thinner - requires monitoring'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Prednisone',
        company: 'SteroidMed Corp',
        date_of_manufacture: new Date('2024-02-20'),
        date_of_expiry: new Date('2026-02-20'),
        price: 18.95,
        stock_quantity: 165,
        minimum_stock: 55,
        last_restocked_quantity: 80,
        restocked_at: new Date('2025-05-15'),
        restocked_by: 3,
        stock_notes: 'Corticosteroid - anti-inflammatory'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Albuterol',
        company: 'RespiCare Pharma',
        date_of_manufacture: new Date('2024-05-30'),
        date_of_expiry: new Date('2026-05-30'),
        price: 42.60,
        stock_quantity: 55,
        minimum_stock: 25,
        last_restocked_quantity: 30,
        restocked_at: new Date('2025-06-01'),
        restocked_by: 2,
        stock_notes: 'Inhaler - respiratory medication'
      }
    })
  ]);

  console.log(`✅ Created ${medicines.length} medicines`);

  // Create medical stores
  const stores = await Promise.all([
    prisma.medicalStore.create({
      data: {
        store_name: 'City Medical Store',
        city: 'Downtown',
        state: 'California',
        pin_code: '90001'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'HealthPlus Pharmacy',
        city: 'Riverside',
        state: 'California',
        pin_code: '92501'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'MediCare Central',
        city: 'Los Angeles',
        state: 'California',
        pin_code: '90210'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'QuickMeds Pharmacy',
        city: 'San Francisco',
        state: 'California',
        pin_code: '94102'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Family Health Store',
        city: 'San Diego',
        state: 'California',
        pin_code: '92101'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Metro Pharmacy',
        city: 'Oakland',
        state: 'California',
        pin_code: '94601'
      }
    })
  ]);
  
  console.log(`✅ Created ${stores.length} medical stores`);

  // Hash for password
  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('password123', saltRounds);
  
  // Create users
  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        name: 'John Admin',
        email: 'john.admin@pharma.com',
        password: defaultPassword,
        role: 'admin',
        admin: {
          create: {
            admin_level: 2
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-123-4567', is_primary: true }
          ]
        }
      }
    }),
    // Employee user with order approval permission
    prisma.user.create({
      data: {
        name: 'Alice Employee',
        email: 'alice.employee@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Sales',
            can_manage_medicines: false,
            can_manage_stores: false,
            can_approve_orders: true,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-987-6543', is_primary: true }
          ]
        }
      }
    }),
    // Senior pharmacist with full permissions
    prisma.user.create({
      data: {
        name: 'Dr. Sarah Pharmacist',
        email: 'sarah.pharmacist@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Pharmacy',
            can_manage_medicines: true,
            can_manage_stores: true,
            can_approve_orders: true,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-456-7890', is_primary: true },
            { phone: '555-456-7891', is_primary: false }
          ]
        }
      }
    }),
    // Inventory manager
    prisma.user.create({
      data: {
        name: 'Mike Inventory',
        email: 'mike.inventory@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Inventory',
            can_manage_medicines: true,
            can_manage_stores: false,
            can_approve_orders: false,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-321-9876', is_primary: true }
          ]
        }
      }
    }),
    // Store manager
    prisma.user.create({
      data: {
        name: 'Emma StoreManager',
        email: 'emma.store@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Store Operations',
            can_manage_medicines: false,
            can_manage_stores: true,
            can_approve_orders: false,
            can_manage_supplies: false
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-654-3210', is_primary: true }
          ]
        }
      }
    })
  ]);
  
  console.log(`✅ Created ${users.length} users`);

  // Create supply records with varied dates for better analytics
  const supplies = await Promise.all([
    // January 2025 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id, // Paracetamol
        store_id: stores[0].store_id, // City Medical Store
        user_id: users[0].id, // John Admin
        quantity: 100,
        supply_date: new Date('2025-01-15'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[5].id, // Metformin
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        user_id: users[1].id, // Alice Employee
        quantity: 150,
        supply_date: new Date('2025-01-20'),
        status: 'approved'
      }
    }),
    // February 2025 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[1].id, // Ibuprofen
        store_id: stores[2].store_id, // MediCare Central
        user_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 75,
        supply_date: new Date('2025-02-10'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[7].id, // Omeprazole
        store_id: stores[3].store_id, // QuickMeds Pharmacy
        user_id: users[3].id, // Mike Inventory
        quantity: 50,
        supply_date: new Date('2025-02-25'),
        status: 'approved'
      }
    }),
    // March 2025 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[2].id, // Aspirin
        store_id: stores[4].store_id, // Family Health Store
        user_id: users[1].id, // Alice Employee
        quantity: 200,
        supply_date: new Date('2025-03-05'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[10].id, // Simvastatin
        store_id: stores[5].store_id, // Metro Pharmacy
        user_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 80,
        supply_date: new Date('2025-03-18'),
        status: 'approved'
      }
    }),
    // April 2025 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[3].id, // Amoxicillin
        store_id: stores[0].store_id, // City Medical Store
        user_id: users[0].id, // John Admin
        quantity: 60,
        supply_date: new Date('2025-04-08'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[9].id, // Azithromycin
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        user_id: users[3].id, // Mike Inventory
        quantity: 30,
        supply_date: new Date('2025-04-22'),
        status: 'approved'
      }
    }),
    // May 2025 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[4].id, // Cetirizine
        store_id: stores[2].store_id, // MediCare Central
        user_id: users[1].id, // Alice Employee
        quantity: 40,
        supply_date: new Date('2025-05-12'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[11].id, // Lansoprazole
        store_id: stores[3].store_id, // QuickMeds Pharmacy
        user_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 65,
        supply_date: new Date('2025-05-28'),
        status: 'approved'
      }
    }),
    // June 2025 supplies (current month)
    prisma.supply.create({
      data: {
        medicine_id: medicines[6].id, // Lisinopril
        store_id: stores[4].store_id, // Family Health Store
        user_id: users[0].id, // John Admin
        quantity: 45,
        supply_date: new Date('2025-06-05'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[13].id, // Montelukast
        store_id: stores[5].store_id, // Metro Pharmacy
        user_id: users[3].id, // Mike Inventory
        quantity: 25,
        supply_date: new Date('2025-06-10'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[15].id, // Fluconazole
        store_id: stores[0].store_id, // City Medical Store
        user_id: users[1].id, // Alice Employee
        quantity: 35,
        supply_date: new Date('2025-06-12'),
        status: 'approved'
      }
    }),
    // Pending supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[8].id, // Loratadine
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        user_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 55,
        supply_date: new Date('2025-06-13'),
        status: 'pending'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[14].id, // Tramadol
        store_id: stores[2].store_id, // MediCare Central
        user_id: users[4].id, // Emma StoreManager
        quantity: 20,
        supply_date: new Date('2025-06-13'),
        status: 'pending'
      }
    })
  ]);

  console.log(`✅ Created ${supplies.length} supply records`);

  // Create orders with various statuses and dates for analytics
  const orders = await Promise.all([
    // January 2025 orders
    prisma.order.create({
      data: {
        medicine_id: medicines[0].id, // Paracetamol
        store_id: stores[0].store_id, // City Medical Store
        requester_id: users[4].id, // Emma StoreManager
        approver_id: users[0].id, // John Admin
        quantity: 50,
        order_date: new Date('2025-01-10'),
        status: 'approved',
        notes: 'Monthly restock order',
        approved_at: new Date('2025-01-11')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[5].id, // Metformin
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        requester_id: users[1].id, // Alice Employee
        approver_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 80,
        order_date: new Date('2025-01-18'),
        status: 'approved',
        notes: 'Diabetes medication for regular customers',
        approved_at: new Date('2025-01-19'),
        delivered_at: new Date('2025-01-22')
      }
    }),
    // February 2025 orders
    prisma.order.create({
      data: {
        medicine_id: medicines[1].id, // Ibuprofen
        store_id: stores[2].store_id, // MediCare Central
        requester_id: users[2].id, // Dr. Sarah Pharmacist
        approver_id: users[0].id, // John Admin
        quantity: 60,
        order_date: new Date('2025-02-05'),
        status: 'approved',
        notes: 'Pain relief medication - high demand',
        approved_at: new Date('2025-02-06'),
        delivered_at: new Date('2025-02-08')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[7].id, // Omeprazole
        store_id: stores[3].store_id, // QuickMeds Pharmacy
        requester_id: users[4].id, // Emma StoreManager
        approver_id: users[0].id, // John Admin
        quantity: 40,
        order_date: new Date('2025-02-20'),
        status: 'rejected',
        notes: 'Budget constraints - order postponed',
        approved_at: new Date('2025-02-21')
      }
    }),
    // March 2025 orders
    prisma.order.create({
      data: {
        medicine_id: medicines[2].id, // Aspirin
        store_id: stores[4].store_id, // Family Health Store
        requester_id: users[1].id, // Alice Employee
        approver_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 150,
        order_date: new Date('2025-03-03'),
        status: 'approved',
        notes: 'OTC pain reliever - bulk order',
        approved_at: new Date('2025-03-04'),
        delivered_at: new Date('2025-03-07')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[10].id, // Simvastatin
        store_id: stores[5].store_id, // Metro Pharmacy
        requester_id: users[3].id, // Mike Inventory
        approver_id: users[0].id, // John Admin
        quantity: 70,
        order_date: new Date('2025-03-15'),
        status: 'approved',
        notes: 'Cholesterol medication',
        approved_at: new Date('2025-03-16'),
        delivered_at: new Date('2025-03-19')
      }
    }),
    // April 2025 orders
    prisma.order.create({
      data: {
        medicine_id: medicines[3].id, // Amoxicillin
        store_id: stores[0].store_id, // City Medical Store
        requester_id: users[4].id, // Emma StoreManager
        approver_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 45,
        order_date: new Date('2025-04-02'),
        status: 'approved',
        notes: 'Antibiotic - prescription medication',
        approved_at: new Date('2025-04-03'),
        delivered_at: new Date('2025-04-06')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[9].id, // Azithromycin
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        requester_id: users[1].id, // Alice Employee
        quantity: 25,
        order_date: new Date('2025-04-18'),
        status: 'pending',
        notes: 'Specialized antibiotic - awaiting approval'
      }
    }),
    // May 2025 orders
    prisma.order.create({
      data: {
        medicine_id: medicines[4].id, // Cetirizine (low stock)
        store_id: stores[2].store_id, // MediCare Central
        requester_id: users[2].id, // Dr. Sarah Pharmacist
        approver_id: users[2].id, // Self-approved (has permission)
        quantity: 30,
        order_date: new Date('2025-05-10'),
        status: 'approved',
        notes: 'Emergency order - allergy season demand',
        approved_at: new Date('2025-05-11'),
        delivered_at: new Date('2025-05-13')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[11].id, // Lansoprazole
        store_id: stores[3].store_id, // QuickMeds Pharmacy
        requester_id: users[3].id, // Mike Inventory
        approver_id: users[0].id, // John Admin
        quantity: 55,
        order_date: new Date('2025-05-25'),
        status: 'approved',
        notes: 'PPI medication for acid reflux',
        approved_at: new Date('2025-05-26'),
        delivered_at: new Date('2025-05-29')
      }
    }),
    // June 2025 orders (current month)
    prisma.order.create({
      data: {
        medicine_id: medicines[6].id, // Lisinopril
        store_id: stores[4].store_id, // Family Health Store
        requester_id: users[4].id, // Emma StoreManager
        approver_id: users[0].id, // John Admin
        quantity: 35,
        order_date: new Date('2025-06-02'),
        status: 'approved',
        notes: 'Blood pressure medication',
        approved_at: new Date('2025-06-03'),
        delivered_at: new Date('2025-06-06')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[13].id, // Montelukast
        store_id: stores[5].store_id, // Metro Pharmacy
        requester_id: users[1].id, // Alice Employee
        approver_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 20,
        order_date: new Date('2025-06-08'),
        status: 'approved',
        notes: 'Asthma medication',
        approved_at: new Date('2025-06-09'),
        delivered_at: new Date('2025-06-12')
      }
    }),
    // Recent pending orders
    prisma.order.create({
      data: {
        medicine_id: medicines[8].id, // Loratadine
        store_id: stores[0].store_id, // City Medical Store
        requester_id: users[4].id, // Emma StoreManager
        quantity: 40,
        order_date: new Date('2025-06-11'),
        status: 'pending',
        notes: 'Allergy medication - seasonal demand'
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[14].id, // Tramadol
        store_id: stores[1].store_id, // HealthPlus Pharmacy
        requester_id: users[1].id, // Alice Employee
        quantity: 15,
        order_date: new Date('2025-06-12'),
        status: 'pending',
        notes: 'Pain medication - controlled substance'
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[15].id, // Fluconazole
        store_id: stores[2].store_id, // MediCare Central
        requester_id: users[2].id, // Dr. Sarah Pharmacist
        quantity: 25,
        order_date: new Date('2025-06-13'),
        status: 'pending',
        notes: 'Antifungal medication - urgent need'
      }
    }),
    // Recent rejected order
    prisma.order.create({
      data: {
        medicine_id: medicines[16].id, // Sertraline
        store_id: stores[3].store_id, // QuickMeds Pharmacy
        requester_id: users[3].id, // Mike Inventory
        approver_id: users[0].id, // John Admin
        quantity: 50,
        order_date: new Date('2025-06-10'),
        status: 'rejected',
        notes: 'Need additional authorization for psychiatric medication',
        approved_at: new Date('2025-06-11')
      }
    })
  ]);

  console.log(`✅ Created ${orders.length} order records`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • ${medicines.length} medicines created`);
  console.log(`   • ${stores.length} medical stores created`);
  console.log(`   • ${users.length} users created`);
  console.log(`   • ${supplies.length} supply relationships created`);
  console.log(`   • ${orders.length} order requests created`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
