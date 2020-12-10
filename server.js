const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieparser = require('cookie-parser');
const fileupload = require('express-fileupload');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load ENV variables
dotenv.config({ path: './config/config.env' });

// Route Files
const socio = require('./routes/socio');
const categoria = require('./routes/categoria');
const attendance = require('./routes/attendance');
const info = require('./routes/info');
// const auth = require("./routes/auth");
// const users = require("./routes/users");
// const reviews = require("./routes/reviews");

// Connect to DB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieparser());

// Dev logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attack
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Prevent HPP attack
app.use(hpp());

// Prevent CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/api/v1/socios', socio);
app.use('/api/v1/categoria', categoria);
app.use('/api/v1/attendance', attendance);
app.use('/api/v1/info', info);
// app.use("/api/v1/auth", auth);
// app.use("/api/v1/users", users);
// app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close Server and exit process
  server.close(() => process.exit(1));
});
