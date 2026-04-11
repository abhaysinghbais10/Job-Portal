const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    category: {
      type: String,
      enum: [
        'Full Stack',
        'Frontend',
        'Backend',
        'Data Science',
        'DevOps',
        'Design',
        'Mobile',
        'Other',
      ],
      default: 'Other',
    },
    techStack: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
    },
    salary: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
