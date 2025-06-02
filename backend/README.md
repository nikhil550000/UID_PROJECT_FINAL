
# Pharmaceutical Company Backend API

A comprehensive RESTful API for managing pharmaceutical company database operations including medicines, medical stores, and supply chain tracking.

## 🚀 Technology Stack

- **Node.js** with TypeScript
- **Express.js** framework
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **Zod** for request validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── medicineController.ts
│   │   ├── storeController.ts
│   │   └── supplyController.ts
│   ├── routes/               # API route definitions
│   │   ├── medicines.ts
│   │   ├── stores.ts
│   │   └── supplies.ts
│   ├── middleware/           # Express middleware
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── types/               # TypeScript types and Zod schemas
│   │   └── index.ts
│   ├── config/              # Configuration files
│   │   └── database.ts
│   └── index.ts             # Application entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── schema.sql          # Raw SQL schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Database seeding script
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Tables

1. **medicines**
   - `id` (Primary Key)
   - `name` (Medicine name)
   - `company` (Manufacturing company)
   - `date_of_manufacture` (Manufacturing date)
   - `date_of_expiry` (Expiry date)
   - `price` (Price in decimal)
   - `created_at`, `updated_at` (Timestamps)

2. **medical_stores**
   - `store_id` (Primary Key)
   - `store_name` (Store name)
   - `location` (Store location)
   - `created_at`, `updated_at` (Timestamps)

3. **supplies** (Junction table for many-to-many relationship)
   - `supply_id` (Primary Key)
   - `medicine_id` (Foreign Key to medicines)
   - `store_id` (Foreign Key to medical_stores)
   - `quantity` (Supply quantity)
   - `supply_date` (Date of supply)
   - `created_at` (Timestamp)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pharma_db?schema=public"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

5. **Database setup**
```bash
# Create database
createdb pharma_db

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed
```

6. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Medicines API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines |
| GET | `/api/medicines/:id` | Get medicine by ID |
| GET | `/api/medicines/expiring` | Get medicines expiring soon |
| POST | `/api/medicines` | Create new medicine |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |

### Medical Stores API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Get all medical stores |
| GET | `/api/stores/:id` | Get store by ID |
| GET | `/api/stores/location/:location` | Get stores by location |
| POST | `/api/stores` | Create new store |
| PUT | `/api/stores/:id` | Update store |
| DELETE | `/api/stores/:id` | Delete store |

### Supplies API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/supplies` | Get all supply records |
| GET | `/api/supplies/:id` | Get supply by ID |
| GET | `/api/supplies/store/:storeId` | Get medicines supplied to a store |
| GET | `/api/supplies/medicine/:medicineId` | Get stores that received a medicine |
| POST | `/api/supplies` | Create new supply record |
| PUT | `/api/supplies/:id` | Update supply record |
| DELETE | `/api/supplies/:id` | Delete supply record |

## 📝 API Usage Examples

### Create a Medicine
```bash
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol",
    "company": "PharmaCorp",
    "date_of_manufacture": "2024-01-15",
    "date_of_expiry": "2026-01-15",
    "price": 12.50
  }'
```

### Create a Medical Store
```bash
curl -X POST http://localhost:5000/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "store_name": "City Medical Store",
    "location": "Downtown District, 123 Main Street"
  }'
```

### Record a Supply
```bash
curl -X POST http://localhost:5000/api/supplies \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "store_id": 1,
    "quantity": 100,
    "supply_date": "2024-02-01"
  }'
```

### Get Medicines Supplied to a Store
```bash
curl http://localhost:5000/api/supplies/store/1
```

### Get Stores that Received a Medicine
```bash
curl http://localhost:5000/api/supplies/medicine/1
```

## 🔧 Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Open Prisma Studio (database GUI)
npm run studio

# Reset database (careful!)
npm run reset

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🛡️ Request Validation

All API endpoints include comprehensive request validation using Zod schemas:

- **Type safety**: Full TypeScript support
- **Data validation**: Automatic request body validation
- **Error handling**: Detailed validation error messages
- **Schema definitions**: Centralized validation rules

## 📊 Database Operations

### Prisma Studio
Access the database GUI at `http://localhost:5555`:
```bash
npm run studio
```

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Database Seeding
The seed script creates sample data:
- 6 medicines with different companies and expiry dates
- 5 medical stores in various locations
- 13 supply records establishing relationships

```bash
npm run seed
```

## 🔍 Error Handling

The API includes comprehensive error handling:

- **Validation errors**: 400 status with detailed field errors
- **Not found errors**: 404 status for missing resources
- **Conflict errors**: 409 status for duplicate entries
- **Server errors**: 500 status with error logging
- **Consistent format**: All errors follow the same response structure

## 📈 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
PORT=5000
CLIENT_URL=your_frontend_url
```

### Build and Deploy
```bash
# Build the application
npm run build

# Start in production mode
npm start
```

## 🧪 Testing

### Sample API Responses

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Detailed error message"
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write descriptive commit messages
5. Test API endpoints thoroughly

## 📄 License

This project is licensed under the MIT License.

---

**🏥 Ready to manage your pharmaceutical database!**

For questions or support, please refer to the API documentation or create an issue in the repository.
