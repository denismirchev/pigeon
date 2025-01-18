import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';

import BaseRouter from '@src/routes';
import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { NodeEnvs } from '@src/common/misc';

import RouteError from '@src/common/RouteError';
import cron from 'node-cron';
import AuthService from '@src/services/AuthService';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';


const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Serve static files from the 'public' directory
app.use(express.static('public', {
  setHeaders: (res) => {
    // Set the Cross-Origin-Resource-Policy header
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../apidoc.json'), 'utf8'),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


cron.schedule('*/5 * * * *', async () => {
  await AuthService.removeExpiredTokens();
});

export default app;
