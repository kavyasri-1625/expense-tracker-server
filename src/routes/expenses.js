import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { addTransaction, getAllTransactions, deleteTransaction } from '../controllers/expenseController.js';

const router = Router();

router.post('/add', auth, addTransaction);
router.get('/all/:userId', auth, getAllTransactions);
router.delete('/:id', auth, deleteTransaction);

export default router;
