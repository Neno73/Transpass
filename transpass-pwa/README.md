# TransPass - Digital Product Passport PWA

TransPass is a Progressive Web Application (PWA) for creating and managing digital product passports. It enables companies to register their products and generate QR codes that consumers can scan to access detailed product information, including components, certifications, and sustainability data.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://transpass.vercel.app/)

## Important Setup Requirements

Before running the application, you need to install the following additional dependencies:

```bash
# Install QR code related dependencies
npm install qrcode html5-qrcode jszip file-saver

# Install TypeScript types for these packages
npm install --save-dev @types/qrcode @types/jszip @types/file-saver
```

## Features

### For Companies

- **Product Management**
  - Create and edit product details
  - Manage product components
  - Track product certifications
  - Organize products by collections

- **QR Code Generation**
  - Generate individual QR codes for each product
  - Create printable QR templates with product info
  - Bulk generate QR codes for multiple products
  - Download QR codes in various formats

- **User Dashboard**
  - Overview of all registered products
  - Analytics on product scans and user engagement
  - Manage company profile and settings

### For Consumers

- **Product Scanning**
  - Scan QR codes directly in the app
  - View detailed product information
  - Verify product authenticity
  - Access sustainability data

- **User Experience**
  - Responsive design works on all devices
  - Fast loading times with PWA capabilities
  - Offline support for previously viewed products

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **QR Technology**: QRCode.js, html5-qrcode
- **Deployment**: Vercel
- **Design System**: Custom component library with Tailwind CSS

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Neno73/Transpass.git
   cd Transpass/transpass-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication, Firestore Database, and Storage
   - Create a Firestore database in the europe-west region
   - Add your Firebase configuration to `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Structure

TransPass uses Firebase Firestore with the following collections:

1. `users` - User accounts
   - uid (string): Firebase Auth user ID
   - email (string): User email
   - displayName (string): User display name
   - isCompany (boolean): Whether user is a company account
   - companyName (string): Name of company (if isCompany = true)

2. `products` - Product digital passports
   - id (string): Unique product ID
   - name (string): Product name
   - description (string): Product description
   - manufacturer (string): Company that manufactures the product
   - model (string): Product model number
   - components (array): Array of component objects
   - createdAt (timestamp): Creation date
   - updatedAt (timestamp): Last update date

3. `companies` - Company profiles
   - id (string): Company ID
   - name (string): Company name
   - description (string): Company description
   - website (string): Company website URL
   - createdAt (timestamp): Creation date
   - updatedAt (timestamp): Last update date

## API Reference

The application primarily uses Firebase SDK for data operations. Here are the main API functions available:

### Authentication

- `signUp(email, password, userData)` - Register a new user
- `signIn(email, password)` - Sign in an existing user
- `signOut()` - Sign out the current user
- `resetPassword(email)` - Send password reset email

### Products

- `createProduct(productData, imageFile)` - Create a new product
- `updateProduct(productId, productData, imageFile)` - Update an existing product
- `getProduct(productId)` - Get a product by ID
- `getProductsByCompany(companyId)` - Get all products for a company
- `deleteProduct(productId)` - Delete a product

### QR Codes

- `generateQRCode(productId, options)` - Generate a QR code data URL
- `downloadQRCode(productId, productName)` - Download a QR code image
- `generatePrintableQRTemplate(productId, productDetails)` - Create printable QR template
- `bulkGenerateQRCodes(products)` - Generate multiple QR codes in a ZIP file

## Design System

TransPass uses a custom design system to ensure consistent UI across the application. The design system includes:

- **Color Palette**: Primary blues, neutrals, and semantic colors
- **Typography**: Standardized font families, sizes, and weights
- **Spacing**: 8-point grid system
- **Components**: Buttons, forms, cards, navigation, and more

For detailed information, refer to the [Design System Documentation](./DESIGN-SYSTEM.md).

## Usage Guide

### Company Registration

1. Navigate to the sign-up page and create an account with your company email
2. Complete your company profile with a description and logo
3. Begin adding products to your catalog

### Creating a Product

1. From your company dashboard, click "Add New Product"
2. Fill in the product details:
   - Name and description
   - Product category and model
   - Origin and manufacturing information
3. Add components to your product (name, weight, materials, recyclability)
4. Upload product images
5. Save your product to generate its digital passport

### Generating QR Codes

1. Navigate to the "QR Codes" section in your dashboard
2. Select products for which you want to generate QR codes
3. Choose the QR code format (standard, printable template, or bulk download)
4. Download the QR codes and apply them to your physical products

### Scanning Products

1. Open the app in a web browser
2. Navigate to the "Scan" page
3. Allow camera access when prompted
4. Position the QR code within the scanner frame
5. View the product details once scanning is successful

## Contributing

We welcome contributions to the TransPass project! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to our team at support@transpass.example.com

---

Built with ❤️ by the TransPass Team