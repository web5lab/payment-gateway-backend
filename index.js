console.log("ok 1")
import 'dotenv/config';
console.log("ok 2")
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import connectDB from './db/connect.js';
import walletRouter from './routes/walletRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
const port = 3000;

// Configure API routes
app.use('/wallets', walletRouter);
app.use('/transactions', transactionRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});
// Database connection
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    logger.info('Database connection established');
    
    app.listen(port, () => {
      logger.info(`Wallet API running on port ${port}`);
      console.log(`Server running on port ${port}`);
    });
    
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

// Start server with DB connection
startServer();
