const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });

    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'user@example.com',
        password: hashedPassword,
        defaultCountry: 'US',
        defaultCurrency: 'USD',
        timezone: 'UTC',
        language: 'en',
      }
    });

    console.log('Demo user created successfully:', user.email);
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoUser();