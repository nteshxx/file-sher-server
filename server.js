require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const { errorConverter, errorHandler } = require('./middlewares/error');

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(','),
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
app.use(cors(corsOptions));

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());

app.use(express.static('public'));

const connectDB = require('./config/db');
connectDB();

app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/files', require('./routes/files'));
// app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found We are Monitoring It ☠️'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
