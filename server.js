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

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'SmartExpense API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});
