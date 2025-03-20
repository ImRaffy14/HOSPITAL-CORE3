const axios = require('axios');
const billingRecord = require('../models/financeData/billingModel');
const budgetHistoryRecord = require('../models/financeData/budgetingHistoryModel');
const budgetRecord = require('../models/financeData/budgetRecordsModel');
const financialReportRecord = require('../models/financeData/financialReportModel');
const insuranceClaimRecord = require("../models/financeData/insuranceClaimsModel");
const userDataRecord = require('../models/financeData/users');

exports.getFinanceData = async () => {
    try {
        console.log(`[${new Date().toISOString()}] Manual Back Up for Finance Initialized...... `);
        // Fetch data from the external API
        const result = await axios.get('https://backend-finance.nodadogenhospital.com/api/get-data');
        const data = result.data;

        // Function to check if a document exists in the database
        const documentExists = async (model, query) => {
            const existingDoc = await model.findOne(query);
            return existingDoc !== null;
        };

        // Logging function for saved data
        const logSavedData = (modelName, data) => {
            console.log(`[${new Date().toISOString()}] Saved ${modelName}:`, JSON.stringify(data, null, 2));
        };

        // Logging function for already saved data
        logAlreadySavedData = (modelName, data) => {
            console.log(`[${new Date().toISOString()}] No backup needed for ${modelName}: Data already exists`);
        };

        // Save billing data
        for (const billing of data.billing) {
            const exists = await documentExists(billingRecord, { _id: billing._id });
            if (!exists) {
                await billingRecord.create(billing);
                logSavedData('Billing', billing);
            }
        }

        // Save budget history data
        for (const budgetHistory of data.budgetingHistory) {
            const exists = await documentExists(budgetHistoryRecord, { _id: budgetHistory._id });
            if (!exists) {
                await budgetHistoryRecord.create(budgetHistory);
                logSavedData('Budget History', budgetHistory);
            }
        }

        // Save budget data
        for (const budget of data.budget) {
            const exists = await documentExists(budgetRecord, { _id: budget._id });
            if (!exists) {
                await budgetRecord.create(budget);
                logSavedData('Budget', budget);
            }
        }

        // Save financial report data
        for (const financialReport of data.financialReport) {
            const exists = await documentExists(financialReportRecord, { _id: financialReport._id });
            if (!exists) {
                await financialReportRecord.create(financialReport);
                logSavedData('Financial Report', financialReport);
            }
        }

        // Save insurance claim data
        for (const insuranceClaim of data.insuranceClaims) {
            const exists = await documentExists(insuranceClaimRecord, { _id: insuranceClaim._id });
            if (!exists) {
                await insuranceClaimRecord.create(insuranceClaim);
                logSavedData('Insurance Claim', insuranceClaim);
            }
        }

        // Save user data
        for (const user of data.user) {
            const exists = await documentExists(userDataRecord, { _id: user._id });
            if (!exists) {
                await userDataRecord.create(user);
                logSavedData('User', user);
            }
        }

        console.log(`[${new Date().toISOString()}] Manual Back Up for Finance Done `);
        return { message: "Data synchronization completed successfully." };
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error during data synchronization:`, error);
        throw error;
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