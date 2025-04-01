const backupLogs = require('../models/backupModel');
const recoveryLogs = require('../models/recoveryModel');

class DashboardService {
    async getBackupStats() {
        try {
            // Get total backup count
            const totalBackups = await backupLogs.countDocuments();
            
            // Get most recent backup
            const lastBackup = await backupLogs.findOne()
                .sort({ date: -1 })
                .select('date');
            
            // Get system statuses (example implementation)
            const systems = await backupLogs.aggregate([
                {
                    $group: {
                        _id: "$entity",
                        lastBackup: { $max: "$date" },
                        status: { 
                            $last: {
                                $cond: [
                                    { $eq: ["$action", "backup-failed"] },
                                    "error",
                                    { $ifNull: ["$details.status", "healthy"] }
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        name: "$_id",
                        lastBackup: 1,
                        status: 1,
                        _id: 0
                    }
                }
            ]);

            // Get recovery count
            const recoveryCount = await recoveryLogs.countDocuments({
                action: { $in: ['recovery-success', 'bulk-recovery-success'] }
            });

            // Get failed backup count
            const failedBackups = await backupLogs.countDocuments({
                action: 'backup-failed'
            });

            return {
                totalBackups,
                lastBackup: lastBackup?.date || null,
                storageUsed: await this.getStorageUsage(),
                storageCapacity: "5TB", // This could be dynamic
                recoveryCount,
                failedBackups,
                systems
            };
        } catch (error) {
            console.error('Error getting backup stats:', error);
            throw error;
        }
    }

    async getStorageUsage() {
        // Implement actual storage calculation logic here
        // This is a placeholder - you might query your storage system
        return "1.2TB";
    }

    async getRecentBackups(limit = 4) {
        return backupLogs.find({})
            .sort({ date: -1 })
            .limit(limit)
            .select('entity date action details');
    }

    async getRecentRecoveries(limit = 4) {
        return recoveryLogs.find({
            action: { $in: ['recovery-success', 'bulk-recovery-success', 'bulk-recovery-failed'] }
        })
        .sort({ date: -1 })
        .limit(limit)
        .select('entity date details');
    }
}

module.exports = new DashboardService();