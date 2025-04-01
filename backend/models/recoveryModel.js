const mongoose = require('mongoose')

const schema = mongoose.Schema

const recoverySchema = new schema({
    department: { type: String, required: true },
    entity: { type: String, required: true },
    action: { 
        type: String, 
        required: true,
        enum: [
            'recovery-attempt', 
            'recovery-success', 
            'recovery-failed',
            'bulk-recovery-attempt',
            'bulk-recovery-success',
            'bulk-recovery-failed'
        ]
    },
    date: { type: Date, default: Date.now },
    details: {
        modelType: String,
        recordId: schema.Types.Mixed,
        status: String,
        durationMs: Number,
        recordsRecovered: Number,
        error: String,
        stack: [String],
        response: {
            status: Number,
            statusText: String
        }
    }
});

module.exports = mongoose.model('recoveryLogs', recoverySchema)