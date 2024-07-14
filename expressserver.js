// server.js (Main Server Setup)

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';


import mongooseDb from './db.utils/mongoose-connection.js';
import RegisterRouter from './router/auth/register.js';
import LoginRouter from './router/auth/login.js';
import ForgetPassword from './router/controller/forgetpassword.js';
import vendorRouter from './router/vendor.js';
import EventRouter from './router/event.js';
import budgetRouter from './router/budgetController.js';
import BookingRouter from './router/booking.js';
import ResetPassword from './router/controller/resetpassword.js';
import ProfileRouter from './router/profile.js'; // Assuming this is where ProfileRouter is defined
import UserRouter from './router/user.js';
import ExpenseRouter from './router/expence.js';
import { authApi } from './router/auth/auth.js';

// Load environment variables from .env file
dotenv.config();

const server = express();

// Connect to MongoDB using mongoose
await mongooseDb();

// Middleware
server.use(express.json());
server.use(cors());

// Custom middleware to log requests
const customMiddleware = (req, res, next) => {
  console.log(
    new Date().toISOString(),
    'Handling Request',
    req.method,
    req.originalUrl
  );
  next();
};




// Static folder for uploads
server.use('/uploads', express.static(path.resolve('uploads')));

// Apply middleware globally
server.use(customMiddleware);

// Routes
server.use('/registers', RegisterRouter);
server.use('/login', LoginRouter);
server.use('/vendors',authApi, vendorRouter); 
server.use('/events', EventRouter); 
server.use('/budgets', budgetRouter); 
server.use('/bookings',authApi, BookingRouter);

server.use('/profile', ProfileRouter);
server.use('/user', UserRouter);

server.use('/forget-password', ForgetPassword);
server.use('/expenses', authApi , ExpenseRouter);
server.use('/reset-password', ResetPassword);

// Start server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('Server is running on port', port);
});
