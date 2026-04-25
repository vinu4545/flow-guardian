// Transaction Routes
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// All transaction routes require authentication
router.use(authMiddleware);

// GET all transactions
router.get('/', transactionController.getTransactions);

// GET transaction by ID
router.get('/:id', transactionController.getTransactionById);

// POST create new transaction
router.post('/', transactionController.createTransaction);

// PUT update transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
