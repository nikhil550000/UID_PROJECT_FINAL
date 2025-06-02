
# PharmaCare Database System

A comprehensive pharmaceutical company database management system built with React, Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

### Core Functionality
- **Medicine Management**: Add, edit, delete, and track pharmaceutical products
- **Medical Store Management**: Manage store locations and details
- **Supply Chain Tracking**: Record and monitor medicine supplies to stores
- **Many-to-Many Relationships**: Track which medicines are supplied to which stores
- **Expiry Monitoring**: Alert system for medicines expiring within 30 days
- **Analytics Dashboard**: View supply statistics and relationships

### Technical Features
- **RESTful API**: Complete CRUD operations for all entities
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live data synchronization
- **Type Safety**: Full TypeScript implementation
- **Database Normalization**: Proper foreign key relationships

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **PostgreSQL** database
- **CORS** for cross-origin requests
- **dotenv** for environment variables

## 📁 Project Structure

```
pharma-database/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── Dashboard.tsx   # Main dashboard component
│   │   │   ├── MedicineManagement.tsx
│   │   │   ├── StoreManagement.tsx
│   │   │   └── SupplyManagement.tsx
│   │   ├── pages/             # Application pages
│   │   │   └── Index.tsx      # Main application page
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend Express application
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   │   ├── medicines.js   # Medicine CRUD endpoints
│   │   │   ├── stores.js      # Store CRUD endpoints
│   │   │   └── supplies.js    # Supply tracking endpoints
│   │   ├── controllers/       # Request handlers
│   │   │   ├── medicineController.js
│   │   │   ├── storeController.js
│   │   │   └── supplyController.js
│   │   ├── models/            # Database models (Prisma)
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # Authentication middleware
│   │   │   ├── validation.js  # Request validation
│   │   │   └── errorHandler.js
│   │   ├── config/            # Configuration files
│   │   │   └── database.js    # Database connection
│   │   └── utils/             # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.js           # Database seeding
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🗄️ Database Schema

### Entities and Relationships

#### Medicines Table
```sql
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  medicine_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  manufacture_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Medical Stores Table
```sql
CREATE TABLE medical_stores (
  store_id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Supplies Table (Junction Table)
```sql
CREATE TABLE supplies (
  id SERIAL PRIMARY KEY,
  medicine_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  supply_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES medical_stores(store_id) ON DELETE CASCADE
);
```

### Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Medicine {
  id               Int      @id @default(autoincrement())
  medicine_name    String   @db.VarChar(255)
  company_name     String   @db.VarChar(255)
  manufacture_date DateTime @db.Date
  expiry_date      DateTime @db.Date
  price            Decimal  @db.Decimal(10, 2)
  supplies         Supply[]
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  @@map("medicines")
}

model MedicalStore {
  store_id   Int      @id @default(autoincrement())
  store_name String   @db.VarChar(255)
  location   String
  supplies   Supply[]
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("medical_stores")
}

model Supply {
  id          Int          @id @default(autoincrement())
  medicine_id Int
  store_id    Int
  quantity    Int
  supply_date DateTime     @db.Date
  medicine    Medicine     @relation(fields: [medicine_id], references: [id], onDelete: Cascade)
  store       MedicalStore @relation(fields: [store_id], references: [store_id], onDelete: Cascade)
  created_at  DateTime     @default(now())

  @@map("supplies")
}
```

## 🚀 API Endpoints

### Medicine Endpoints
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create new medicine
- `GET /api/medicines/:id` - Get medicine by ID
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Store Endpoints
- `GET /api/stores` - Get all medical stores
- `POST /api/stores` - Create new store
- `GET /api/stores/:id` - Get store by ID
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Supply Endpoints
- `GET /api/supplies` - Get all supply records
- `POST /api/supplies` - Create new supply record
- `GET /api/supplies/:id` - Get supply by ID
- `PUT /api/supplies/:id` - Update supply record
- `DELETE /api/supplies/:id` - Delete supply record

### Relationship Endpoints
- `GET /api/stores/:id/medicines` - Get all medicines supplied to a store
- `GET /api/medicines/:id/stores` - Get all stores that received a medicine
- `GET /api/supplies/by-store/:id` - Get supply history for a store
- `GET /api/supplies/by-medicine/:id` - Get supply history for a medicine

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd pharma-database/server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pharma_db"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharma_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000

# JWT (for authentication)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

5. **Database Setup**
```bash
# Create database
createdb pharma_db

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
```

6. **Start the server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to client directory**
```bash
cd ../client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

### Package.json Files

#### Server package.json
```json
{
  "name": "pharma-database-server",
  "version": "1.0.0",
  "description": "Pharmaceutical database management system backend",
  "main": "src/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "migrate": "npx prisma migrate dev",
    "seed": "node prisma/seed.js",
    "studio": "npx prisma studio"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.1",
    "joi": "^17.9.2",
    "express-rate-limit": "^6.8.1"
  },
  "devDependencies": {
    "@types/node": "^20.4.2",
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.2",
    "typescript": "^5.1.6",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "prisma": "^5.0.0",
    "jest": "^29.6.1",
    "@types/jest": "^29.5.3"
  }
}
```

#### Client package.json
```json
{
  "name": "pharma-database-client",
  "version": "1.0.0",
  "description": "Pharmaceutical database management system frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "@tanstack/react-query": "^4.29.19",
    "axios": "^1.4.0",
    "lucide-react": "^0.263.1",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^1.2.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.1"
  }
}
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Database Management
```bash
# View database in Prisma Studio
npm run studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name
```

### Code Quality
```bash
# Lint frontend code
cd client
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_production_client_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Roadmap

### Version 2.0 Features
- [ ] User authentication and authorization
- [ ] Advanced reporting and analytics
- [ ] Inventory management
- [ ] Automated expiry notifications
- [ ] Multi-location support
- [ ] API rate limiting
- [ ] Comprehensive logging
- [ ] Data export/import functionality

---

**Note**: This is a demonstration application. For production use, implement proper authentication, authorization, input validation, and security measures.
