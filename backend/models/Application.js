const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [50, 'Cover letter must be at least 50 characters'],
    },
    resume: {
      type: String, // file path or URL
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
