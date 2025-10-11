import mongoose, { Schema, Document } from "mongoose";


export interface ImportLog extends Document {
    source: string;
    fileName: string;
    timestamp: Date;
    totalFetched: number;
    totalImported: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: string[];
}

const importLogSchema: Schema<ImportLog> = new Schema(
    {
        source: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        totalFetched: {
            type: Number,
            default: 0
        },
        totalImported: {
            type: Number,
            default: 0
        },
        newJobs: {
            type: Number,
            default: 0
        },
        updatedJobs: {
            type: Number,
            default: 0
        },
        failedJobs: [],
        
    },{ timestamps: true }
);

const ImportLogModel = (mongoose.models.ImportLog as mongoose.Model<ImportLog>) || mongoose.model<ImportLog>("ImportLog", importLogSchema)

export default ImportLogModel;