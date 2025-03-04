# Transpass

A product authentication and traceability platform built with Next.js and Firebase.

## Project Structure

The project is organized as follows:

- `transpass-pwa/`: The main Next.js application containing all project code
  - `app/`: Next.js app directory with page components
  - `components/`: Reusable UI components
  - `lib/`: Core functionality and services (Firebase, auth, products)
  - `public/`: Static assets and resources

## Getting Started

```bash
# Navigate to the main app directory
cd transpass-pwa

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Features

- Product digital passports with QR codes
- Authentication for companies and users
- Company dashboard for product management
- Scanner for verifying product authenticity

## Screenshots

See image files in the root directory for UI examples:
- landing-page.png: Main marketing page
- login-page.png: User authentication
- register-page.png: Account creation
- company-dashboard.png: Company product management
- scanner-page.png: QR code scanning interface