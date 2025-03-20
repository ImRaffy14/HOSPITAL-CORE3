// services/recoveryService.js
const axios = require('axios');
const billingRecord = require('../models/financeData/billingModel');
const budgetHistoryRecord = require('../models/financeData/budgetingHistoryModel');
const budgetRecord = require('../models/financeData/budgetRecordsModel');
const financialReportRecord = require('../models/financeData/financialReportModel');
const insuranceClaimRecord = require("../models/financeData/insuranceClaimsModel");
const userDataRecord = require('../models/financeData/users');

exports.dataRecover = async ({ id, model }) => {
    try {
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
            throw new Error("Record not found");
        }

        // Send the recovered data to the finance server API
        const financeServerUrl = process.env.FINANCE_SERVER_API_URL; 
        const response = await axios.post(`${financeServerUrl}/finance-recovery/save`, {
            model, // Send the model name
            data: record // Send the record data
        });

        // Return the response from the finance server
        return response.data;
    } catch (error) {
        console.error("Error in recovery service:", error.message);
        throw error;
    }
};

exports.recoverAllData = async (model) => {
    try {
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
            throw new Error("No records found for the specified model");
        }

        // Send the recovered data to the finance server API
        const financeServerUrl = process.env.FINANCE_SERVER_API_URL; 
        const response = await axios.post(`${financeServerUrl}/finance-recovery/save`, {
            model, // Send the model name
            data: records // Send all records
        });

        // Return the response from the finance server
        return response.data;
    } catch (error) {
        console.error("Error in recoverAllData service:", error.message);
        throw error;
    }
};