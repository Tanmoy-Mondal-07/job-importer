const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
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

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
module.exports = Job;