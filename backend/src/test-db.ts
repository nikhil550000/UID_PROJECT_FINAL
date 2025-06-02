// Test script to verify database CRUD operations
import prisma from './config/database';

async function testCRUDOperations() {
  console.log('🔍 Testing database CRUD operations...\n');

  try {
    // Test 1: CREATE - Add a test medicine
    console.log('1. Testing CREATE operation...');
    const newMedicine = await prisma.medicine.create({
      data: {
        name: 'Test Medicine',
        company: 'Test Pharma Company',
        date_of_manufacture: new Date('2024-01-01'),
        date_of_expiry: new Date('2026-01-01'),
        price: 25.50
      }
    });
    console.log('✅ Medicine created:', newMedicine);

    // Test 2: READ - Get all medicines
    console.log('\n2. Testing READ operation...');
    const medicines = await prisma.medicine.findMany();
    console.log(`✅ Found ${medicines.length} medicine(s) in database`);

    // Test 3: UPDATE - Update the test medicine
    console.log('\n3. Testing UPDATE operation...');
    const updatedMedicine = await prisma.medicine.update({
      where: { id: newMedicine.id },
      data: { price: 30.00 }
    });
    console.log('✅ Medicine updated:', updatedMedicine);

    // Test 4: CREATE Store
    console.log('\n4. Testing CREATE Store...');
    const newStore = await prisma.medicalStore.create({
      data: {
        store_name: 'Test Medical Store',
        location: 'Test Location, City'
      }
    });
    console.log('✅ Store created:', newStore);

    // Test 5: CREATE Supply relationship
    console.log('\n5. Testing CREATE Supply...');
    const newSupply = await prisma.supply.create({
      data: {
        medicine_id: newMedicine.id,
        store_id: newStore.store_id,
        quantity: 100,
        supply_date: new Date()
      }
    });
    console.log('✅ Supply created:', newSupply);

    // Test 6: READ with relationships
    console.log('\n6. Testing READ with relationships...');
    const suppliesWithDetails = await prisma.supply.findMany({
      include: {
        medicine: true,
        store: true
      }
    });
    console.log('✅ Supplies with relationships:', suppliesWithDetails);

    // Test 7: DELETE - Clean up test data
    console.log('\n7. Testing DELETE operations...');
    await prisma.supply.delete({ where: { supply_id: newSupply.supply_id } });
    await prisma.medicine.delete({ where: { id: newMedicine.id } });
    await prisma.medicalStore.delete({ where: { store_id: newStore.store_id } });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All CRUD operations working correctly with PostgreSQL database!');

  } catch (error) {
    console.error('❌ Error during CRUD operations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCRUDOperations();
