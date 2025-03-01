/**
 * Firestore Database Seeding
 * 
 * Run this script to populate the database with sample data
 * for development and testing purposes.
 * 
 * Usage:
 *   node lib/seed-database.js
 */

const { db, verifyDatabaseConnection } = require('./firebase-admin');

// Sample product data
const products = [
  {
    id: 'product-1',
    name: 'Eco-Friendly Water Bottle',
    description: 'Reusable water bottle made from recycled materials',
    materials: ['Recycled Plastic', 'Silicone', 'Stainless Steel'],
    recyclable: true,
    imageUrl: 'https://example.com/bottle.jpg',
    companyId: 'company-1',
    components: [
      { name: 'Bottle Body', material: 'Recycled Plastic', recyclable: true },
      { name: 'Cap', material: 'Silicone', recyclable: true },
      { name: 'Filter', material: 'Activated Carbon', recyclable: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'product-2',
    name: 'Sustainable Backpack',
    description: 'Durable backpack made from sustainable materials',
    materials: ['Organic Cotton', 'Recycled Polyester', 'Hemp'],
    recyclable: true,
    imageUrl: 'https://example.com/backpack.jpg',
    companyId: 'company-1',
    components: [
      { name: 'Main Compartment', material: 'Organic Cotton', recyclable: true },
      { name: 'Zippers', material: 'Recycled Metal', recyclable: true },
      { name: 'Straps', material: 'Hemp', recyclable: true }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'product-3',
    name: 'Solar-Powered Charger',
    description: 'Portable solar charger for electronic devices',
    materials: ['Recycled Plastic', 'Solar Panels', 'Lithium Battery'],
    recyclable: false,
    imageUrl: 'https://example.com/charger.jpg',
    companyId: 'company-2',
    components: [
      { name: 'Solar Panel', material: 'Monocrystalline Silicon', recyclable: false },
      { name: 'Battery', material: 'Lithium-ion', recyclable: false },
      { name: 'Case', material: 'Recycled Plastic', recyclable: true }
    ],
    createdAt: new Date().toISOString()
  }
];

// Sample company data
const companies = [
  {
    id: 'company-1',
    name: 'EcoInnovate',
    description: 'Creating sustainable products for everyday use',
    logo: 'https://example.com/ecoinnovate-logo.jpg',
    website: 'https://ecoinnovate.example.com',
    foundedYear: 2015,
    createdAt: new Date().toISOString()
  },
  {
    id: 'company-2',
    name: 'GreenTech Solutions',
    description: 'Technology solutions with minimal environmental impact',
    logo: 'https://example.com/greentech-logo.jpg',
    website: 'https://greentech.example.com',
    foundedYear: 2018,
    createdAt: new Date().toISOString()
  }
];

// Sample user data
const users = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    companyId: 'company-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    email: 'company@example.com',
    name: 'Company User',
    role: 'company',
    companyId: 'company-2',
    createdAt: new Date().toISOString()
  }
];

/**
 * Seeds the database with sample data
 */
async function seedDatabase() {
  try {
    console.log('🔄 Verifying database connection...');
    const connected = await verifyDatabaseConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed. Make sure the database exists and is configured correctly.');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    console.log('🔄 Beginning database seeding...');
    
    // Seed companies
    console.log('🔄 Seeding companies collection...');
    for (const company of companies) {
      await db.collection('companies').doc(company.id).set(company);
    }
    console.log(`✅ Added ${companies.length} companies`);
    
    // Seed products
    console.log('🔄 Seeding products collection...');
    for (const product of products) {
      await db.collection('products').doc(product.id).set(product);
    }
    console.log(`✅ Added ${products.length} products`);
    
    // Seed users
    console.log('🔄 Seeding users collection...');
    for (const user of users) {
      await db.collection('users').doc(user.id).set(user);
    }
    console.log(`✅ Added ${users.length} users`);
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Execute the seeding
seedDatabase();