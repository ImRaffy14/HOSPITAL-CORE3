const backupController = require('../controllers/backupController')
const express = require('express')

const router = express.Router()

router.get('/get-finance-data', backupController.getFinanceData)

router.get('/get-finance-data-core', backupController.getFinanceDataCore)

module.exports = router