import Transaction from '../models/Transaction.js';

export const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, date, method } = req.body;
    if (!title || !amount || !type) return res.status(400).json({ message: 'Missing required fields' });
    if (type === 'expense' && !['cash','upi','card','bank'].includes(method)) {
      return res.status(400).json({ message: 'Expense method must be one of cash, upi, card, bank' });
    }

    const tx = await Transaction.create({
      userId: req.user.userId,
      title,
      amount,
      type,
      method: type === 'expense' ? method : undefined,
      date: date ? new Date(date) : new Date(),
    });
    return res.status(201).json(tx);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    const { from, to, date, method } = req.query;
    const query = { userId };

    if (date) {
      const d = new Date(String(date));
      if (!isNaN(d)) {
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
      }
    } else if (from || to) {
      const range = {};
      if (from) {
        const f = new Date(String(from));
        if (!isNaN(f)) { const s = new Date(f); s.setHours(0,0,0,0); range.$gte = s; }
      }
      if (to) {
        const t = new Date(String(to));
        if (!isNaN(t)) { const e = new Date(t); e.setHours(23,59,59,999); range.$lte = e; }
      }
      if (Object.keys(range).length) query.date = range;
    }

    // If method filter is provided, include all incomes and only expenses with the given method
    if (method && ['cash', 'upi', 'card', 'bank'].includes(String(method))) {
      query.$or = [
        { type: 'income' },
        { type: 'expense', method: String(method) },
      ];
    }

    const list = await Transaction.find(query).sort({ date: -1 });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOne({ _id: id, userId: req.user.userId });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    await tx.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

