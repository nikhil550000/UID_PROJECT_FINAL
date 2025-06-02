import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import medicineRoutes from './routes/medicines';
import storeRoutes from './routes/stores';
import supplyRoutes from './routes/supplies';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    // allow both your .env CLIENT_URL and the dev port 8080
    origin: [
      process.env.CLIENT_URL || "", 
      "http://localhost:8080"
    ],
    credentials: true
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pharmaceutical API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/supplies', supplyRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Pharmaceutical API ready at http://localhost:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/health`);
});

export default app;
