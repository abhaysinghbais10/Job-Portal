const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const app = express();

// Rate limiters. In development everyone shares 127.0.0.1 and React
// StrictMode doubles requests, so limits are relaxed to avoid lock-outs.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 100 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 20 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// CORS: the Vite dev server proxies /api so this is mostly for direct calls.
// Allow CLIENT_URL plus any localhost origin during development.
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || origin === allowedOrigin) return cb(null, true);
      if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
  })
);
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

// Unknown API routes -> JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Central error handler (e.g. multer upload errors) -> always JSON
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Resume must be 5MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (err && /Only PDF, DOC, and DOCX/.test(err.message)) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

// ---------------------------------------------------------------------------
// Database connection
// Uses MONGO_URI (default: local MongoDB). If it is unreachable and we are not
// in production, fall back to an embedded in-memory-style MongoDB so that
// `npm install && npm run dev` works with no database installed.
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log(`✅ MongoDB connected (${MONGO_URI.replace(/\/\/.*@/, '//***@')})`);
    return;
  } catch (err) {
    if (isProd) throw err;
    console.warn(`⚠️  Could not reach MongoDB at ${MONGO_URI}: ${err.message}`);
  }

  console.log('⏳ Starting embedded MongoDB for development (first run downloads a binary, please wait)...');
  let MongoMemoryServer;
  try {
    ({ MongoMemoryServer } = require('mongodb-memory-server'));
  } catch {
    throw new Error(
      'No MongoDB available. Install MongoDB locally or set MONGO_URI in backend/.env to a MongoDB Atlas connection string.'
    );
  }

  const dbPath = path.join(__dirname, '.mongo-data');
  fs.mkdirSync(dbPath, { recursive: true });
  const server = await MongoMemoryServer.create({
    instance: { dbName: 'jobportal', dbPath, storageEngine: 'wiredTiger' },
  });
  await mongoose.connect(server.getUri('jobportal'));
  console.log('✅ Embedded MongoDB started (data stored in backend/.mongo-data)');

  const stop = async () => {
    await mongoose.disconnect().catch(() => {});
    await server.stop().catch(() => {});
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

async function start() {
  try {
    await connectDatabase();
    await seedJobs();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other process or change PORT in backend/.env`);
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

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

start();
