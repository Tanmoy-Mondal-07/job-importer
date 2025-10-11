import mongoose, { Schema, Document } from "mongoose";

export interface Job extends Document {
    source: string; // API URL
    externalId: string; // Unique ID from API feed
    title: string;
    company: string;
    location?: string;
    description: string;
    category?: string;
    type?: string;
    url: string;
    postedAt?: Date;
    updatedAt?: Date;
    createdAt?: Date;
}

const jobSchema: Schema<Job> = new Schema(
    {
        source: { type: String, required: true },
        externalId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        description: { type: String, required: true },
        category: String,
        type: String,
        url: { type: String, required: true },
        postedAt: Date,
    },
    { timestamps: true }
);

const JobModel = (mongoose.models.Job as mongoose.Model<Job>) || mongoose.model<Job>("Job", jobSchema)

export default JobModel;