const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema(
    {
        source: { type: String, required: true },
        fileName: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        totalFetched: { type: Number, default: 0 },
        totalImported: { type: Number, default: 0 },
        newJobs: { type: Number, default: 0 },
        updatedJobs: { type: Number, default: 0 },
        failedJobs: { type: [String], default: [] },
    },
    { timestamps: true }
);

const ImportLog = mongoose.models.ImportLog || mongoose.model('ImportLog', importLogSchema);
module.exports = ImportLog;