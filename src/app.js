const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const homestays = require('./routes/homestays');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/homestays', homestays);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Homestay Booking API'
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;