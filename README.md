# ShipSeva Admin Panel

A comprehensive admin panel for the ShipSeva logistics platform built with Next.js 15, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- **Modern Admin Interface**: Clean, responsive design with dark/light mode support
- **Authentication**: Secure admin login with role-based access control
- **User Management**: View, edit, and manage platform users
- **Order Management**: Track and manage shipping orders
- **KYC Management**: Review and approve KYC applications
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Real-time Updates**: Live data updates using Redux Toolkit Query

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Forms**: Formik with Yup validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_PANEL_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── login/         # Login page
│   │   ├── users/         # User management
│   │   ├── orders/        # Order management
│   │   ├── kyc/           # KYC management
│   │   └── analytics/     # Analytics dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   └── ui/                # UI components
├── lib/                   # Utility functions
├── store/                 # Redux store
│   ├── api/               # RTK Query APIs
│   └── slices/            # Redux slices
└── types/                 # TypeScript type definitions
```

## Admin Roles & Permissions

### Super Admin
- Full access to all features
- Can manage other admins
- System configuration access

### Admin
- User management
- Order management
- KYC approval
- Analytics access

### Moderator
- Limited user management
- Order status updates
- KYC review (no approval)

## API Integration

The admin panel integrates with the backend API through RTK Query:

- **Authentication**: `/api/auth/admin/*`
- **Users**: `/api/admin/users/*`
- **Orders**: `/api/admin/orders/*`
- **KYC**: `/api/admin/kyc/*`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure the following environment variables are set:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_ADMIN_PANEL_URL` - Admin panel URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.