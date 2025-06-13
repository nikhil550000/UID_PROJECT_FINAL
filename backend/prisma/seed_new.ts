import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create medicines with stock quantities
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: 'Paracetamol',
        company: 'PharmaCorp',
        date_of_manufacture: new Date('2024-01-15'),
        date_of_expiry: new Date('2026-01-15'),
        price: 12.50,
        stock_quantity: 500,
        minimum_stock: 50
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
        minimum_stock: 30
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
        minimum_stock: 60
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin',
        company: 'BiotechLabs',
        date_of_manufacture: new Date('2024-01-20'),
        date_of_expiry: new Date('2025-01-20'),
        price: 25.30,
        stock_quantity: 200,
        minimum_stock: 40
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Vitamin D3',
        company: 'NatureCare',
        date_of_manufacture: new Date('2024-02-25'),
        date_of_expiry: new Date('2026-02-25'),
        price: 15.45,
        stock_quantity: 450,
        minimum_stock: 30
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Cough Syrup',
        company: 'ReliefMed',
        date_of_manufacture: new Date('2024-03-15'),
        date_of_expiry: new Date('2025-09-15'),
        price: 10.25,
        stock_quantity: 150,
        minimum_stock: 25
      }
    })
  ]);

  console.log(`✅ Created ${medicines.length} medicines`);

  // Create medical stores with composite attributes for location
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
        store_name: 'QuickMeds',
        city: 'San Francisco',
        state: 'California',
        pin_code: '94105'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Wellness Pharmacy',
        city: 'Los Angeles',
        state: 'California',
        pin_code: '90005'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'CarePlus Drugs',
        city: 'San Diego',
        state: 'California',
        pin_code: '92101'
      }
    })
  ]);
  
  console.log(`✅ Created ${stores.length} medical stores`);

  // Hash for password
  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('password123', saltRounds);
  
  // Create users with specializations
  const users = await Promise.all([
    // Admin users
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@pharma.com',
        password: defaultPassword,
        role: 'admin',
        admin: {
          create: {
            admin_level: 2
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-123-4567', is_primary: true },
            { phone: '555-987-6543', is_primary: false }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@pharma.com',
        password: defaultPassword,
        role: 'admin',
        admin: {
          create: {
            admin_level: 1
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-222-3333', is_primary: true }
          ]
        }
      }
    }),
    
    // Employee users with different permissions
    prisma.user.create({
      data: {
        name: 'Bob Williams',
        email: 'bob.williams@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Sales',
            can_manage_medicines: true,
            can_approve_orders: false,
            can_manage_stores: false,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-444-5555', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Alice Brown',
        email: 'alice.brown@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Logistics',
            can_manage_medicines: false,
            can_approve_orders: true,
            can_manage_stores: true,
            can_manage_supplies: false
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-666-7777', is_primary: true },
            { phone: '555-888-9999', is_primary: false }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Mark Davis',
        email: 'mark.davis@pharma.com',
        password: defaultPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Sales',
            can_manage_medicines: true,
            can_approve_orders: true,
            can_manage_stores: false,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '555-111-2222', is_primary: true }
          ]
        }
      }
    })
  ]);
  
  console.log(`✅ Created ${users.length} users`);
  
  // Create supervision relationships (unary relationship)
  const supervisions = await Promise.all([
    // John supervises Bob
    prisma.supervision.create({
      data: {
        supervisor_id: users[0].id,
        supervisee_id: users[2].id
      }
    }),
    // John supervises Alice
    prisma.supervision.create({
      data: {
        supervisor_id: users[0].id,
        supervisee_id: users[3].id
      }
    }),
    // Sarah supervises Mark
    prisma.supervision.create({
      data: {
        supervisor_id: users[1].id,
        supervisee_id: users[4].id
      }
    })
  ]);
  
  console.log(`✅ Created ${supervisions.length} supervision relationships`);

  // Create supply records (ternary relationship between medicine, store, and user)
  const supplies = await Promise.all([
    // Paracetamol supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[0].store_id,
        user_id: users[0].id, // John Admin
        quantity: 100,
        supply_date: new Date('2024-02-01'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[1].store_id,
        user_id: users[1].id, // Sarah Admin
        quantity: 150,
        supply_date: new Date('2024-02-05'),
        status: 'approved'
      }
    }),
    
    // Ibuprofen supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[1].id,
        store_id: stores[0].store_id,
        user_id: users[2].id, // Bob Employee
        quantity: 75,
        supply_date: new Date('2024-02-15'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[1].id,
        store_id: stores[3].store_id,
        user_id: users[3].id, // Alice Employee
        quantity: 120,
        supply_date: new Date('2024-02-20'),
        status: 'approved'
      }
    }),

    // Aspirin supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[2].id,
        store_id: stores[1].store_id,
        user_id: users[1].id, // Sarah Admin
        quantity: 80,
        supply_date: new Date('2024-03-01'),
        status: 'approved'
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[2].id,
        store_id: stores[4].store_id,
        user_id: users[4].id, // Mark Employee
        quantity: 90,
        supply_date: new Date('2024-03-05'),
        status: 'approved'
      }
    })
  ]);

  console.log(`✅ Created ${supplies.length} supply records`);

  // Create order requests (for approval workflow)
  const orders = await Promise.all([
    // Approved orders
    prisma.order.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[3].store_id,
        requester_id: users[3].id, // Alice requested
        approver_id: users[0].id, // John approved
        quantity: 50,
        status: 'approved',
        notes: 'Urgent requirement',
        approved_at: new Date('2024-05-01'),
        delivered_at: new Date('2024-05-03')
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[1].id,
        store_id: stores[2].store_id,
        requester_id: users[4].id, // Mark requested
        approver_id: users[1].id, // Sarah approved
        quantity: 75,
        status: 'approved',
        notes: 'Regular monthly order',
        approved_at: new Date('2024-05-05'),
        delivered_at: new Date('2024-05-07')
      }
    }),
    
    // Pending orders
    prisma.order.create({
      data: {
        medicine_id: medicines[2].id,
        store_id: stores[0].store_id,
        requester_id: users[2].id, // Bob requested
        quantity: 100,
        status: 'pending',
        notes: 'Preparing for flu season'
      }
    }),
    prisma.order.create({
      data: {
        medicine_id: medicines[3].id,
        store_id: stores[4].store_id,
        requester_id: users[3].id, // Alice requested
        quantity: 60,
        status: 'pending',
        notes: 'Stock running low'
      }
    }),
    
    // Rejected order
    prisma.order.create({
      data: {
        medicine_id: medicines[5].id,
        store_id: stores[1].store_id,
        requester_id: users[4].id, // Mark requested
        approver_id: users[0].id, // John rejected
        quantity: 200,
        status: 'rejected',
        notes: 'Insufficient central stock',
        approved_at: new Date('2024-05-10')
      }
    })
  ]);

  console.log(`✅ Created ${orders.length} order records`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • ${medicines.length} medicines created with stock tracking`);
  console.log(`   • ${stores.length} medical stores created`);
  console.log(`   • ${users.length} users created (${users.filter(u => u.role === 'admin').length} admins, ${users.filter(u => u.role === 'employee').length} employees)`);
  console.log(`   • ${supervisions.length} supervision relationships created`);
  console.log(`   • ${supplies.length} supply records created`);
  console.log(`   • ${orders.length} order requests created (${orders.filter(o => o.status === 'approved').length} approved, ${orders.filter(o => o.status === 'pending').length} pending, ${orders.filter(o => o.status === 'rejected').length} rejected)`);
  console.log('\n🚀 You can now start the server and test the API endpoints!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
