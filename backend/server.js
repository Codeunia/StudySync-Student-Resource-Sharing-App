// --- Import Core Packages ---
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';

// --- Import Custom Modules ---
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js'; // <= ADD THIS LINE
import resourceRoutes from './routes/resources.js';
import uploadRoutes from './routes/upload.js';
// --- Load Environment Variables ---
dotenv.config({ path: './backend/.env' });

// --- Initialize Express App & Passport ---
const app = express();
const PORT = process.env.PORT || 5000;
configurePassport(passport);

// --- Middleware Setup ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL // Your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes); // <= ADD THIS LINE
app.use('/api/resources', resourceRoutes);
app.use('/api/upload', uploadRoutes);
// TODO: Add your /api/resources route here later

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the Study Sync Backend!');
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});