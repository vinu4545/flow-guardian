// Alert Routes
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

// All alert routes require authentication
router.use(authMiddleware);

// GET all alerts
router.get('/', alertController.getAlerts);

// GET alert by ID
router.get('/:id', alertController.getAlertById);

// POST create new alert
router.post('/', alertController.createAlert);

// PUT update alert
router.put('/:id', alertController.updateAlert);

// DELETE alert
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
