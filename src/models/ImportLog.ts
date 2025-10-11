import mongoose, { Schema, Document } from "mongoose";


export interface ImportLog extends Document {
    source: string;
    timestamp: string;
    totalFetched: number;
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
        timestamp: {
            type: String,
            required: true
        },
        totalFetched: {
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