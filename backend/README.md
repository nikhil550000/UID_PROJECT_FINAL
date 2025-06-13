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
   - Relationships: One-to-Many with supplies and orders

2. **medical_stores**

   - `store_id` (Primary Key)
   - `store_name` (Store name)
   - Composite attribute: Location
     - `city` (City name)
     - `state` (State name)
     - `pin_code` (Postal code)
   - `created_at`, `updated_at` (Timestamps)
   - Relationships: One-to-Many with supplies and orders

3. **users**

   - `id` (Primary Key)
   - `name` (User name)
   - `email` (Unique)
   - `password` (Hashed)
   - `role` (admin/employee)
   - `is_active` (Boolean)
   - `created_at`, `updated_at` (Timestamps)
   - Multivalued attribute: phone_numbers (stored in separate table)
   - Specialization: Admin or Employee
   - Unary relationship: Admin supervises Employees (many-to-many)
   - Relationships: One-to-Many with supplies and orders

4. **user_phone_numbers** (Multivalued attribute implementation)

   - `id` (Primary Key)
   - `user_id` (Foreign Key to users)
   - `phone` (Phone number)
   - `is_primary` (Boolean)

5. **admins** (Specialization of users)

   - `user_id` (Primary Key, Foreign Key to users)
   - `admin_level` (Integer)

6. **employees** (Specialization of users)

   - `user_id` (Primary Key, Foreign Key to users)
   - `department` (Department name)

7. **supervisions** (Unary relationship implementation)

   - `id` (Primary Key)
   - `supervisor_id` (Foreign Key to users)
   - `supervisee_id` (Foreign Key to users)
   - `assigned_at` (Timestamp)

8. **supplies** (Ternary relationship between medicines, medical_stores, and users)

   - `supply_id` (Primary Key)
   - `medicine_id` (Foreign Key to medicines)
   - `store_id` (Foreign Key to medical_stores)
   - `user_id` (Foreign Key to users)
   - `quantity` (Supply quantity)
   - `supply_date` (Date of supply)
   - `status` (pending/approved)
   - `created_at` (Timestamp)

9. **orders** (For order approval workflow)
   - `order_id` (Primary Key)
   - `medicine_id` (Foreign Key to medicines)
   - `store_id` (Foreign Key to medical_stores)
   - `user_id` (Foreign Key to users who approve the order)
   - `quantity` (Order quantity)
   - `order_date` (Timestamp)
   - `status` (pending/approved)
   - `approved_at` (Timestamp, nullable)

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

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/api/medicines`          | Get all medicines           |
| GET    | `/api/medicines/:id`      | Get medicine by ID          |
| GET    | `/api/medicines/expiring` | Get medicines expiring soon |
| POST   | `/api/medicines`          | Create new medicine         |
| PUT    | `/api/medicines/:id`      | Update medicine             |
| DELETE | `/api/medicines/:id`      | Delete medicine             |

### Medical Stores API

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/stores`              | Get all medical stores |
| GET    | `/api/stores/:id`          | Get store by ID        |
| GET    | `/api/stores/city/:city`   | Get stores by city     |
| GET    | `/api/stores/state/:state` | Get stores by state    |
| POST   | `/api/stores`              | Create new store       |
| PUT    | `/api/stores/:id`          | Update store           |
| DELETE | `/api/stores/:id`          | Delete store           |

### Users API

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/users`                   | Get all users            |
| GET    | `/api/users/:id`               | Get user by ID           |
| GET    | `/api/users/admins`            | Get all admin users      |
| GET    | `/api/users/employees`         | Get all employee users   |
| POST   | `/api/users`                   | Create new user          |
| PUT    | `/api/users/:id`               | Update user              |
| DELETE | `/api/users/:id`               | Delete user              |
| GET    | `/api/users/:id/phone-numbers` | Get user phone numbers   |
| POST   | `/api/users/:id/phone-numbers` | Add phone number to user |

### Supplies API

| Method | Endpoint                             | Description                         |
| ------ | ------------------------------------ | ----------------------------------- |
| GET    | `/api/supplies`                      | Get all supply records              |
| GET    | `/api/supplies/:id`                  | Get supply by ID                    |
| GET    | `/api/supplies/store/:storeId`       | Get medicines supplied to a store   |
| GET    | `/api/supplies/medicine/:medicineId` | Get stores that received a medicine |
| GET    | `/api/supplies/user/:userId`         | Get supplies managed by user        |
| POST   | `/api/supplies`                      | Create new supply record            |
| PUT    | `/api/supplies/:id`                  | Update supply status                |
| DELETE | `/api/supplies/:id`                  | Delete supply record                |

### Orders API

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/orders`                | Get all order records      |
| GET    | `/api/orders/:id`            | Get order by ID            |
| GET    | `/api/orders/pending`        | Get pending orders         |
| GET    | `/api/orders/approved`       | Get approved orders        |
| GET    | `/api/orders/store/:storeId` | Get orders for a store     |
| POST   | `/api/orders`                | Create new order request   |
| PUT    | `/api/orders/:id/approve`    | Approve order (admin only) |
| PUT    | `/api/orders/:id/reject`     | Reject order (admin only)  |

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
    "city": "Downtown",
    "state": "California",
    "pin_code": "90001"
  }'
```

### Create a User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "john.admin@pharma.com",
    "password": "secret123",
    "role": "admin",
    "admin_level": 1,
    "phone_numbers": [
      {"phone": "555-123-4567", "is_primary": true}
    ]
  }'
```

### Record a Supply

```bash
curl -X POST http://localhost:5000/api/supplies \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "store_id": 1,
    "user_id": 1,
    "quantity": 100,
    "supply_date": "2024-02-01",
    "status": "pending"
  }'
```

### Create an Order Request

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "store_id": 1,
    "quantity": 50
  }'
```

### Approve an Order

```bash
curl -X PUT http://localhost:5000/api/orders/1/approve \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1
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

### Get Supplies Managed by a User

```bash
curl http://localhost:5000/api/supplies/user/1
```

### Get Pending Orders

```bash
curl http://localhost:5000/api/orders/pending
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
  "data": {
    /* response data */
  },
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
