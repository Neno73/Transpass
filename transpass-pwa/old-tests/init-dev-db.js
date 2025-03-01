const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Initialize the app with admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

// Get Firestore instance and set specific settings
const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true
});

// Sample data for development
const sampleData = {
  users: [
    {
      displayName: "John Doe",
      email: "john@example.com",
      isCompany: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      displayName: "Jane Smith",
      email: "jane@example.com",
      isCompany: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      displayName: "Acme Corp",
      email: "info@acme.com",
      isCompany: true,
      companyName: "Acme Corporation",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],
  products: [
    {
      name: "Eco-Friendly Water Bottle",
      description: "Sustainable water bottle made from recycled materials",
      manufacturer: "Green Products Inc",
      model: "ECO-WB-100",
      category: "Kitchenware",
      tags: ["eco-friendly", "recycled", "sustainable"],
      components: [
        {
          name: "Bottle Body",
          description: "Main container",
          material: "Recycled PET",
          weight: 150,
          recyclable: true,
          certifications: ["BPA-Free", "FDA Approved"]
        },
        {
          name: "Cap",
          description: "Twist-off cap",
          material: "Recycled Polypropylene",
          weight: 25,
          recyclable: true
        }
      ],
      createdBy: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "Smart Fitness Tracker",
      description: "Advanced fitness tracker with heart rate monitoring",
      manufacturer: "TechFit",
      model: "FIT-200",
      category: "Electronics",
      tags: ["fitness", "wearable", "smart"],
      components: [
        {
          name: "Main Unit",
          description: "Electronic module",
          material: "ABS Plastic",
          weight: 35,
          recyclable: false
        },
        {
          name: "Band",
          description: "Adjustable wristband",
          material: "Silicone",
          weight: 30,
          recyclable: true
        },
        {
          name: "Battery",
          description: "Rechargeable battery",
          material: "Lithium-ion",
          weight: 10,
          recyclable: true,
          certifications: ["UL Certified"]
        }
      ],
      createdBy: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],
  companies: [
    {
      name: "Green Products Inc",
      description: "Manufacturer of sustainable household products",
      website: "https://greenproducts.example.com",
      contactEmail: "contact@greenproducts.example.com",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "TechFit",
      description: "Leading producer of fitness technology devices",
      website: "https://techfit.example.com",
      contactEmail: "info@techfit.example.com",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// Function to populate the database with sample data
async function populateDatabase() {
  try {
    console.log("Starting database population with sample data...");
    
    // Add sample users
    console.log("Adding sample users...");
    for (const user of sampleData.users) {
      const userId = user.email.replace('@', '-').replace('.', '-');
      await db.collection('users').doc(userId).set(user);
      console.log(`Added user: ${user.displayName}`);
    }
    
    // Add sample companies
    console.log("Adding sample companies...");
    for (const company of sampleData.companies) {
      const docRef = await db.collection('companies').add(company);
      console.log(`Added company: ${company.name} with ID: ${docRef.id}`);
    }
    
    // Add sample products
    console.log("Adding sample products...");
    for (const product of sampleData.products) {
      const docRef = await db.collection('products').add(product);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }
    
    console.log("Database population completed successfully!");
    return true;
  } catch (error) {
    console.error("Error populating database:", error);
    return false;
  }
}

// Run the database population
async function run() {
  try {
    await populateDatabase();
    console.log("All sample data has been added to the database");
  } catch (error) {
    console.error("Database population failed:", error);
  } finally {
    process.exit();
  }
}

// Execute
run();