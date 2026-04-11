const Job = require('../models/Job');

// Escape special regex characters to prevent ReDoS
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @desc    Get all jobs (with search/filter)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search, category, type, location, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { company: { $regex: safeSearch, $options: 'i' } },
        { techStack: { $in: [new RegExp(safeSearch, 'i')] } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // Allow only known enum values for category and type
    const validCategories = ['Full Stack', 'Frontend', 'Backend', 'Data Science', 'DevOps', 'Design', 'Mobile', 'Other'];
    if (category && category !== 'All' && validCategories.includes(category)) {
      query.category = category;
    }

    const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    if (type && type !== 'All' && validTypes.includes(type)) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: escapeRegex(location), $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('GetJobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    console.error('GetJobById error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      category,
      techStack,
      experience,
      salary,
      description,
      requirements,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      category,
      techStack,
      experience,
      salary,
      description,
      requirements,
      postedBy: req.user._id,
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('CreateJob error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('UpdateJob error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('DeleteJob error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
