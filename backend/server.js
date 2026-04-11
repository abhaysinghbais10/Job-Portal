const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// General rate limiter (100 requests per 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Stricter limiter for auth routes (20 requests per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', generalLimiter);

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Job Portal API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    // Seed sample jobs on first run
    await seedJobs();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Seed initial job data
async function seedJobs() {
  const Job = require('./models/Job');
  const count = await Job.countDocuments();
  if (count === 0) {
    const jobs = [
      {
        title: 'MERN Stack Developer',
        company: 'TechCorp Solutions',
        location: 'Bangalore, India',
        type: 'Full-time',
        techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
        experience: '2-4 years',
        salary: '₹8-15 LPA',
        description:
          'We are looking for an experienced MERN Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications.',
        requirements: [
          'Strong proficiency in JavaScript',
          'Experience with React.js',
          'Knowledge of Node.js and Express',
          'MongoDB experience',
          'RESTful API design',
        ],
        category: 'Full Stack',
      },
      {
        title: 'Java Developer',
        company: 'Infosys Technologies',
        location: 'Hyderabad, India',
        type: 'Full-time',
        techStack: ['Java', 'Spring Boot', 'MySQL', 'Hibernate'],
        experience: '3-5 years',
        salary: '₹10-18 LPA',
        description:
          'Join our core Java team to build enterprise-level applications. Work on challenging projects with cutting-edge technology.',
        requirements: [
          'Core Java expertise',
          'Spring Boot framework',
          'SQL/NoSQL databases',
          'Microservices architecture',
          'REST API development',
        ],
        category: 'Backend',
      },
      {
        title: 'Full Stack Developer',
        company: 'Wipro Digital',
        location: 'Pune, India',
        type: 'Full-time',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        experience: '2-5 years',
        salary: '₹12-20 LPA',
        description:
          'Exciting opportunity for a Full Stack Developer to work on innovative products. Be part of a fast-growing team building next-gen applications.',
        requirements: [
          'React.js / Angular',
          'Node.js backend development',
          'Database design',
          'Docker & Kubernetes',
          'Agile methodologies',
        ],
        category: 'Full Stack',
      },
      {
        title: 'Data Analyst',
        company: 'Analytics India Pvt Ltd',
        location: 'Mumbai, India',
        type: 'Full-time',
        techStack: ['Python', 'SQL', 'Tableau', 'Power BI'],
        experience: '1-3 years',
        salary: '₹6-12 LPA',
        description:
          'We are seeking a Data Analyst to interpret data and turn it into information which can offer ways to improve business.',
        requirements: [
          'Proficiency in Python',
          'SQL expertise',
          'Data visualization tools',
          'Statistical analysis',
          'Excel / Google Sheets',
        ],
        category: 'Data Science',
      },
      {
        title: 'React.js Developer',
        company: 'StartupHub',
        location: 'Delhi, India',
        type: 'Full-time',
        techStack: ['React', 'Redux', 'TypeScript', 'Tailwind CSS'],
        experience: '1-3 years',
        salary: '₹7-14 LPA',
        description:
          'Build beautiful, performant user interfaces for our SaaS product. Work closely with design and backend teams.',
        requirements: [
          'React.js proficiency',
          'Redux state management',
          'TypeScript',
          'CSS / Tailwind',
          'REST APIs',
        ],
        category: 'Frontend',
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudTech Systems',
        location: 'Chennai, India',
        type: 'Full-time',
        techStack: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        experience: '3-6 years',
        salary: '₹15-25 LPA',
        description:
          'Looking for a DevOps Engineer to help build and maintain our cloud infrastructure and CI/CD pipelines.',
        requirements: [
          'AWS/Azure/GCP',
          'Docker & Kubernetes',
          'CI/CD pipelines',
          'Infrastructure as Code',
          'Linux administration',
        ],
        category: 'DevOps',
      },
      {
        title: 'Python Backend Developer',
        company: 'DataFlow Technologies',
        location: 'Noida, India',
        type: 'Full-time',
        techStack: ['Python', 'Django', 'FastAPI', 'PostgreSQL'],
        experience: '2-4 years',
        salary: '₹9-16 LPA',
        description:
          'Join our backend team to develop scalable Python services. Work on high-performance APIs and data pipelines.',
        requirements: [
          'Python expertise',
          'Django / FastAPI',
          'Database optimization',
          'API design',
          'Unit testing',
        ],
        category: 'Backend',
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Bangalore, India',
        type: 'Full-time',
        techStack: ['Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript'],
        experience: '2-4 years',
        salary: '₹8-14 LPA',
        description:
          'Design intuitive and beautiful user experiences for web and mobile applications. Collaborate with product and dev teams.',
        requirements: [
          'Figma / Sketch',
          'User research',
          'Prototyping',
          'HTML/CSS basics',
          'Design systems',
        ],
        category: 'Design',
      },
    ];
    await Job.insertMany(jobs);
    console.log('✅ Sample jobs seeded');
  }
}
