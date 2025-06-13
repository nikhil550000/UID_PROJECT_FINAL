import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.order.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.userPhoneNumber.deleteMany();
  await prisma.supervision.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.medicalStore.deleteMany();

  // Create Users with different roles and permissions
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    // Admins
    prisma.user.create({
      data: {
        name: 'John Admin',
        email: 'john.admin@pharma.com',
        password: hashedPassword,
        role: 'admin',
        admin: {
          create: {
            admin_level: 1
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0101', is_primary: true },
            { phone: '+1-555-0102', is_primary: false }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah SuperAdmin',
        email: 'sarah.superadmin@pharma.com',
        password: hashedPassword,
        role: 'admin',
        admin: {
          create: {
            admin_level: 2
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0201', is_primary: true }
          ]
        }
      }
    }),

    // Employees with various permissions
    prisma.user.create({
      data: {
        name: 'Alice Manager',
        email: 'alice.manager@pharma.com',
        password: hashedPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Management',
            can_manage_medicines: true,
            can_manage_stores: true,
            can_approve_orders: true,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0301', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Pharmacist',
        email: 'bob.pharmacist@pharma.com',
        password: hashedPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Pharmacy',
            can_manage_medicines: true,
            can_manage_stores: false,
            can_approve_orders: true,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0401', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carol StoreManager',
        email: 'carol.store@pharma.com',
        password: hashedPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Store Management',
            can_manage_medicines: false,
            can_manage_stores: true,
            can_approve_orders: false,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0501', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Employee',
        email: 'david.employee@pharma.com',
        password: hashedPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'General',
            can_manage_medicines: false,
            can_manage_stores: false,
            can_approve_orders: false,
            can_manage_supplies: false
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0601', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emma Inventory',
        email: 'emma.inventory@pharma.com',
        password: hashedPassword,
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
            { phone: '+1-555-0701', is_primary: true }
          ]
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Frank Supervisor',
        email: 'frank.supervisor@pharma.com',
        password: hashedPassword,
        role: 'employee',
        employee: {
          create: {
            department: 'Operations',
            can_manage_medicines: true,
            can_manage_stores: true,
            can_approve_orders: true,
            can_manage_supplies: true
          }
        },
        phone_numbers: {
          create: [
            { phone: '+1-555-0801', is_primary: true }
          ]
        }
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create supervision relationships
  console.log('👔 Creating supervision relationships...');
  await Promise.all([
    prisma.supervision.create({
      data: {
        supervisor_id: users[0].id, // John Admin
        supervisee_id: users[2].id  // Alice Manager
      }
    }),
    prisma.supervision.create({
      data: {
        supervisor_id: users[0].id, // John Admin
        supervisee_id: users[3].id  // Bob Pharmacist
      }
    }),
    prisma.supervision.create({
      data: {
        supervisor_id: users[1].id, // Sarah SuperAdmin
        supervisee_id: users[0].id  // John Admin
      }
    }),
    prisma.supervision.create({
      data: {
        supervisor_id: users[2].id, // Alice Manager
        supervisee_id: users[4].id  // Carol StoreManager
      }
    }),
    prisma.supervision.create({
      data: {
        supervisor_id: users[2].id, // Alice Manager
        supervisee_id: users[5].id  // David Employee
      }
    })
  ]);

  // Create Medical Stores across different states
  console.log('🏪 Creating medical stores...');
  const stores = await Promise.all([
    // California stores
    prisma.medicalStore.create({
      data: {
        store_name: 'HealthPlus Pharmacy',
        city: 'Los Angeles',
        state: 'California',
        pin_code: '90210'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'MediCare Central',
        city: 'San Francisco',
        state: 'California',
        pin_code: '94102'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Bay Area Pharmacy',
        city: 'San Jose',
        state: 'California',
        pin_code: '95110'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Sunshine Medical',
        city: 'San Diego',
        state: 'California',
        pin_code: '92101'
      }
    }),

    // New York stores
    prisma.medicalStore.create({
      data: {
        store_name: 'Manhattan Pharmacy',
        city: 'New York',
        state: 'New York',
        pin_code: '10001'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Brooklyn Medical Center',
        city: 'Brooklyn',
        state: 'New York',
        pin_code: '11201'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Queens Health Store',
        city: 'Queens',
        state: 'New York',
        pin_code: '11101'
      }
    }),

    // Texas stores
    prisma.medicalStore.create({
      data: {
        store_name: 'Dallas Drug Store',
        city: 'Dallas',
        state: 'Texas',
        pin_code: '75201'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Houston Health Hub',
        city: 'Houston',
        state: 'Texas',
        pin_code: '77001'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Austin Pharmacy Plus',
        city: 'Austin',
        state: 'Texas',
        pin_code: '73301'
      }
    }),

    // Florida stores
    prisma.medicalStore.create({
      data: {
        store_name: 'Miami Medical Store',
        city: 'Miami',
        state: 'Florida',
        pin_code: '33101'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Orlando Health Center',
        city: 'Orlando',
        state: 'Florida',
        pin_code: '32801'
      }
    }),

    // Illinois stores
    prisma.medicalStore.create({
      data: {
        store_name: 'Chicago Central Pharmacy',
        city: 'Chicago',
        state: 'Illinois',
        pin_code: '60601'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Windy City Medicine',
        city: 'Chicago',
        state: 'Illinois',
        pin_code: '60602'
      }
    }),

    // Washington stores
    prisma.medicalStore.create({
      data: {
        store_name: 'Seattle Pharmacy Network',
        city: 'Seattle',
        state: 'Washington',
        pin_code: '98101'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Emerald City Medical',
        city: 'Seattle',
        state: 'Washington',
        pin_code: '98102'
      }
    })
  ]);

  console.log(`✅ Created ${stores.length} medical stores`);

  // Create a comprehensive list of medicines
  console.log('💊 Creating medicines...');
  const medicines = await Promise.all([
    // Pain Management
    prisma.medicine.create({
      data: {
        name: 'Ibuprofen 400mg',
        company: 'PainRelief Inc',
        date_of_manufacture: new Date('2024-01-15'),
        date_of_expiry: new Date('2026-01-15'),
        price: new Prisma.Decimal(12.99),
        stock_quantity: 500,
        minimum_stock: 50,
        last_restocked_quantity: 200,
        restocked_at: new Date('2025-06-01'),
        restocked_by: users[6].id,
        stock_notes: 'Anti-inflammatory pain reliever'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Acetaminophen 500mg',
        company: 'PainAway Ltd',
        date_of_manufacture: new Date('2024-02-20'),
        date_of_expiry: new Date('2026-02-20'),
        price: new Prisma.Decimal(8.50),
        stock_quantity: 750,
        minimum_stock: 100,
        last_restocked_quantity: 300,
        restocked_at: new Date('2025-05-15'),
        restocked_by: users[3].id,
        stock_notes: 'General pain reliever and fever reducer'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Aspirin 325mg',
        company: 'CardioMed',
        date_of_manufacture: new Date('2024-03-10'),
        date_of_expiry: new Date('2026-03-10'),
        price: new Prisma.Decimal(6.75),
        stock_quantity: 400,
        minimum_stock: 60,
        last_restocked_quantity: 150,
        restocked_at: new Date('2025-05-20'),
        restocked_by: users[2].id,
        stock_notes: 'Pain relief and heart health'
      }
    }),

    // Antibiotics
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin 500mg',
        company: 'AntiBio Pharma',
        date_of_manufacture: new Date('2024-04-05'),
        date_of_expiry: new Date('2026-04-05'),
        price: new Prisma.Decimal(25.99),
        stock_quantity: 200,
        minimum_stock: 30,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-06-05'),
        restocked_by: users[3].id,
        stock_notes: 'Broad-spectrum antibiotic'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Azithromycin 250mg',
        company: 'BioPharma Ltd',
        date_of_manufacture: new Date('2024-05-12'),
        date_of_expiry: new Date('2026-05-12'),
        price: new Prisma.Decimal(45.50),
        stock_quantity: 150,
        minimum_stock: 25,
        last_restocked_quantity: 75,
        restocked_at: new Date('2025-06-10'),
        restocked_by: users[6].id,
        stock_notes: 'Z-pack antibiotic for respiratory infections'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Ciprofloxacin 500mg',
        company: 'MedCore Solutions',
        date_of_manufacture: new Date('2024-06-01'),
        date_of_expiry: new Date('2026-06-01'),
        price: new Prisma.Decimal(35.25),
        stock_quantity: 120,
        minimum_stock: 20,
        last_restocked_quantity: 60,
        restocked_at: new Date('2025-06-08'),
        restocked_by: users[3].id,
        stock_notes: 'Quinolone antibiotic for UTIs and other infections'
      }
    }),

    // Cardiovascular
    prisma.medicine.create({
      data: {
        name: 'Lisinopril 10mg',
        company: 'HeartCare Inc',
        date_of_manufacture: new Date('2024-01-25'),
        date_of_expiry: new Date('2026-01-25'),
        price: new Prisma.Decimal(18.99),
        stock_quantity: 300,
        minimum_stock: 40,
        last_restocked_quantity: 120,
        restocked_at: new Date('2025-05-25'),
        restocked_by: users[2].id,
        stock_notes: 'ACE inhibitor for blood pressure'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Atorvastatin 20mg',
        company: 'CholesterolCare',
        date_of_manufacture: new Date('2024-02-14'),
        date_of_expiry: new Date('2026-02-14'),
        price: new Prisma.Decimal(32.75),
        stock_quantity: 250,
        minimum_stock: 35,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-05-30'),
        restocked_by: users[6].id,
        stock_notes: 'Statin for cholesterol management'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Metoprolol 50mg',
        company: 'BetaBlocker Corp',
        date_of_manufacture: new Date('2024-03-20'),
        date_of_expiry: new Date('2026-03-20'),
        price: new Prisma.Decimal(22.50),
        stock_quantity: 180,
        minimum_stock: 30,
        last_restocked_quantity: 80,
        restocked_at: new Date('2025-06-02'),
        restocked_by: users[3].id,
        stock_notes: 'Beta blocker for heart rate and blood pressure'
      }
    }),

    // Diabetes Management
    prisma.medicine.create({
      data: {
        name: 'Metformin 1000mg',
        company: 'DiabetesCare Plus',
        date_of_manufacture: new Date('2024-04-18'),
        date_of_expiry: new Date('2026-04-18'),
        price: new Prisma.Decimal(15.99),
        stock_quantity: 400,
        minimum_stock: 50,
        last_restocked_quantity: 150,
        restocked_at: new Date('2025-06-03'),
        restocked_by: users[2].id,
        stock_notes: 'First-line diabetes medication'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Insulin Glargine',
        company: 'InsulinTech',
        date_of_manufacture: new Date('2024-05-22'),
        date_of_expiry: new Date('2025-11-22'),
        price: new Prisma.Decimal(89.99),
        stock_quantity: 75,
        minimum_stock: 15,
        last_restocked_quantity: 30,
        restocked_at: new Date('2025-06-07'),
        restocked_by: users[3].id,
        stock_notes: 'Long-acting insulin - refrigerated storage required'
      }
    }),

    // Respiratory
    prisma.medicine.create({
      data: {
        name: 'Albuterol Inhaler',
        company: 'BreathEasy Pharma',
        date_of_manufacture: new Date('2024-03-15'),
        date_of_expiry: new Date('2026-03-15'),
        price: new Prisma.Decimal(45.99),
        stock_quantity: 100,
        minimum_stock: 20,
        last_restocked_quantity: 50,
        restocked_at: new Date('2025-05-28'),
        restocked_by: users[6].id,
        stock_notes: 'Bronchodilator for asthma and COPD'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Fluticasone Nasal Spray',
        company: 'NasalCare Solutions',
        date_of_manufacture: new Date('2024-04-22'),
        date_of_expiry: new Date('2026-04-22'),
        price: new Prisma.Decimal(28.50),
        stock_quantity: 80,
        minimum_stock: 15,
        last_restocked_quantity: 40,
        restocked_at: new Date('2025-06-01'),
        restocked_by: users[2].id,
        stock_notes: 'Steroid nasal spray for allergies'
      }
    }),

    // Mental Health
    prisma.medicine.create({
      data: {
        name: 'Sertraline 50mg',
        company: 'MentalWell Inc',
        date_of_manufacture: new Date('2024-02-28'),
        date_of_expiry: new Date('2026-02-28'),
        price: new Prisma.Decimal(38.99),
        stock_quantity: 200,
        minimum_stock: 25,
        last_restocked_quantity: 80,
        restocked_at: new Date('2025-05-25'),
        restocked_by: users[3].id,
        stock_notes: 'SSRI antidepressant - requires prescription'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Lorazepam 1mg',
        company: 'AnxietyAway Corp',
        date_of_manufacture: new Date('2024-03-30'),
        date_of_expiry: new Date('2026-03-30'),
        price: new Prisma.Decimal(52.75),
        stock_quantity: 60,
        minimum_stock: 10,
        last_restocked_quantity: 30,
        restocked_at: new Date('2025-06-05'),
        restocked_by: users[6].id,
        stock_notes: 'Controlled substance - anxiety medication'
      }
    }),

    // Gastrointestinal
    prisma.medicine.create({
      data: {
        name: 'Omeprazole 20mg',
        company: 'StomachCare Ltd',
        date_of_manufacture: new Date('2024-01-10'),
        date_of_expiry: new Date('2026-01-10'),
        price: new Prisma.Decimal(24.99),
        stock_quantity: 300,
        minimum_stock: 40,
        last_restocked_quantity: 120,
        restocked_at: new Date('2025-05-20'),
        restocked_by: users[2].id,
        stock_notes: 'Proton pump inhibitor for acid reflux'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Loperamide 2mg',
        company: 'DigestiveHealth',
        date_of_manufacture: new Date('2024-05-05'),
        date_of_expiry: new Date('2026-05-05'),
        price: new Prisma.Decimal(12.25),
        stock_quantity: 150,
        minimum_stock: 25,
        last_restocked_quantity: 75,
        restocked_at: new Date('2025-06-04'),
        restocked_by: users[6].id,
        stock_notes: 'Anti-diarrheal medication'
      }
    }),

    // Allergy & Skin
    prisma.medicine.create({
      data: {
        name: 'Cetirizine 10mg',
        company: 'AllergyFree Inc',
        date_of_manufacture: new Date('2024-04-12'),
        date_of_expiry: new Date('2026-04-12'),
        price: new Prisma.Decimal(16.99),
        stock_quantity: 250,
        minimum_stock: 35,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-05-22'),
        restocked_by: users[3].id,
        stock_notes: 'Non-drowsy antihistamine'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Hydrocortisone Cream 1%',
        company: 'SkinCare Solutions',
        date_of_manufacture: new Date('2024-03-25'),
        date_of_expiry: new Date('2026-03-25'),
        price: new Prisma.Decimal(9.99),
        stock_quantity: 120,
        minimum_stock: 20,
        last_restocked_quantity: 60,
        restocked_at: new Date('2025-06-01'),
        restocked_by: users[2].id,
        stock_notes: 'Topical steroid for skin inflammation'
      }
    }),

    // Vitamins & Supplements
    prisma.medicine.create({
      data: {
        name: 'Vitamin D3 2000 IU',
        company: 'HealthyLife Vitamins',
        date_of_manufacture: new Date('2024-06-10'),
        date_of_expiry: new Date('2026-06-10'),
        price: new Prisma.Decimal(19.99),
        stock_quantity: 350,
        minimum_stock: 50,
        last_restocked_quantity: 150,
        restocked_at: new Date('2025-06-11'),
        restocked_by: users[6].id,
        stock_notes: 'Bone health and immune support'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Omega-3 Fish Oil 1000mg',
        company: 'OceanHealth Corp',
        date_of_manufacture: new Date('2024-05-15'),
        date_of_expiry: new Date('2026-05-15'),
        price: new Prisma.Decimal(32.50),
        stock_quantity: 200,
        minimum_stock: 30,
        last_restocked_quantity: 80,
        restocked_at: new Date('2025-06-08'),
        restocked_by: users[3].id,
        stock_notes: 'Heart and brain health supplement'
      }
    }),

    // Emergency/First Aid
    prisma.medicine.create({
      data: {
        name: 'Epinephrine Auto-Injector',
        company: 'EmergencyMed Inc',
        date_of_manufacture: new Date('2024-04-01'),
        date_of_expiry: new Date('2025-10-01'),
        price: new Prisma.Decimal(299.99),
        stock_quantity: 25,
        minimum_stock: 5,
        last_restocked_quantity: 10,
        restocked_at: new Date('2025-06-09'),
        restocked_by: users[2].id,
        stock_notes: 'Emergency allergy treatment - refrigerated storage'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Glucagon Emergency Kit',
        company: 'DiabetesEmerg Corp',
        date_of_manufacture: new Date('2024-05-01'),
        date_of_expiry: new Date('2025-11-01'),
        price: new Prisma.Decimal(189.99),
        stock_quantity: 15,
        minimum_stock: 3,
        last_restocked_quantity: 8,
        restocked_at: new Date('2025-06-07'),
        restocked_by: users[3].id,
        stock_notes: 'Emergency diabetes treatment kit'
      }
    }),

    // Women's Health
    prisma.medicine.create({
      data: {
        name: 'Oral Contraceptive Pills',
        company: 'WomensHealth Plus',
        date_of_manufacture: new Date('2024-03-01'),
        date_of_expiry: new Date('2026-03-01'),
        price: new Prisma.Decimal(45.00),
        stock_quantity: 100,
        minimum_stock: 20,
        last_restocked_quantity: 50,
        restocked_at: new Date('2025-05-28'),
        restocked_by: users[6].id,
        stock_notes: 'Hormonal contraceptive - requires prescription'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Folic Acid 400mcg',
        company: 'PregnancyCare Ltd',
        date_of_manufacture: new Date('2024-04-20'),
        date_of_expiry: new Date('2026-04-20'),
        price: new Prisma.Decimal(14.75),
        stock_quantity: 180,
        minimum_stock: 25,
        last_restocked_quantity: 90,
        restocked_at: new Date('2025-06-02'),
        restocked_by: users[2].id,
        stock_notes: 'Pregnancy vitamin supplement'
      }
    }),

    // Pediatric
    prisma.medicine.create({
      data: {
        name: 'Children\'s Acetaminophen Liquid',
        company: 'KidsCare Pharma',
        date_of_manufacture: new Date('2024-05-10'),
        date_of_expiry: new Date('2026-05-10'),
        price: new Prisma.Decimal(18.99),
        stock_quantity: 120,
        minimum_stock: 20,
        last_restocked_quantity: 60,
        restocked_at: new Date('2025-06-06'),
        restocked_by: users[3].id,
        stock_notes: 'Pediatric fever reducer and pain reliever'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin Pediatric Suspension',
        company: 'ChildMed Solutions',
        date_of_manufacture: new Date('2024-04-25'),
        date_of_expiry: new Date('2026-04-25'),
        price: new Prisma.Decimal(28.50),
        stock_quantity: 80,
        minimum_stock: 15,
        last_restocked_quantity: 40,
        restocked_at: new Date('2025-06-04'),
        restocked_by: users[6].id,
        stock_notes: 'Pediatric antibiotic suspension'
      }
    }),

    // Geriatric/Senior Care
    prisma.medicine.create({
      data: {
        name: 'Donepezil 10mg',
        company: 'MemoryCare Inc',
        date_of_manufacture: new Date('2024-02-15'),
        date_of_expiry: new Date('2026-02-15'),
        price: new Prisma.Decimal(125.99),
        stock_quantity: 50,
        minimum_stock: 10,
        last_restocked_quantity: 25,
        restocked_at: new Date('2025-05-30'),
        restocked_by: users[2].id,
        stock_notes: 'Alzheimer\'s disease medication'
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Calcium + Vitamin D',
        company: 'BoneStrong Corp',
        date_of_manufacture: new Date('2024-06-01'),
        date_of_expiry: new Date('2026-06-01'),
        price: new Prisma.Decimal(22.99),
        stock_quantity: 200,
        minimum_stock: 30,
        last_restocked_quantity: 100,
        restocked_at: new Date('2025-06-10'),
        restocked_by: users[3].id,
        stock_notes: 'Bone health supplement for seniors'
      }
    })
  ]);

  console.log(`✅ Created ${medicines.length} medicines`);

  // Create comprehensive supply records
  console.log('📦 Creating supply records...');
  const supplyRecords = [];
  
  // Create supplies for the past 6 months with varying patterns
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  for (let i = 0; i < 150; i++) {
    const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (currentDate.getTime() - sixMonthsAgo.getTime()));
    const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomQuantity = Math.floor(Math.random() * 200) + 10;
    const statuses = ['pending', 'completed', 'shipped', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    try {
      const supply = await prisma.supply.create({
        data: {
          medicine_id: randomMedicine.id,
          store_id: randomStore.store_id,
          user_id: randomUser.id,
          quantity: randomQuantity,
          supply_date: randomDate,
          status: randomStatus
        }
      });
      supplyRecords.push(supply);
    } catch (error) {
      // Skip if duplicate constraint is violated
      continue;
    }
  }

  console.log(`✅ Created ${supplyRecords.length} supply records`);

  // Create comprehensive order records with realistic patterns
  console.log('📋 Creating orders...');
  const orders = [];

  // Create orders for the past 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  for (let i = 0; i < 100; i++) {
    const randomDate = new Date(threeMonthsAgo.getTime() + Math.random() * (currentDate.getTime() - threeMonthsAgo.getTime()));
    const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
    const randomStore = stores[Math.floor(Math.random() * stores.length)];
    const randomRequester = users[Math.floor(Math.random() * users.length)];
    const randomQuantity = Math.floor(Math.random() * 100) + 5;
    
    // Weight the statuses to be more realistic
    const statusDistribution = ['pending', 'pending', 'approved', 'approved', 'approved', 'delivered', 'delivered', 'delivered', 'delivered', 'rejected'];
    const randomStatus = statusDistribution[Math.floor(Math.random() * statusDistribution.length)];
    
    let approver_id = null;
    let approved_at = null;
    let delivered_at = null;
    let notes = `Order for ${randomMedicine.name} - Quantity: ${randomQuantity}`;

    if (randomStatus === 'approved' || randomStatus === 'delivered' || randomStatus === 'rejected') {
      // Assign an approver (admin or employee with approval permission)
      const approvers = users.filter(u => u.role === 'admin' || (u.id >= 3 && u.id <= 4) || u.id === 7); // Users with approval permissions
      approver_id = approvers[Math.floor(Math.random() * approvers.length)].id;
      approved_at = new Date(randomDate.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Approved within 24 hours
      
      if (randomStatus === 'rejected') {
        notes += ' - REJECTED: Insufficient stock or budget constraints';
      } else if (randomStatus === 'delivered') {
        delivered_at = new Date(approved_at.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Delivered within 7 days
        notes += ' - Successfully delivered';
      }
    }

    const order = await prisma.order.create({
      data: {
        medicine_id: randomMedicine.id,
        store_id: randomStore.store_id,
        requester_id: randomRequester.id,
        approver_id: approver_id,
        quantity: randomQuantity,
        order_date: randomDate,
        status: randomStatus,
        notes: notes,
        approved_at: approved_at,
        delivered_at: delivered_at
      }
    });
    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} orders`);

  // Display summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏪 Medical Stores: ${stores.length}`);
  console.log(`💊 Medicines: ${medicines.length}`);
  console.log(`📦 Supply Records: ${supplyRecords.length}`);
  console.log(`📋 Orders: ${orders.length}`);
  
  console.log('\n🔐 Login Credentials (password: password123):');
  console.log('📧 Admin: john.admin@pharma.com');
  console.log('📧 Super Admin: sarah.superadmin@pharma.com');
  console.log('📧 Manager: alice.manager@pharma.com (full permissions)');
  console.log('📧 Pharmacist: bob.pharmacist@pharma.com (can approve orders)');
  console.log('📧 Store Manager: carol.store@pharma.com');
  console.log('📧 Employee: david.employee@pharma.com');
  console.log('📧 Inventory: emma.inventory@pharma.com');
  console.log('📧 Supervisor: frank.supervisor@pharma.com');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
