# ETHERDOXSHEFZYSMS - WhatsApp Number Marketplace

A WhatsApp number marketplace platform with a referral system and admin management

## Features

- User authentication and profile management
- WhatsApp number marketplace with purchase system
- Referral system (earn a free number after 20 successful referrals)
- Admin dashboard for inventory, user, and payment management
- KYC verification system
- Dark theme interface

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

The following environment variables can be set for configuration:

- `NODE_ENV` - Set to "production" for production environments
- `PORT` - Server port (default: 5000)
- `HOST` - Server host (default: 0.0.0.0)

## Special Notes

- Admin code: Use referral code "vesta1212" during signup to create an admin account
- KYC is required for referral rewards, but not for direct purchases