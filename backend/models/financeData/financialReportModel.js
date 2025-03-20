const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Expenses schema
const expensesSchema = new Schema({
    operatingExpenses: { type: Number, required: true },
    medicalSupplies: { type: Number, required: true },
    medicalEquipments: { type: Number, required: true },
    staffAndWages: { type: Number, required: true },
    insuranceClaims: { type: Number, required: true }
}, { _id: false });

// Define the Liabilities schema
const liabilitiesSchema = new Schema({
    operatingExpenses: { type: Number, required: true },
    medicalSupplies: { type: Number, required: true },
    medicalEquipments: { type: Number, required: true },
    staffAndWages: { type: Number, required: true }
}, { _id: false });

// Define the Assets schema
const assetsSchema = new Schema({
    totalAssets: { type: Number, required: true },
    receivables: { type: Number, required: true }
}, { _id: false });


// Define the main FinancialData schema
const financialDataSchema = new Schema({
    date: { type: Date, default: Date.now() },
    revenue: { type: Number, required: true },
    expenses: { type: expensesSchema, required: true },
    liabilities: { type: liabilitiesSchema, required: true },
    assets: { type: assetsSchema, required: true },
    equity: { type: Number, required: true },
    description: { type: String, require: true},
    preparedBy: { type: String, require: true },
});

// Create the FinancialData model
const FinancialData = mongoose.model('FinancialReport', financialDataSchema);

module.exports = FinancialData;
