import mongoose, { Schema, Document } from "mongoose";

export interface Job extends Document {
    externalId: string;
    title: string;
    company: string;
    location?: string;
    description: string;
    type?: string;
    url: string;
    postedAt?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

const jobSchema: Schema<Job> = new Schema(
    {
        externalId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        description: { type: String, required: true },
        type: String,
        url: { type: String, required: true },
        postedAt: { type: String, required: true },
    },
    { timestamps: true }
);

const JobModel = (mongoose.models.Job as mongoose.Model<Job>) || mongoose.model<Job>("Job", jobSchema)

export default JobModel;