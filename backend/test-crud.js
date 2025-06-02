// Simple test to verify CRUD operations work with the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCRUD() {
  try {
    console.log('🔄 Testing database CRUD operations...');
    
    // CREATE - Add a test medicine
    console.log('➕ Creating a test medicine...');
    const medicine = await prisma.medicine.create({
      data: {
        name: 'Test Medicine',
        company: 'Test Pharma Co.',
        date_of_manufacture: new Date('2024-01-01'),
        date_of_expiry: new Date('2026-01-01'),
        price: 25.50
      }
    });
    console.log('✅ Medicine created:', medicine);
    
    // READ - Get all medicines
    console.log('📖 Reading all medicines...');
    const medicines = await prisma.medicine.findMany();
    console.log('✅ Found medicines:', medicines.length);
    
    // UPDATE - Update the test medicine
    console.log('✏️ Updating the test medicine...');
    const updatedMedicine = await prisma.medicine.update({
      where: { id: medicine.id },
      data: { price: 30.00 }
    });
    console.log('✅ Medicine updated:', updatedMedicine);
    
    // DELETE - Remove the test medicine
    console.log('🗑️ Deleting the test medicine...');
    await prisma.medicine.delete({
      where: { id: medicine.id }
    });
    console.log('✅ Medicine deleted successfully');
    
    console.log('🎉 All CRUD operations working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing CRUD operations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCRUD();
