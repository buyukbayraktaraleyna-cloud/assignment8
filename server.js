import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module scope so the server works from any directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Read port from environment variable with a fallback to 3000
const PORT = process.env.PORT || 3000;

// Hard-coded study programme courses data
const COURSES = [
  { id: 'CS101', title: 'Introduction to Web Architecture', credits: 6 },
  { id: 'CS204', title: 'Backend Engineering with Node.js', credits: 6 },
  { id: 'CS305', title: 'Distributed Systems and APIs', credits: 5 },
  { id: 'CS402', title: 'Cloud Deployment and Security', credits: 5 }
];

// Counter variable to track total incoming requests since server start
let requestsServed = 0;

// Middleware 1: Logs timestamp, HTTP method, and requested URL
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
};

// Middleware 2: Increments the request counter on every incoming request
const requestCounter = (req, res, next) => {
  requestsServed += 1;
  next(); // Pass control forward
};

// Register middlewares before any routes or static file handlers
app.use(requestLogger);
app.use(requestCounter);

// Serve static files from the public directory regardless of working directory
app.use(express.static(path.join(__dirname, 'public')));

// Route: Plain text greeting containing student's name
app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Aleyna's server");
});

// Route: Plain text robots.txt file with explicit content-type
app.get('/robots.txt', (req, res) => {
  const robotsContent = 'User-agent: *\nDisallow: /api/admin\nAllow: /';
  res.type('text/plain').send(robotsContent);
});

// Route: Redirects visitors from /old-page to /hello
app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

// API Route: Returns the list of courses as a JSON array
app.get('/api/courses', (req, res) => {
  res.status(200).json(COURSES);
});

// API Route: Returns live Node.js process status and uptime
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Route: Echoes User-Agent and Accept request headers without mutating req
app.get('/api/headers', (req, res) => {
  res.status(200).json({
    userAgent: req.get('User-Agent') || 'Unknown',
    accept: req.get('Accept') || 'Unknown'
  });
});

// API Route: Simulates subscription creation and returns 201 Created
app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

// API Route: Simulates a restricted endpoint returning 403 Forbidden
app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

// API Route: Exposes the total number of requests served
app.get('/api/stats', (req, res) => {
  res.status(200).json({ requestsServed });
});

// Start the server and print the full local URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});