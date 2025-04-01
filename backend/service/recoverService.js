// services/recoveryService.js
const axios = require('axios');
const billingRecord = require('../models/financeData/billingModel');
const budgetHistoryRecord = require('../models/financeData/budgetingHistoryModel');
const budgetRecord = require('../models/financeData/budgetRecordsModel');
const financialReportRecord = require('../models/financeData/financialReportModel');
const insuranceClaimRecord = require("../models/financeData/insuranceClaimsModel");
const userDataRecord = require('../models/financeData/users');
const recoveryLogs = require('../models/recoveryModel');


const createRecoveryLog = async (department, entity, action, details = {}) => {
    try {
        const logEntry = await recoveryLogs.create({
            department,
            entity,
            action,
            date: new Date(),
            details
        });
        return logEntry;
    } catch (logError) {
        console.error('Failed to create recovery log:', logError);
        throw logError;
    }
};

exports.dataRecover = async ({ id, model }) => {
    const startTime = new Date();
    let logDetails = {
        recordId: id,
        modelType: model,
        status: 'started'
    };

    try {
        // Create initial log
        await createRecoveryLog(
            'Finance',
            model,
            'recovery-attempt',
            logDetails
        );

        let record;

        // Determine the correct model based on the request
        switch (model) {
            case "billing":
                record = await billingRecord.findById(id);
                break;
            case "budgetHistory":
                record = await budgetHistoryRecord.findById(id);
                break;
            case "budget":
                record = await budgetRecord.findById(id);
                break;
            case "financialReport":
                record = await financialReportRecord.findById(id);
                break;
            case "insuranceClaim":
                record = await insuranceClaimRecord.findById(id);
                break;
            case "userData":
                record = await userDataRecord.findById(id);
                break;
            default:
                throw new Error("Invalid model specified");
        }

        if (!record) {
            logDetails.status = 'failed';
            logDetails.error = 'Record not found';
            await createRecoveryLog('Finance', model, 'recovery-failed', logDetails);
            throw new Error("Record not found");
        }

        // Send the recovered data to the finance server API
        const financeServerUrl = process.env.FINANCE_SERVER_API_URL; 
        const response = await axios.post(`${financeServerUrl}/finance-recovery/save`, {
            model,
            data: record
        });

        // Log successful recovery
        logDetails.status = 'completed';
        logDetails.durationMs = new Date() - startTime;
        logDetails.response = {
            status: response.status,
            statusText: response.statusText
        };
        
        await createRecoveryLog('Finance', model, 'recovery-success', logDetails);

        return response.data;
    } catch (error) {
        // Log the error
        logDetails.status = 'failed';
        logDetails.error = error.message;
        logDetails.durationMs = new Date() - startTime;
        logDetails.stack = error.stack?.split('\n');
        
        await createRecoveryLog('Finance', model, 'recovery-failed', logDetails);

        console.error("Error in recovery service:", error.message);
        throw error;
    }
};

exports.recoverAllData = async (model) => {
    const startTime = new Date();
    let logDetails = {
        modelType: model,
        status: 'started',
        recoveryType: 'full'
    };

    try {
        // Create initial log
        await createRecoveryLog(
            'Finance',
            model,
            'bulk-recovery-attempt',
            logDetails
        );

        let records;

        // Determine the correct model based on the request
        switch (model) {
            case "billing":
                records = await billingRecord.find({});
                break;
            case "budgetHistory":
                records = await budgetHistoryRecord.find({});
                break;
            case "budget":
                records = await budgetRecord.find({});
                break;
            case "financialReport":
                records = await financialReportRecord.find({});
                break;
            case "insuranceClaim":
                records = await insuranceClaimRecord.find({});
                break;
            case "userData":
                records = await userDataRecord.find({});
                break;
            default:
                throw new Error("Invalid model specified");
        }

        if (!records || records.length === 0) {
            logDetails.status = 'failed';
            logDetails.error = 'No records found';
            await createRecoveryLog('Finance', model, 'bulk-recovery-failed', logDetails);
            throw new Error("No records found for the specified model");
        }

        // Send the recovered data to the finance server API
        const financeServerUrl = process.env.FINANCE_SERVER_API_URL; 
        const response = await axios.post(`${financeServerUrl}/finance-recovery/save`, {
            model,
            data: records
        });

        // Log successful recovery
        logDetails.status = 'completed';
        logDetails.durationMs = new Date() - startTime;
        logDetails.recordsRecovered = records.length;
        logDetails.response = {
            status: response.status,
            statusText: response.statusText
        };
        
        await createRecoveryLog('Finance', model, 'bulk-recovery-success', logDetails);

        return response.data;
    } catch (error) {
        // Log the error
        logDetails.status = 'failed';
        logDetails.error = error.message;
        logDetails.durationMs = new Date() - startTime;
        logDetails.stack = error.stack?.split('\n');
        
        await createRecoveryLog('Finance', model, 'bulk-recovery-failed', logDetails);

        console.error("Error in recoverAllData service:", error.message);
        throw error;
    }
};