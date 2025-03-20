// routes/recoveryRoutes.js
const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

// POST route for data recovery
router.post('/recover-data', recoveryController.recoverData);
router.post('/recover-all', recoveryController.recoverAllData);

module.exports = router;