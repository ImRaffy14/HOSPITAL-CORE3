const dashboardService = require('../service/dashboardService');

exports.getBackupStats = async (req, res) => {
    try {
        const stats = await dashboardService.getBackupStats();
        res.json(stats);
    } catch (error) {
        console.error('Error in getBackupStats:', error);
        res.status(500).json({ error: 'Failed to get backup statistics' });
    }
};

exports.getRecentBackups = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const backups = await dashboardService.getRecentBackups(limit);
        res.json(backups);
    } catch (error) {
        console.error('Error in getRecentBackups:', error);
        res.status(500).json({ error: 'Failed to get recent backups' });
    }
};

exports.getRecentRecoveries = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        const recoveries = await dashboardService.getRecentRecoveries(limit);
        res.json(recoveries);
    } catch (error) {
        console.error('Error in getRecentRecoveries:', error);
        res.status(500).json({ error: 'Failed to get recent recoveries' });
    }
};