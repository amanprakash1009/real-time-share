require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// --- Initialize Express App ---
const app = express();

// --- Connect to Database ---
connectDB();

// --- Core Middleware ---
app.use(cors({
  origin: true, // Dynamically allow request origin (supports any localhost port in development)
  credentials: true,
}));
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// --- Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
