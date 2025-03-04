# TransPass PWA Project Documentation

## Project Structure

The TransPass PWA project is organized as follows:

- `app/`: Next.js app directory with page components
  - `auth/`: Authentication pages (login, register)
  - `company/`: Company dashboard and product management 
  - `user/`: User dashboard and profile
  - `scan/`: QR code scanner
  - `p/`: Product public pages

- `components/`: Reusable UI components
  - `ui/`: Core UI components (buttons, forms, etc.)
  - `landing/`: Landing page sections
  - Other specific component groups

- `lib/`: Core functionality and services
  - Firebase configuration and utilities
  - Authentication context and helpers
  - Product and QR code utilities

- `public/`: Static assets and resources
  - Images, icons, and other assets
  - Manifest file for PWA functionality

## Database Schema

The TransPass PWA uses Firebase Firestore with the following collections:

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

## Useful Commands

### Database Management

```bash
# Purge all Firestore collections (users, products, companies)
node scripts/purge-collections.js

# Purge all Firebase data (Auth + Firestore)
node scripts/purge-db.js
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Firebase Configuration

The project uses Firebase for:
- Authentication
- Firestore Database (europe-west region)
- Storage
- Analytics

The database connection includes:
- Explicit region endpoint configuration
- Retry mechanism with exponential backoff
- Proper error handling

## Completed Tasks

1. Enhanced Product Creation Process:
   - Added color selection functionality with color picker
   - Implemented advanced validation for all product creation fields
   - Created product templates/duplicating for faster product creation

2. Expanded QR Code Functionality:
   - Improved QR scanner with better error handling and flash support
   - Added bulk QR code generation for companies
   - Created printable QR code templates with product details

3. Improved Documentation:
   - Created comprehensive README with project details
   - Added user documentation for both companies and consumers
   - Documented API endpoints and database schema

## Next Tasks

1. Implement Component Analytics:
   - Add weight and material totals to the analytics tab
   - Show sustainability metrics based on component data

2. Implement Bulk Component Management:
   - Create interface for importing multiple components
   - Add batch operations on components

3. Enhance Certification Management:
   - Create dedicated interface for managing certifications
   - Add support for certification documentation