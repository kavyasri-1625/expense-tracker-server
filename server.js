import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.js';
import expenseRoutes from './src/routes/expenses.js';
import { connectDB } from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Setup (important for connecting frontend & backend)
app.use(
  cors({
    origin: [
      'https://expense-tracker-client2.onrender.com', // your deployed frontend
      'http://localhost:5173', // for local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ Body parser (for JSON requests)
app.use(express.json());

// ✅ Test route to verify backend is working
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'SmartExpense API' });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// ✅ Connect MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
    process.exit(1);
  });
