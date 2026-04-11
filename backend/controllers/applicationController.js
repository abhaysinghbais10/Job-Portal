const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter } = req.body;

    if (!jobId || !name || !email || !coverLetter) {
      return res.status(400).json({
        message: 'Please provide job ID, name, email, and cover letter',
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'You have already applied for this job' });
    }

    const resumePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      name,
      email,
      phone,
      coverLetter,
      resume: resumePath,
    });

    await application.populate('job', 'title company location');

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'You have already applied for this job' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error during application' });
  }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate('job', 'title company location type techStack salary')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('GetMyApplications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications
// @access  Private (admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('GetAllApplications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status (admin)
// @route   PUT /api/applications/:id/status
// @access  Private (admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job', 'title company');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Status updated successfully', application });
  } catch (error) {
    console.error('UpdateStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
