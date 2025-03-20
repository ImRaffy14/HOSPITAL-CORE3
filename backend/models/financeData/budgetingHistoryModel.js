const mongoose = require('mongoose')

const schema = mongoose.Schema

const budgetAllocationSchema = new schema({
    officerId: { type: String, required: true },
    officer: { type: String, required: true },
    budgetType: {
        type: String,
        enum: ['Operating Expenses',
                'Medical Supplies',
                'Medical Equipments',
                'Staff and Wages',
                'Insurance Claims'],
        required: true },
    amount: { type: Number, required: true}
}, { timestamps: true })

module.exports = mongoose.model('BudgetAllocation', budgetAllocationSchema)