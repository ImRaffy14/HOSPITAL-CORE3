const backupService = require('../service/backupService')

exports.getFinanceData = async (req, res) => { 
    try {
        const result = await backupService.getFinanceData()
        res.status(200).json(result)
    } catch (error) {
        console.error('Get Finance Error:', error.message)
        res.status(500).send()
    }
}

exports.getFinanceDataCore = async (req, res) => {
    try {
        const result = await backupService.financeData()
        res.status(200).json(result)
    } catch (error) {
        console.error('Get Finance to Core Error:', error.message)
        res.status(500).send()
    }
}