import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing database connection and basic seeding...');

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

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
    console.log('✅ Data cleaned successfully');

    // Reset sequences
    await prisma.$executeRaw`ALTER SEQUENCE medicines_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE medical_stores_store_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE supplies_supply_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE orders_order_id_seq RESTART WITH 1`;
    console.log('✅ Sequences reset successfully');

    // Create basic test user
    console.log('👤 Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: 'admin',
        primary_phone: '+1555000001',
        is_active: true
      }
    });
    console.log('✅ Test user created:', testUser.email);

    // Create basic test store
    console.log('🏥 Creating test store...');
    const testStore = await prisma.medicalStore.create({
      data: {
        store_name: 'Test Central Pharmacy',
        city: 'New York',
        state: 'New York',
        street_address: '123 Main Street, New York, NY 10001',
        contact_person: 'Alice Johnson',
        phone: '+1555001001',
        email: 'central@pharmacy.com',
        license_number: 'LIC001NY',
        is_active: true
      }
    });
    console.log('✅ Test store created:', testStore.store_name);

    // Create basic test medicine
    console.log('💊 Creating test medicine...');
    const testMedicine = await prisma.medicine.create({
      data: {
        name: 'Test Paracetamol',
        company: 'Sun Pharma',
        batch_number: 'PAR001',
        date_of_manufacture: new Date('2024-01-15'),
        date_of_expiry: new Date('2026-01-15'),
        dosage_form: 'Tablet',
        strength: '500mg',
        stock_quantity: 1000,
        minimum_stock: 100,
        restocked_by: 'admin@example.com'
      }
    });
    console.log('✅ Test medicine created:', testMedicine.name);

    console.log('🎉 Basic test seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during test seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Test seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
