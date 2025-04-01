const axios = require('axios');
const billingRecord = require('../models/financeData/billingModel');
const budgetHistoryRecord = require('../models/financeData/budgetingHistoryModel');
const budgetRecord = require('../models/financeData/budgetRecordsModel');
const financialReportRecord = require('../models/financeData/financialReportModel');
const insuranceClaimRecord = require("../models/financeData/insuranceClaimsModel");
const userDataRecord = require('../models/financeData/users');
const backupLogs = require('../models/backupModel')

// Function to create backup logs
const createBackupLog = async (department, entity, action, details = {}) => {
    try {
        const logEntry = await backupLogs.create({
            department,
            entity,
            action,
            date: new Date(),
            details
        });
        return logEntry;
    } catch (logError) {
        console.error(`[${new Date().toISOString()}] Failed to create backup log:`, logError);
        throw logError; // Re-throw if you want to handle this differently
    }
};


exports.getFinanceData = async () => {
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] Manual Back Up for Finance Initialized...`);

    try {
        // Fetch data from the external API
        const result = await axios.get('https://backend-finance.nodadogenhospital.com/api/get-data');
        const data = result.data;

        // Generic function to backup data for a specific model
        const backupData = async (model, data, entityName) => {
            let savedCount = 0;
            let skippedCount = 0;
            const errors = [];

            if (!data || !Array.isArray(data)) {
                console.warn(`[${new Date().toISOString()}] No data array provided for ${entityName}`);
                return {
                    entity: entityName,
                    saved: 0,
                    skipped: 0,
                    errors: 0
                };
            }

            for (const item of data) {
                try {
                    if (!item || !item._id) {
                        errors.push({
                            item,
                            error: "Invalid item format - missing _id"
                        });
                        continue;
                    }

                    const exists = await model.findOne({ _id: item._id });
                    if (!exists) {
                        await model.create(item);
                        savedCount++;
                    } else {
                        skippedCount++;
                    }
                } catch (error) {
                    errors.push({
                        itemId: item?._id,
                        error: error.message
                    });
                    console.error(`[${new Date().toISOString()}] Error saving ${entityName} record ${item?._id}:`, error);
                }
            }

            // Create log for this entity
            await createBackupLog(
                'Finance',
                entityName,
                'backup',
                {
                    totalRecords: data.length,
                    saved: savedCount,
                    skipped: skippedCount,
                    errors: errors.length,
                    ...(errors.length > 0 && { sampleError: errors[0] }) // Include first error as sample
                }
            );

            return {
                entity: entityName,
                saved: savedCount,
                skipped: skippedCount,
                errors: errors.length
            };
        };

        // Backup all entities
        const backupResults = await Promise.allSettled([
            backupData(billingRecord, data.billing, 'Billing'),
            backupData(budgetHistoryRecord, data.budgetingHistory, 'BudgetHistory'),
            backupData(budgetRecord, data.budget, 'Budget'),
            backupData(financialReportRecord, data.financialReport, 'FinancialReport'),
            backupData(insuranceClaimRecord, data.insuranceClaims, 'InsuranceClaim'),
            backupData(userDataRecord, data.user, 'User')
        ]);

        // Process results
        const successfulResults = backupResults
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);

        const failedResults = backupResults
            .filter(result => result.status === 'rejected')
            .map(result => result.reason);

        // Create summary
        const summary = {
            totalEntities: successfulResults.length,
            totalRecords: successfulResults.reduce((sum, r) => sum + (r.saved + r.skipped), 0),
            totalSaved: successfulResults.reduce((sum, r) => sum + r.saved, 0),
            totalSkipped: successfulResults.reduce((sum, r) => sum + r.skipped, 0),
            totalErrors: successfulResults.reduce((sum, r) => sum + r.errors, 0),
            failedEntities: failedResults.length,
            durationMs: new Date() - startTime
        };

        // Create summary log
        await createBackupLog(
            'Finance',
            'All',
            'backup-summary',
            {
                ...summary,
                ...(failedResults.length > 0 && { 
                    failedEntitiesDetails: failedResults.map(f => f.message) 
                })
            }
        );

        console.log(`[${new Date().toISOString()}] Manual Back Up for Finance Completed`, summary);
        
        if (failedResults.length > 0) {
            console.warn(`[${new Date().toISOString()}] Some entities failed to backup:`, failedResults);
        }

        return { 
            success: true,
            message: "Data synchronization completed",
            details: summary,
            ...(failedResults.length > 0 && { warnings: failedResults })
        };

    } catch (error) {
        // Create error log
        await createBackupLog(
            'Finance',
            'All',
            'backup-failed',
            {
                error: error.message,
                ...(error.stack && { stack: error.stack.split('\n') }),
                timeElapsedMs: new Date() - startTime
            }
        );

        console.error(`[${new Date().toISOString()}] Error during data synchronization:`, error);
        throw {
            success: false,
            message: "Data synchronization failed",
            error: error.message,
            timeElapsedMs: new Date() - startTime
        };
    }
};

exports.financeData = async () => {
        const billing = await billingRecord.find({})
        const budgetHistory = await budgetHistoryRecord.find({})
        const budget = await budgetRecord.find({})
        const financialReport = await financialReportRecord.find({})
        const insuranceClaim = await insuranceClaimRecord.find({})
        const userData = await userDataRecord.find({})

        const data = {
            billing,
            budgetHistory,
            budget,
            financialReport,
            insuranceClaim,
            userData
        }

        return data
}