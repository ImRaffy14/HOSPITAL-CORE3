const mongoose = require('mongoose')

const schema = mongoose.Schema

const budgetRecordSchema = new schema ({
    date: { type: Date, default: Date.now(), required: true},
    department: { type: String, require: true},
    amount: { type: Number, required: true},
    budgetType: { type: String, 
                enum: ['Operating Expenses',
                    'Medical Supplies', 
                    'Medical Equipments', 
                    'Staff and Wages'], 
                    required: true},
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], require: true},
}, { timestamps: true })

module.exports = mongoose.model('budgetRecord', budgetRecordSchema)