const Job = require('../models/Job');
const mongoose = require('mongoose');

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

    // Validate and sanitize pagination inputs
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (safePage - 1) * safeLimit;

    // Build filter array from validated/sanitized values only
    const filters = [{ isActive: true }];

    if (search) {
      const safeSearch = escapeRegex(search).slice(0, 200);
      filters.push({
        $or: [
          { title: { $regex: safeSearch, $options: 'i' } },
          { company: { $regex: safeSearch, $options: 'i' } },
          { techStack: { $in: [new RegExp(safeSearch, 'i')] } },
        ],
      });
    }

    // Allow only known enum values for category and type
    const validCategories = ['Full Stack', 'Frontend', 'Backend', 'Data Science', 'DevOps', 'Design', 'Mobile', 'Other'];
    if (category && validCategories.includes(String(category))) {
      filters.push({ category: String(category) });
    }

    const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    if (type && validTypes.includes(String(type))) {
      filters.push({ type: String(type) });
    }

    if (location) {
      filters.push({ location: { $regex: escapeRegex(location).slice(0, 100), $options: 'i' } });
    }

    const finalQuery = { $and: filters };

    const [total, jobs] = await Promise.all([
      Job.countDocuments(finalQuery),
      Job.find(finalQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
    ]);

    res.json({
      jobs,
      total,
      page: safePage,
      pages: Math.ceil(total / safeLimit),
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    console.error('GetJobById error:', error);
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Whitelist only allowed fields to prevent mass assignment
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
      isActive,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (techStack !== undefined) updateData.techStack = techStack;
    if (experience !== undefined) updateData.experience = experience;
    if (salary !== undefined) updateData.salary = salary;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (isActive !== undefined) updateData.isActive = isActive;

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
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
