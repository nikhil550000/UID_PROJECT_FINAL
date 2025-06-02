
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create medicines
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: 'Paracetamol',
        company: 'PharmaCorp',
        date_of_manufacture: new Date('2024-01-15'),
        date_of_expiry: new Date('2026-01-15'),
        price: 12.50
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Ibuprofen',
        company: 'MediTech Solutions',
        date_of_manufacture: new Date('2024-02-10'),
        date_of_expiry: new Date('2026-02-10'),
        price: 18.75
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Aspirin',
        company: 'HealthCare Inc',
        date_of_manufacture: new Date('2024-03-05'),
        date_of_expiry: new Date('2025-03-05'),
        price: 8.90
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin',
        company: 'BioPharma Ltd',
        date_of_manufacture: new Date('2024-01-20'),
        date_of_expiry: new Date('2025-06-20'),
        price: 25.30
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Vitamin D3',
        company: 'NutriMed',
        date_of_manufacture: new Date('2024-04-01'),
        date_of_expiry: new Date('2026-04-01'),
        price: 15.60
      }
    }),
    prisma.medicine.create({
      data: {
        name: 'Cough Syrup',
        company: 'ReliefCare',
        date_of_manufacture: new Date('2024-05-10'),
        date_of_expiry: new Date('2025-05-10'),
        price: 22.40
      }
    })
  ]);

  console.log(`✅ Created ${medicines.length} medicines`);

  // Create medical stores
  const stores = await Promise.all([
    prisma.medicalStore.create({
      data: {
        store_name: 'City Medical Store',
        location: 'Downtown District, 123 Main Street'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'HealthPlus Pharmacy',
        location: 'Riverside Area, 456 Oak Avenue'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'MediCare Center',
        location: 'Uptown Mall, 789 Pine Road'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Wellness Drugstore',
        location: 'Suburban Plaza, 321 Elm Street'
      }
    }),
    prisma.medicalStore.create({
      data: {
        store_name: 'Quick Relief Pharmacy',
        location: 'Airport District, 654 Cedar Lane'
      }
    })
  ]);

  console.log(`✅ Created ${stores.length} medical stores`);

  // Create supply records
  const supplies = await Promise.all([
    // Paracetamol supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[0].store_id,
        quantity: 100,
        supply_date: new Date('2024-02-01')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[1].store_id,
        quantity: 150,
        supply_date: new Date('2024-02-05')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[0].id,
        store_id: stores[2].store_id,
        quantity: 200,
        supply_date: new Date('2024-02-10')
      }
    }),

    // Ibuprofen supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[1].id,
        store_id: stores[0].store_id,
        quantity: 75,
        supply_date: new Date('2024-02-15')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[1].id,
        store_id: stores[3].store_id,
        quantity: 120,
        supply_date: new Date('2024-02-20')
      }
    }),

    // Aspirin supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[2].id,
        store_id: stores[1].store_id,
        quantity: 80,
        supply_date: new Date('2024-03-01')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[2].id,
        store_id: stores[4].store_id,
        quantity: 90,
        supply_date: new Date('2024-03-05')
      }
    }),

    // Amoxicillin supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[3].id,
        store_id: stores[2].store_id,
        quantity: 50,
        supply_date: new Date('2024-03-10')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[3].id,
        store_id: stores[3].store_id,
        quantity: 60,
        supply_date: new Date('2024-03-15')
      }
    }),

    // Vitamin D3 supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[4].id,
        store_id: stores[0].store_id,
        quantity: 200,
        supply_date: new Date('2024-04-01')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[4].id,
        store_id: stores[4].store_id,
        quantity: 180,
        supply_date: new Date('2024-04-05')
      }
    }),

    // Cough Syrup supplies
    prisma.supply.create({
      data: {
        medicine_id: medicines[5].id,
        store_id: stores[1].store_id,
        quantity: 40,
        supply_date: new Date('2024-05-01')
      }
    }),
    prisma.supply.create({
      data: {
        medicine_id: medicines[5].id,
        store_id: stores[2].store_id,
        quantity: 35,
        supply_date: new Date('2024-05-05')
      }
    })
  ]);

  console.log(`✅ Created ${supplies.length} supply records`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • ${medicines.length} medicines created`);
  console.log(`   • ${stores.length} medical stores created`);
  console.log(`   • ${supplies.length} supply relationships created`);
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
