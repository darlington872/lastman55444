# ETHERDOXSHEFZYSMS - Virtual Numbers Marketplace

A vibrant digital marketplace platform focused on virtual numbers for WhatsApp, Telegram, Signal, WeChat and other messaging services with an integrated rewards system.

![ETHERDOXSHEFZYSMS](https://i.imgur.com/placeholder.jpg)

## Features

- **User Authentication & Profiles**: Secure login/registration system with profile management
- **Multi-Service Number Marketplace**: Purchase virtual phone numbers for WhatsApp, Telegram, Signal, WeChat, and more
- **Automatic WhatsApp Forwarding**: Automatic message forwarding to designated WhatsApp number after purchase
- **Dual Wallet System**: Separate wallets for regular balance and referral earnings
- **Referral System**: Earn ₦100 for each successful referral
- **Admin Dashboard**: Comprehensive management for inventory, users, payments, and KYC verification
- **Bulk Number Upload**: Admin tools for uploading multiple numbers at once
- **KYC Verification System**: Identity verification process for enhanced security
- **Modern UI/UX**: Sleek black and purple glassmorphic design with vibrant gradients
- **ETHERVOX AI**: Integrated customer service chatbot
- **Global Coverage**: Support for numbers from 50+ countries worldwide
- **Mobile Responsive**: Optimized experience across all devices

## Deployment on Koyeb

This application is configured for deployment on Koyeb.

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Push your code to the repository
3. Make sure to include all files, including the `koyeb.yaml` configuration

### Step 2: Deploy on Koyeb

1. Create a Koyeb account at [koyeb.com](https://koyeb.com)
2. Connect your GitHub account to Koyeb
3. Create a new application:
   - Select the GitHub repository
   - Select the branch to deploy
   - Koyeb will automatically detect the `koyeb.yaml` configuration
   - Set any required environment variables as specified in the Koyeb dashboard

### Step 3: Verify Deployment

1. Wait for the deployment to complete
2. Visit your application URL provided by Koyeb
3. Test the application functionality

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

The following environment variables are required for configuration:

- `DATABASE_URL` - PostgreSQL database connection string (required)
- `SESSION_SECRET` - Secret used for encrypting session data (required)
- `NODE_ENV` - Set to "production" for production environments
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `BASE_URL` - Base URL of the application for referral link generation

## Special Notes

- **Admin Account**: Use referral code "vesta1212" during signup to create an admin account
- **KYC Verification**: Required for referral rewards withdrawal, but not for direct purchases
- **Customer Support**: Direct support is available via the ETHERVOX AI chatbot
- **Payment Information**: All payments are processed in Nigerian Naira (₦)
- **WhatsApp Forwarding**: All WhatsApp messages are automatically forwarded to +234 708 850 1777
- **Database Migrations**: Use `npm run db:push` to push schema changes to the database

## About The Project

ETHERDOXSHEFZYSMS is a comprehensive marketplace platform for virtual phone numbers designed for various messaging services. The platform features a sleek black and purple glassmorphic UI with vibrant gradient elements, providing an engaging user experience. 

Built using React, Express, PostgreSQL, and leveraging modern design principles, the application offers a seamless experience for buying, selling, and managing virtual phone numbers across multiple communication platforms.