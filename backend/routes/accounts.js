// Account Routes
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

// All account routes require authentication
router.use(authMiddleware);

// GET all accounts
router.get('/', accountController.getAccounts);

// GET account by ID
router.get('/:id', accountController.getAccountById);

// POST create new account
router.post('/', accountController.createAccount);

// PUT update account
router.put('/:id', accountController.updateAccount);

// DELETE account
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
