require('dotenv').config();

import express, { Request, Response } from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import campgrounds from './routes/campgroundRoutes';
import users from './routes/userRoutes';
import comments from './routes/commentRoutes';
import compression from 'compression';
type ErrorRequestHandler = express.ErrorRequestHandler;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.use(compression());

  app.use(session({
    secret: process.env.EXPRESS_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: dev ? false : true } // Use true if https is enabled on your server
  }));

  app.use(express.static('dist'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser('keyboard_cat'));
  app.use(cors({
    origin: function(origin, callback) {
      const allowedOrigins = ['http://localhost:3000', 'https://campsiter-next.vercel.app'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  

  app.use('/api/users', users);
  app.use('/api/campgrounds', campgrounds);
  app.use('/api/comments', comments);

  // Handle everything else with Next.js
  app.all('*', (req: Request, res: Response) => {
    console.log("catch all")
    return handle(req, res);
  });

  // error handler middleware
  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  }

  app.use(errorHandler);

  app.listen(process.env.PORT || 5001, () => console.log(`Listening on port ${process.env.PORT || 5001}!`));
});
