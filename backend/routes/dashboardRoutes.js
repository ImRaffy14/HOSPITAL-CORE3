const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Backup statistics
router.get('/stats', dashboardController.getBackupStats);

// Recent backups
router.get('/backups/recent', dashboardController.getRecentBackups);

// Recent recoveries
router.get('/recoveries/recent', dashboardController.getRecentRecoveries);

module.exports = router;