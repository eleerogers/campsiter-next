require('dotenv').config();

const path = require('path');
const express = require('express');
import { Request, Response } from 'express';
type ErrorRequestHandler = import('express').ErrorRequestHandler;
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const campgrounds = require('./routes/campgroundRoutes').default;
const users = require('./routes/userRoutes').default;
const comments = require('./routes/commentRoutes').default;
const compression = require('compression');

const app = express();

app.use(compression());

app.use(favicon(path.join(__dirname, "..", "..", "public", "favicon.ico")))

app.use(cookieSession({
  secret: process.env.EXPRESS_SECRET,
  keys: [],
  signed: false
}));

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('keyboard_cat'));
app.use(cors({
  credentials: true
}));

app.use('/api/users', users);
app.use('/api/campgrounds', campgrounds);
app.use('/api/comments', comments);


app.get('*', (req: Request, res: Response) => {
  console.log('index catch-all');
  res.sendFile('/app/dist/index.html');
});

// error handler middleware
const errorHandler: ErrorRequestHandler = (error, req, res) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
}

app.use(errorHandler);

app.listen(process.env.PORT || 5001, () => console.log(`Listening on port ${process.env.PORT || 5001}!`));
