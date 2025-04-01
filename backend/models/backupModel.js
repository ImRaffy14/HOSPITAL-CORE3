const mongoose = require('mongoose')

const Schema = mongoose.Schema

const backupSchema = new Schema({
    department: { type: String, required: true },
    entity: { type: String, required: true },
    action: { 
        type: String, 
        required: true,
        enum: ['backup', 'backup-summary', 'backup-failed', 'restore', 'other']
    },
    date: { type: Date, default: Date.now },
    details: {
        totalRecords: Number,
        saved: Number,
        skipped: Number,
        errors: Number,
        sampleError: Object,
        failedEntitiesDetails: [String],
        timeElapsedMs: Number,
        error: String,
        stack: [String]
    }
});
module.exports = mongoose.model('backupLogs', backupSchema)