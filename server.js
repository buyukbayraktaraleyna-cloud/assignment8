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

// Start the server and print the full local URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});