# DocSync Admin Panel# React + Vite



A comprehensive admin dashboard for the DocSync telemedicine platform built with React, Vite, and Supabase.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FeaturesCurrently, two official plugins are available:



- **Dashboard Overview** - Real-time statistics and metrics- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **User Management** - View and manage all users (patients, doctors, admins)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Doctor Management** - Handle doctor profiles, specializations, and qualifications

- **Consultations** - Monitor and manage online consultations## React Compiler

- **Health Records** - Access patient health records and medical history

- **Prescriptions** - View prescription details and medicationsThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Subscriptions** - Manage user subscription plans

- **Payments** - Track payment transactions and history## Expanding the ESLint configuration

- **Ratings & Feedback** - Monitor doctor ratings and patient feedback

- **Notifications** - System notifications managementIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- **Settings** - System configuration and admin settings

## 🎨 Theme

The application uses DocSync's brand colors:
- Primary Blue: `#2196F3`
- White: `#FFFFFF`

## 📋 Prerequisites

- Node.js (v20.17.0 or higher recommended)
- npm or yarn
- Supabase account and project

## 🛠️ Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Supabase
The Supabase configuration is in `src/lib/supabase.js` (already configured with your credentials)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 🔐 Authentication

To log in to the admin panel:

1. Create an admin user in your Supabase project
2. Make sure the user has `role = 'admin'` in the users table
3. Use the credentials at `/login`

## 📁 Project Structure

```
docsync-admin/
├── src/
│   ├── components/        # Reusable components
│   ├── context/          # React contexts
│   ├── lib/              # Supabase client
│   ├── pages/            # Page components
│   ├── styles/           # Theme and styles
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # Entry point
├── public/
├── package.json
└── vite.config.js
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (Port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📊 Database Tables

- users, doctors, health_records, prescriptions
- consultations, subscriptions, payments, ratings
- notifications, admin_activity_logs, system_configurations

## 🎯 Key Features

- Real-time data from Supabase
- Responsive design
- Protected routes with authentication
- Data tables with search and filtering
- Modal dialogs for detailed views
- Color-coded status badges
- Clean and modern UI

## 🐛 Troubleshooting

**Authentication Issues:**
- Verify Supabase credentials
- Check user role in database

**Data Not Loading:**
- Check browser console for errors
- Verify Supabase RLS policies

## 👥 Team

DocSync Project - Student IDs: 210041232, 210041253, 210041265
