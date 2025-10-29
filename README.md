# Beauty Hospital CRM System

A comprehensive Customer Relationship Management system for beauty hospitals built with NestJS (backend) and Next.js (frontend).

## System Architecture

- **Backend**: NestJS with gRPC microservices
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: SQLite
- **Communication**: gRPC protocol

## Features

- Customer Management
- Consultation and Diagnosis
- Appointment Scheduling
- Treatment Tracking
- Membership and Loyalty Programs
- Marketing Campaigns
- Financial Management
- Staff Management with Role-Based Access Control

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Development Mode

To start both frontend and backend in development mode:

```bash
./start.sh
```

This will start:
- Backend API server on http://localhost:3000
- Backend gRPC server on localhost:50051
- Frontend dashboard on http://localhost:3001

### Manual Start

Alternatively, you can start each service manually:

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Seeding Initial Data

To seed the database with initial test data:

```bash
cd backend
npm run seed
```

This will create:
- 20 customers
- 20 consultations
- 20 appointments
- 20 treatments
- 20 orders
- Staff accounts with different roles
- Membership records
- Marketing campaigns

## Admin Accounts

After seeding, you can log in with the following admin account:

- **Email**: admin@beautyhospital.com
- **Password**: admin123

## API Documentation

The backend provides both RESTful APIs and gRPC services:

- REST API: http://localhost:3000/api
- gRPC Services: Defined in `backend/src/proto` directory

## Project Structure

```
beauty-hospital-crm/
├── backend/
│   ├── src/
│   │   ├── entities/          # Database entities
│   │   ├── modules/           # Feature modules
│   │   ├── proto/             # gRPC proto files
│   │   ├── seeder/            # Data seeding
│   │   └── main.ts            # Application entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   └── components/        # Reusable components
│   └── package.json
└── start.sh                   # Start script
```

## Technologies Used

### Backend
- NestJS
- TypeScript
- gRPC
- TypeORM
- SQLite
- Passport.js (Authentication)
- JWT (JSON Web Tokens)

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React

## License

This project is licensed under the MIT License.